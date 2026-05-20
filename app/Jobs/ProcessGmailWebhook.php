<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ReceivedEmail;
use Google\Client;
use Google\Service\Gmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;
use Gemini\Enums\MimeType;
use Gemini\Data\Blob;
use Gemini\Laravel\Facades\Gemini;

class ProcessGmailWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $config;
    protected $msgId;

    // El constructor DEBE recibir y asignar las variables
    public function __construct($config, $msgId)
    {
        $this->config = $config;
        $this->msgId = $msgId;

        
    }


    public $tries = 3;
    // Esperará 10 segundos antes del primer reintento, 20 del segundo...
    public $backoff = [10, 20, 60]; 
    public $timeout = 240;

    public function handle()
    {   
        // 1. Doble verificación de seguridad
        if (ReceivedEmail::where('gmail_message_id', $this->msgId)->exists()) {
            return;
        }  

        $receivedEmail = ReceivedEmail::updateOrCreate(
            ['gmail_message_id' => $this->msgId],
            [
                'mail_config_id' => $this->config->id,
                'received_at'    => now(),
                'filing_number'  => $this->getFilingNumber($this->msgId), 
            ]
        );

        try {
            // 2. Configurar el cliente de Google dentro del Job
            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->refreshToken($this->config->refresh_token);
            $service = new Gmail($client);

            // 3. Obtener el mensaje completo
            $fullMessage = $service->users_messages->get('me', $this->msgId);
            $payload = $fullMessage->getPayload();
            
            // Extraer Headers
            $headers = $payload->getHeaders();
            $subject = '';
            $from = '';
            foreach ($headers as $header) {
                if ($header->getName() == 'Subject') $subject = $header->getValue();
                if ($header->getName() == 'From') $from = $header->getValue();
            }

            // 4. Procesar Adjuntos
            $attachments = [];
            $parts = $payload->getParts() ?? [];

            foreach ($parts as $part) {
                if (!empty($part->getFilename())) {
                    $attachmentId = $part->getBody()->getAttachmentId();
                    $filename = $part->getFilename();

                    $attachmentObj = $service->users_messages_attachments->get('me', $this->msgId, $attachmentId);
                    $data = $attachmentObj->getData();
                    $fileContent = base64_decode(strtr($data, '-_', '+/'));

                    $path = 'adjuntos_correos/' . time() . '_' . $filename;
                    Storage::put($path, $fileContent);

                    $attachments[] = [
                        'name' => $filename,
                        'mime' => $part->getMimeType(),
                        'path' => $path,
                        'content_base64' => $data,
                    ];
                }
            }

            // 5. Cuerpo y Radicado
            $body = $this->getFullBody($fullMessage);
            // $filingNumber = generateFilingNumber(4, 0);

            $receivedEmail->update([
                'subject'     => $subject,
                'sender'      => $from,
                'body'        => $body,
                'attachments' => json_encode($attachments),
                'has_attachments' => count($attachments) > 0,
            ]);

            // 7. IA
            $this->analyzeEmailWithGemini($receivedEmail, $service, $attachments);

        } catch (\Exception $e) {
            $this->manejarErrorGlobal($e, $receivedEmail);
            Log::error("Error procesando mensaje {$this->msgId}: " . $e->getMessage());
            throw $e; // Reintenta el job
        }
    }


    private function analyzeEmailWithGemini($emailModel, $gmailService, $attachments)
    {
        set_time_limit(240);

        $distributionUnitRepository = app(\App\Repositories\DistributionUnitRepository::class);
        $expFilesTypeDocRepository = app(\App\Repositories\ExpFilesTypeDocRepository::class);

        $unidadesDisrtibucion = $distributionUnitRepository->listFull();
        $tipoDocumentales = $expFilesTypeDocRepository->all();

        $valoresUnidad = $unidadesDisrtibucion->map(function ($item) {
            return Arr::except($item->toArray(), [
                'id_dependency',
                'created_at',
                'updated_at',
                'created_at',
                'central_bool',
                'id_mail'
            ]);
        });

        $valoresTiposDocumentos = $tipoDocumentales->map(function ($item) {
            return Arr::except($item->toArray(), [
                'name_en',
                'nombre',
                'updated_at'
            ]);
        });

        $bodyLimpio = strip_tags($emailModel->body);
        
        $prompt = "
            Actúa como un gestor documental experto de Cortolima (Corporación Autónoma Regional del Tolima).
            Tu objetivo es clasificar correspondencia ambiental de forma precisa.

            Contexto Institucional:
            Cortolima es la autoridad ambiental del Tolima, Colombia. Maneja: 
            - Denuncias por infracciones ambientales (tala, contaminación).
            - Conservación y Biodiversidad.
            - Trámites de concesión de aguas y licencias.
            - Programas de Pagos por Servicios Ambientales (PSA).

            Analiza el correo:
            Asunto: {$emailModel->subject}
            Cuerpo: {$bodyLimpio}

            INSTRUCCIÓN ADICIONAL PARA ADJUNTOS:
            Se han adjuntado documentos (PDF o Imágenes) extraídos de este correo. Por favor, lee su contenido con atención. Si el adjunto contiene mapas, denuncias formales, sellos, resoluciones o información vital que complemente el correo, usa esa información para tomar tu decisión de clasificación.

            Tareas de Clasificación:
            1. Clasifica el correo en UNA de estas categorías según el contenido:
                {$valoresUnidad}
            2. Clasificar el correo un ripo documental segun el contenido:
                {$valoresTiposDocumentos}

            Reglas Críticas:
                - Si el correo menciona 'IA', 'ChatGPT', 'Gemini' o 'Inteligencia Artificial', clasifica como (Spam).
                - Si es una consulta sobre proyectos venta sin relacion ambiental, luz o otras, clasifica como (Otras).
                - Si Consideras que no tiene relacion con ninguna unidad de distribucion, clasifica como (Otras).
                - Responde ÚNICAMENTE el objeto JSON.
                - Revisa los documetos o imagenes como anexos y segun lo que diga los documentos un resumen breve y un tipo documental (Demanda,anexo,ejemplo,sin fundamento, otros)

            Formato de salida OBLIGATORIO (Responde estrictamente en JSON):
            {
                \"id_unidad\": <numero_entero_id>,
                \"nombre_unidad\": \"<nombre_exacto_de_la_lista>\",
                \"directa\": <null_o_1_o_2>,
                \"id_TipoDocumental\": \"<numero_entero_id>\",
                \"name_TipoDocumental\": \"<nombre_exacto_de_la_lista>\",
                \"Anexos\": \"resumen\": \"<resumen_maximo_350_caracteres_de_todos_los_adjuntos>\"
            }

            REGLAS DE FORMATO:
            1. 'directa': Usa 1 para Spam, 2 para Otros. Si es una unidad válida, usa null.
            2. 'Anexos': Debe ser un ARRAY de objetos. Si no hay archivos, envía un array vacío [].
            3. No incluyas explicaciones fuera del JSON.
            4. Si hay múltiples adjuntos, crea un objeto por cada uno dentro de la lista 'Anexos'.
            5. si no hay un tipo documental acorde con el documento colocar  \"SIN REFERENCIA DE TIPO DOCUMENTAL\"
        ";

        // 1. Preparar el array de datos para la IA (Texto primero)
        $geminiParts = [$prompt];
        $archivosProcesados = 0;

        // 2. Adjuntar los archivos físicos leídos desde el Storage
        foreach ($attachments as $att) {
            // Límite estricto: Máximo 2 documentos para ahorrar tokens
            if ($archivosProcesados >= 2) {
                break;
            }

            // Gemini soporta nativamente PDF e Imágenes
            $mime = strtolower($att['mime']);
            $supportedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

            if (in_array($mime, $supportedMimes) && Storage::exists($att['path'])) {
                try {
                    // Leer el archivo físico que guardaste en receiveWebhook
                    $fileBytes = Storage::get($att['path']);
                    
                    // Determinar el Enum de MimeType (Si tu versión del SDK no tiene el Enum específico, puedes pasar el string del mime)
                    $mimeEnum = match($mime) {
                        'application/pdf' => MimeType::APPLICATION_PDF ?? 'application/pdf',
                        'image/jpeg'      => MimeType::IMAGE_JPEG,
                        'image/png'       => MimeType::IMAGE_PNG,
                        'image/webp'      => MimeType::IMAGE_WEBP,
                        default           => MimeType::IMAGE_JPEG,
                    };

                    // Agregarlo como un objeto Blob (requerido por el SDK de Laravel para Gemini)
                    $geminiParts[] = new Blob(
                        mimeType: $mimeEnum,
                        data: base64_encode($fileBytes)
                    );

                    $archivosProcesados++;
                } catch (\Exception $e) {
                    Log::warning("No se pudo cargar el adjunto para Gemini: " . $att['path'] . ". Error: " . $e->getMessage());
                }
            }
        }

        try {
            // utilizamos gemini-3.1-flash-lite-preview   

            $result = Gemini::generativeModel('models/gemini-2.5-flash-lite')->generateContent($geminiParts);
            
            $textResponse = $result->text();

            $cleanJson = preg_replace('/^```json\s*|```$/', '', $textResponse);
            $aiResponse = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("La IA no devolvió un JSON válido: " . $textResponse);
            }

            Log::info('Respuesta De la IA procesada exitosamente. ' . json_encode($aiResponse, JSON_PRETTY_PRINT));

            $respuestaL = json_encode($aiResponse, JSON_PRETTY_PRINT);

            $emailModel->update([
                'sugerencia_ia' => $respuestaL,
            ]);
        } catch (\Exception $e) {
            $message = $e->getMessage();

            // 1. Preparamos un array para que SIEMPRE sea un JSON válido
            $errorParaBaseDeDatos = json_encode([
                'error' => true,
                'mensaje_tecnico' => $message,
                'intentado_en' => now()->toDateTimeString()
            ]);

            // 2. Guardamos el error en la BD de forma segura
            if (isset($receivedEmail)) {
                $receivedEmail->update([
                    'sugerencia_ia' => $errorParaBaseDeDatos
                ]);
            }

            // 3. Manejo de reintentos según el tipo de error
            if (str_contains($message, 'high demand') || str_contains($message, '503')) {
                Log::warning("Gemini saturado, reintentando en 1 minutos... $emailModel->subject");
                return $this->release(60); 
            }

            if (str_contains($message, 'timed out') || str_contains($message, 'cURL error 28')) {
                Log::warning("Timeout en Gemini, reintentando según configuración de ...");
                throw $e; // Esto dispara el reintento automático del Job
            }

            Log::error("Error procesando mensaje {$this->msgId}: " . $message);
            throw $e;
        }
    }

    // funciones privadas

    private function manejarErrorGlobal($e, $receivedEmail)
    {
        $message = $e->getMessage();
        Log::error("Error en Job para mensaje {$this->msgId}: " . $message);

        if (isset($receivedEmail)) {
            $receivedEmail->update([
                'sugerencia_ia' => json_encode([
                    'error' => true,
                    'mensaje' => 'Error en proceso',
                    'detalle' => $message,
                    'intentado_en' => now()->toDateTimeString()
                ])
            ]);
        }

        // Manejo de reintentos
        if (str_contains($message, 'high demand') || str_contains($message, '503')) {
            return $this->release(120);
        }

        throw $e; // Reintenta el job para otros errores como el "Deadline expired"
    }

    private function getFilingNumber($msgId) {
        $existente = ReceivedEmail::where('gmail_message_id', $msgId)->first();
        return $existente ? $existente->filing_number : generateFilingNumber(4, 0);
    }


    private function getFullBody($message) {
        $payload = $message->getPayload();
        return $this->decodeParts($payload);
    }

    private function decodeParts($part) {
        $body = "";
        if ($part->getBody()->getData()) {
            $body = base64_decode(str_replace(['-', '_'], ['+', '/'], $part->getBody()->getData()));
        }

        if ($part->getParts()) {
            foreach ($part->getParts() as $subPart) {
                if ($subPart->getMimeType() == 'text/html') {
                    return base64_decode(str_replace(['-', '_'], ['+', '/'], $subPart->getBody()->getData()));
                }
                if ($subPart->getMimeType() == 'text/plain') {
                    $body = base64_decode(str_replace(['-', '_'], ['+', '/'], $subPart->getBody()->getData()));
                }
                // Recursión si hay más partes
                if ($subPart->getParts()) {
                    $result = $this->decodeParts($subPart);
                    if ($result) return $result;
                }
            }
        }
        return $body;
    }
}