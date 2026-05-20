<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Log;
use App\Models\ResponseTemplate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Filing;
use Illuminate\Support\Facades\Crypt;

class OnlyOfficeController extends Controller{

    protected $isLocal;

    public function __construct()
    {

    }

    // public function getfileOnly(Request $request)
    // {
    //     try {
    //         $path = Crypt::decryptString(urldecode($request->path));
    //         $filePath = storage_path('app/public/' . $path);

    //         return response()->download($filePath,basename($path));

    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Path inválido'], 400);
    //     }
    // }

    public function getfileOnly(Request $request) {
        try {
            $path = Crypt::decryptString($request->path);
            
            // El secreto está en estos 3 headers para saltar Ngrok
            return response()->file(storage_path("app/public/" . $path), [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'ngrok-skip-browser-warning' => '69420',
                'User-Agent' => 'OnlyOffice Conversion Service'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }
    }

    public function verDocumentoLinea(Request $request) {
        // 1. Limpiar el ID
        $responseId = str_replace('response_', '', $request->response_id);
        $temple = ResponseTemplate::findOrFail($responseId);

        // $baseUrl = config('app.url');
        // $baseUrl = 'http://192.168.77.16/cortolima/public';
        $baseUrl = 'https://compress-debrief-heaving.ngrok-free.dev';

        // 3. Generar URLs
        $pathDocumento = $temple->template_url;
        $urlParaDocker = $baseUrl . "/api/getfileOnly?path=" . urlencode(Crypt::encryptString($pathDocumento));

        // PRUEBA DE PING: Intentamos ver si el servidor responde a su propia IP pública
        $testSelf = @file_get_contents($urlParaDocker, false, stream_context_create(["http" => ["timeout" => 2]]));
        $canSelfResolve = ($testSelf !== false) ? "SI" : "NO";

        $callbackParaDocker = "{$baseUrl}/api/guardar-documento-en-linea/" . $responseId;

        $documentKey = "doc_" . $temple->id . "_" . strtotime($temple->updated_at);

        $payload = [
            "document" => [
                "fileType" => "docx",
                "key" => $documentKey,
                "title" => $temple->name ?? "Documento.docx",
                "url" => $urlParaDocker,
            ],
            "documentType" => "word",
            "editorConfig" => [
                "callbackUrl" => $callbackParaDocker,
                "lang" => "es",
                "mode" => "edit",
                "user" => [
                    "id" => (string)auth()->id(),
                    "name" => auth()->user()->usuario
                ],
                "customization" => [
                    "forcesave" => true
                ]
            ]
        ];

        $secret = env('ONLYOFFICE_SECRET');
        $token = JWT::encode($payload, $secret, 'HS256');

        return response()->json([
            ...$payload,
            "token" => $token,
            "debug" => [
                'cuerpo' => $payload,
                "url_generada" => $urlParaDocker,
                "laravel_se_ve_a_si_mismo" => $canSelfResolve,
                "ip_servidor" => $_SERVER['SERVER_ADDR'] ?? 'No detectada'
            ]
            
        ]);
    }
    public function verDocumentoLineaSolo(Request $request) {
        // 1. Limpiar el ID
        $responseId = str_replace('response_', '', $request->response_id);
        $temple = ResponseTemplate::findOrFail($responseId);

        // $baseUrl = config('app.url');
        // $baseUrl = 'http://192.168.77.16/cortolima/public';
        $baseUrl = 'https://compress-debrief-heaving.ngrok-free.dev';

        // 3. Generar URLs
        $pathDocumento = $temple->template_url;
        $urlParaDocker = $baseUrl . "/api/getfileOnly?path=" . urlencode(Crypt::encryptString($pathDocumento));

        // PRUEBA DE PING: Intentamos ver si el servidor responde a su propia IP pública
        $testSelf = @file_get_contents($urlParaDocker, false, stream_context_create(["http" => ["timeout" => 2]]));
        $canSelfResolve = ($testSelf !== false) ? "SI" : "NO";

        $callbackParaDocker = "{$baseUrl}/api/guardar-documento-en-linea/" . $responseId;

        $documentKey = "doc_" . $temple->id . "_" . strtotime($temple->updated_at);

        $payload = [
            "document" => [
                "fileType" => "docx",
                "key" => $documentKey,
                "title" => $temple->name ?? "Documento.docx",
                "url" => $urlParaDocker,
            ],

            "documentType" => "word",

            "editorConfig" => [

                "callbackUrl" => $callbackParaDocker,

                "lang" => "es",
                "mode" => "view",

                "user" => [
                    "id" => (string) auth()->id(),
                    "name" => auth()->user()->usuario
                ],

                "customization" => [

                    // ocultar interfaz
                    "toolbar" => false,
                    "header" => false,
                    "statusBar" => false,

                    // desactivar cosas
                    "autosave" => false,
                    "forcesave" => false,
                    "comments" => false,
                    "chat" => false,
                    "help" => false,
                    "feedback" => false,

                    // toolbar compacta
                    "compactToolbar" => true
                ]
            ]
        ];

        $secret = env('ONLYOFFICE_SECRET');
        $token = JWT::encode($payload, $secret, 'HS256');

        return response()->json([
            ...$payload,
            "token" => $token,
            "debug" => [
                'cuerpo' => $payload,
                "url_generada" => $urlParaDocker,
                "laravel_se_ve_a_si_mismo" => $canSelfResolve,
                "ip_servidor" => $_SERVER['SERVER_ADDR'] ?? 'No detectada'
            ]
            
        ]);
    }

    public function guardarDocumentoEnLinea_v1(Request $request, $id) {
        $data = $request->all();
        
        Log::info("Callback OnlyOffice Recibido", ['status' => $data['status'] ?? 'N/A']);
        if (isset($data['status']) && ($data['status'] == 2 || $data['status'] == 6)) {
            $downloadUrlOriginal = $data['url']; 

            $downloadUrlInterna = str_replace('onlyoffice.181.49.45.246.nip.io', '192.168.77.15', $downloadUrlOriginal);

            Log::info("Intentando descarga fresca", ['url' => $downloadUrlInterna]);

            try {
                $response = Http::withoutVerifying()
                    ->withHeaders([
                        'Host' => 'onlyoffice.181.49.45.246.nip.io'
                    ])
                    ->timeout(60)
                    ->get($downloadUrlInterna);

                if ($response->successful()) {
                    $fileContent = $response->body();
                    $temple = ResponseTemplate::findOrFail($id);
                    Storage::disk('public')->put($temple->template_url, $fileContent);
                    $temple->touch(); 

                    Log::info("¡Guardado exitoso!");
                    return response()->json(['error' => 0]);
                } else {
                    // Si aquí sale 410, es porque Laravel tardó demasiado en procesar el callback
                    Log::error("Error en descarga", ['status' => $response->status()]);
                    return response()->json(['error' => 1]);
                }
            } catch (\Exception $e) {
                Log::error("Error conexión: " . $e->getMessage());
                return response()->json(['error' => 1]);
            }
        }
        return response()->json(['error' => 0]);
    }

    public function guardarDocumentoEnLinea(Request $request, $id) 
    {
        $data = $request->all();
        
        // 1. Log fundamental para saber qué nos está enviando OnlyOffice
        Log::info("Callback OnlyOffice Recibido", [
            'status' => $data['status'] ?? 'N/A',
            'url_recibida' => $data['url'] ?? 'No hay URL'
        ]);

            // Status 2: Documento listo para guardar. Status 6: Documento guardado por fuerzasave.
        if (isset($data['status']) && ($data['status'] == 2 || $data['status'] == 6)) {
            
            $downloadUrl = $data['url']; 

            // 2. Ajuste de Dominios (Si OnlyOffice y Laravel están en la misma red local)
            // Reemplazamos el nuevo dominio de Ngrok por la IP local del servidor de OnlyOffice
            // según tu configuración previa (192.168.77.15)
            $nuevoDominioOnly = 'demotion-unchanged-gutter.ngrok-free.dev';
            $ipInternaOnly = '192.168.77.15'; // Tu IP local donde vive OnlyOffice

            if (str_contains($downloadUrl, $nuevoDominioOnly)) {
                $downloadUrl = str_replace($nuevoDominioOnly, $ipInternaOnly, $downloadUrl);
            }

            Log::info("Intentando descarga del documento editado", ['url_final' => $downloadUrl]);

            try {
                // 3. Realizar la descarga
                $response = Http::withoutVerifying()
                    ->withHeaders([
                        'Host' => $nuevoDominioOnly, // Es vital mantener el Host original para que el servidor sepa quién es
                        'ngrok-skip-browser-warning' => 'true' // Por si el OnlyOffice de salida también tiene advertencia
                    ])
                    ->timeout(120) // Aumentamos un poco el tiempo por si el archivo es pesado
                    ->get($downloadUrl);

                if ($response->successful()) {
                    $fileContent = $response->body();
                    
                    // 4. Buscar el registro y guardar
                    $temple = ResponseTemplate::findOrFail($id);
                    
                    // Importante: Asegúrate de que el disk sea el correcto (public o local)
                    Storage::disk('public')->put($temple->template_url, $fileContent);
                    
                    // Actualizamos la fecha para que el 'key' cambie la próxima vez
                    $temple->touch(); 

                    Log::info("¡Documento id:{$id} guardado exitosamente desde OnlyOffice!");
                    
                    // Respuesta obligatoria para OnlyOffice (error 0 significa OK)
                    return response()->json(['error' => 0]);
                } else {
                    Log::error("Error en descarga desde OnlyOffice", [
                        'status_http' => $response->status(),
                        'cuerpo_error' => $response->body()
                    ]);
                    return response()->json(['error' => 1]);
                }
            } catch (\Exception $e) {
                Log::error("Error crítico en el Callback de guardado: " . $e->getMessage());
                return response()->json(['error' => 1]);
            }
        }

        // Para status 1 (editando), 4 (cerrado sin cambios), etc.
        return response()->json(['error' => 0]);
    }

    public function convertirPdf(Request $request)
    {
        $responseId = str_replace('response_', '', $request->response_id);
        $temple = ResponseTemplate::findOrFail($responseId);
        $filing = Filing::findOrFail($temple->filings_id);

        $miBaseUrl = 'https://compress-debrief-heaving.ngrok-free.dev';
        $dominioAmiga = 'demotion-unchanged-gutter.ngrok-free.dev';
        $conversionUrl = "https://{$dominioAmiga}/ConvertService.ashx";

        $urlDondeEllaDescarga = $miBaseUrl . "/api/getfileOnly?path=" . urlencode(Crypt::encryptString($temple->template_url));
        $documentKey = "doc_" . $temple->id . "_" . strtotime($temple->updated_at);

        $payload = [
            "async" => false, 
            "filetype" => "docx",
            "key" => $documentKey,
            "outputtype" => "pdf",
            "title" => $temple->name ?? "Documento.docx",
            "url" => $urlDondeEllaDescarga,
        ];

        $secret = env('ONLYOFFICE_SECRET');
        $token = JWT::encode($payload, $secret, 'HS256');

        try {
            // 2. Aumentamos el timeout a 120 segundos para estar seguros
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'ngrok-skip-browser-warning' => 'true',
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json',
                ])
                ->timeout(60) 
                ->post($conversionUrl, ["token" => $token]);

            $data = $response->json();

            if (isset($data['fileUrl'])) {
                $descargaPdf = Http::withoutVerifying()
                    ->withHeaders([
                        'Host' => 'demotion-unchanged-gutter.ngrok-free.dev'
                    ])
                    ->timeout(60)
                    ->get($data['fileUrl']);

            
                if ($descargaPdf->successful()) {

                    $docxPathRelative = $temple->template_url;
                    $pdfName = 'respuesta_final.pdf';
                    $directory = dirname($docxPathRelative);
                    $pdfUrlRelative = $directory . '/' . $pdfName;

                    Storage::disk('public')->put($pdfUrlRelative, $descargaPdf->body());

                    if (Storage::disk('public')->exists($docxPathRelative)) {
                        Storage::disk('public')->delete($docxPathRelative);
                    }

                    $temple->template_url = $pdfUrlRelative;
                    $temple->state = 4; // Estado de firmado/convertido
                    $temple->save();

                    // 4. Actualizar el Filing (Radicado)
                    if ($filing) {
                        $filing->template_url = $pdfUrlRelative;
                        $filing->template_name = $pdfName;
                        $filing->save();
                    }

                    // 5. Retornar respuesta exitosa
                    return response()->json([
                        'success' => true,
                        'pdf_url' => asset('storage/' . $pdfUrlRelative),
                        'message' => 'Documento convertido y guardado correctamente'
                    ]);
                }
            }
            return response()->json([
                'success' => false,
                'error' => 'OnlyOffice no devolvió la URL del archivo.',
                'debug' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => "Error de conexión: " . $e->getMessage()
            ]);
        }
    }
}