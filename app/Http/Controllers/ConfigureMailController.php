<?php

namespace App\Http\Controllers;

use App\Repositories\MailConfigRepository;
use App\Repositories\ReceivedEmailRepository;
use App\Repositories\DistributionUnitRepository;
use App\Http\Controllers\FilingController;
use Illuminate\Http\Request;
use App\Models\ReceivedEmail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\WatchRequest;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Gemini\Data\Blob;
use Gemini\Enums\MimeType;
use App\Jobs\ProcessGmailWebhook;;

class ConfigureMailController extends Controller
{
    public function __construct(private MailConfigRepository $mailConfigRepository, private DistributionUnitRepository $distributionUnitRepository , private FilingController $filingController, private ReceivedEmailRepository $receivedEmailRepository)
    {
    }

    // Mail Configs Methods
    public function index()
    {
        return Inertia::render('Configuration/mail_configs/Index');
    }

    public function create()
    {
        return Inertia::render('Configuration/mail_configs/Create');
    }

    public function edit(String $id)
    {
        $mailConfig = $this->mailConfigRepository->find($id);
        return Inertia::render('Configuration/mail_configs/Create', compact('mailConfig'));
    }

    public function store(Request $request)
    {

        $data = $this->mailConfigRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    public function update(Request $request, String $id)
    {
        $request['id'] = $id;
        $data = $this->mailConfigRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    public function mailConfigList(Request $request)
    {
        $data = $this->mailConfigRepository->list($request->all());
        return response()->json($data);
    }

    public function mailConfigShow(String $id)
    {
        $object = $this->mailConfigRepository->find($id);
        return response()->json($object);
    }

    public function destroy(String $id)
    {
        $object = $this->mailConfigRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    public function destroyReceivedEmail(String $id)
    {
        $object = $this->receivedEmailRepository->find($id);

        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }

        return response()->json([
            'success' => true
        ], 200);
    }

    public function receiveWebhook(Request $request) 
    {
        // 1. Recibir y decodificar rápido
        $data = $request->input('message.data');
        if (!$data) return response()->json(['error' => 'No data'], 400);

        $decodedData = json_decode(base64_decode($data), true);
        $emailAddress = $decodedData['emailAddress'] ?? null;

        if (!$emailAddress) {
            return response()->json(['status' => 'No email address found'], 200);
        }

        // 2. Buscar configuración
        $config = $this->mailConfigRepository->findByEmail($emailAddress);
        if (!$config) {
            return response()->json(['status' => 'Not found'], 200);
        }

        // 3. Obtener el ID del mensaje ANTES de procesar nada pesado
        try {
            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->refreshToken($config->refresh_token);
            
            $service = new Gmail($client);
            $messages = $service->users_messages->listUsersMessages('me', ['maxResults' => 1]);
            $messageList = $messages->getMessages();

            if (count($messageList) > 0) {
                $msgId = $messageList[0]->getId();

                $exists = ReceivedEmail::where('gmail_message_id', $msgId)->exists();
                if ($exists) {
                    return response()->json(['status' => 'already processed'], 200);
                }

                // (Tarea en segundo plano)
                ProcessGmailWebhook::dispatch($config, $msgId);
            }

        } catch (\Exception $e) {
            Log::error("Error en Webhook: " . $e->getMessage());
        }

        // 5. Responder rápido a Google
        return response()->json(['status' => 'accepted'], 200);
    }

    public function redirectToGoogle(String $id)
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        
        // Scopes necesarios para leer correos y gestionar la suscripción
        $client->addScope(Gmail::GMAIL_READONLY);
        $client->addScope(Gmail::GMAIL_MODIFY); 
        
        $client->setAccessType('offline'); // CRUCIAL para obtener el refresh_token
        $client->setPrompt('consent');     // Fuerza a Google a darte el refresh_token
        
        $client->setState(base64_encode(json_encode(['id' => $id])));

        return redirect()->away($client->createAuthUrl());
    }

    public function handleGoogleCallback(Request $request)
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));

        // Intercambiamos el código que nos da Google por tokens
        $token = $client->fetchAccessTokenWithAuthCode($request->get('code'));
        
        // Recuperamos el ID que enviamos en el State
        $state = json_decode(base64_decode($request->get('state')), true);

        if (isset($token['refresh_token'])) {
            // 1. Guardar el refresh_token en tu DB usando tu Repository
            $this->mailConfigRepository->updateTokens($state['id'], [
                'refresh_token' => $token['refresh_token'],
                'access_token'  => json_encode($token),
            ]);

            // 2. ACTIVAR LA VIGILANCIA (Watch)
            $client->setAccessToken($token);
            $service = new Gmail($client);
            $watchRequest = new WatchRequest();
            $watchRequest->setTopicName('projects/radicacionautomatica/topics/gmail-notifications');
            
            $service->users->watch('me', $watchRequest);

            return Inertia::render("Configuration/Distribution/Index", []);
        }

        return "Error: No se recibió el refresh_token. Intenta desvincular la app desde tu cuenta de Google y repite.";
    }

}
