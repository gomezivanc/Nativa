<?php

namespace App\Http\Controllers;

use App\Mail\CopiarACorreo;
use App\Mail\notificacionMailable;
use App\Models\Filing;
use App\Models\ResponseTemplate;
use App\Models\PayrollManagement;
use App\Models\User;
use App\Models\FilingWorkflow;
use App\Models\ReceivedEmail;
use App\Repositories\AssociatedFilingRepository;
use App\Repositories\CancellationRequestFilingRepository;
use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\ExpFilesRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\FilingExpFileRepository;
use App\Repositories\FilingLogRepository;
use App\Repositories\AnswerRepository;
use App\Repositories\FilingRepository;
use App\Repositories\FilingWorkflowRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\ReceptionMediumRepository;
use App\Repositories\TipoTramiteRepository;
use App\Repositories\DistributionUnitRepository;
use App\Repositories\SignedFilingRepository;
use App\Repositories\ChargeDocFilingRepository;
use App\Repositories\TypePersonRepository;
use App\Repositories\UsuarioRepository;
use App\Repositories\ResponseEmailRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Mail\NotificacionRemitenteFuncionario;
use App\Repositories\HoursWorkNotRepository;
use App\Repositories\CopyFilingRepository;
use App\Repositories\ThirdsRepository;
use App\Repositories\SignatoriesRepository;
use App\Repositories\ResponseTemplateRepository;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\File;
use Spatie\FlareClient\View;

class FilingController extends Controller
{
    public function __construct(
        private FilingRepository $filingRepository,
        private ExpFilesClasificationsRepository $expFilesClasificationsRepository,
        private ExpFilesTypeDocRepository $expFilesTypeDocRepository,
        private ReceptionMediumRepository $receptionMediumRepository,
        private PriorityRepository $priorityRepository,
        private TypePersonRepository $typePersonRepository,
        private FilingWorkflowRepository $filingWorkflowRepository,
        private SignedFilingRepository $signedFilingRepository,
        private AssociatedFilingRepository $associatedFilingRepository,
        private FilingExpFileRepository $filingExpFileRepository,
        private CancellationRequestFilingRepository $cancellationRequestFilingRepository,
        private ExpFilesRepository $expFilesRepository,
        private FilingLogRepository $filingLogRepository,
        private UsuarioRepository $usuarioRepository,
        private TipoTramiteRepository $tipoTramiteRepository,
        private ThirdsRepository $thirdsRepository,
        private SignatoriesRepository $signatoriesRepository,
        private ResponseTemplateRepository $responseTemplateRepository,
        private AnswerRepository $answerRepository,
        private HoursWorkNotRepository $hoursNotWorkRepository,
        private DistributionUnitRepository $distributionUnitRepository,  
        private ChargeDocFilingRepository $chargeDocFilingRepository,
        private ResponseEmailRepository $responseEmailRepository,
        private CopyFilingRepository $copyFilingRepository,
    ) {
    }

    function index(Request $request)
    {
        return Inertia::render("filing/standard_filing/Index", []);
    }

    function create(Request $request)
    {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        $receptionMedium = $this->receptionMediumRepository->all();
        $priorities = $this->priorityRepository->all();
        $typePerson = $this->typePersonRepository->all();
        $currentLocale = App::getLocale();
        return Inertia::render("filing/standard_filing/Create", compact('clasifications', 'currentLocale', 'typeDocs', 'receptionMedium', 'priorities', 'typePerson'));
    }

    public function filing_number(Request $request)
    {
        // $dependencia = $request->input('dependency_id') ?? 0;
        $tipoDocumento = $request->input('types_filings_id') ?? 0;

        $filingNumber = $this->generateFiling($tipoDocumento);
        if (isset($filingNumber['error'])) {
            return response()->json(['error' => $filingNumber['error']], 400);
        }
        return response()->json([
            'filing_number' => $filingNumber
        ]);
    }

    public function searchThirdByDocument(Request $request)
    {
        $document = $request->input('document_nit_sender');
        
        if (!$document) {
            return response()->json(['found' => false]);
        }
        $third = $this->thirdsRepository->findByDocument($document);

        if ($third) {
            return response()->json([
                'found' => true,
                'data' => [
                    'id' => $third->id,
                    'name_social_reason_sender' => $third->name_social_reason_sender,
                    'first_surname_legal_representative_sender' => $third->first_surname_legal_representative_sender,
                    'type_person_id' => $third->type_person_id,
                    'email_sender' => $third->email_sender,
                    'phone_sender' => $third->phone_sender,
                    'address_sender' => $third->address_sender,
                    'country_id' => $third->country_id,
                    'department_id' => $third->department_id,
                    'city_id' => $third->city_id,
                ]
            ]);
        }

        return response()->json(['found' => false]);
    }

    public function searchIasFiled(Request $request)
    {
        $iasFiled = $request->input('ias_filed');
        
        if (!$iasFiled || strlen(trim($iasFiled)) === 0) {
            return response()->json(['exists' => false]);
        }

        $filing = Filing::where('ias_filed', trim($iasFiled))->first();

        if ($filing) {
            return response()->json([
                'exists' => true,
                'filing_number' => $filing->filing_number,
                'message' => "Radicado IAS ya existe con el número: {$filing->filing_number}"
            ]);
        }

        return response()->json(['exists' => false]);
    }

    private function generateFiling($tipoDocumento , $answer = 0)
    {
        $filingNumber = generateFilingNumber($tipoDocumento , $answer);
        if (isset($filingNumber['error'])) {
            return $filingNumber;
        }
        return $filingNumber;
    }

    // store - update
    function store(Request $request)
    {
        if ($request->masive == true) {
            return $this->masiveFiling($request);
        }

        try {
            if (empty($request['id'])) {
                $request['creado_por_id'] = Auth::user()->id;
            }

            // Procesar series y subseries
            if (!empty($request['sub_serie'])) {
                $request['serie'] = $request['serie'];
                $request['sub_serie'] = $request['sub_serie'];
            } else {
                $request['serie'] = null;
                $request['sub_serie'] = null;
            }
            $data = Arr::except($request->all(), ['associated_filings', 'masive', 'expiration_date', 'masive_destinatary', 'template', 'no_response' , 'filesList' ,'data_exit','dependency_id_uniti']);

            // Calcular la fecha de expiración
            $data["expiration_date"] = Carbon::now()->addDays($request->input('remaining_days'));

            //Asignar La unidad De Distribucion
            $distributionId = $this->distributionUnitRepository->getIdByDependencyUniti($request->dependency_id_uniti); 

            $data['distribution_id_filing'] = $request->dependency_id_uniti;
            $data['dependency_id'] = $distributionId; 

            if (!$distributionId) {
                return response()->json([
                    'error' => 'Dependencia sin unidad de correspondencia'
                ], 409);
            }

            // Validar que el número de radicado sea único
            if (!empty($data['filing_number'])) {
                $existingFiling = Filing::where('filing_number', $data['filing_number'])->first();
                if ($existingFiling) {
                    return response()->json([
                        'error' => 'El número de radicado ' . $data['filing_number'] . ' ya existe. Intente nuevamente.'
                    ], 409);
                }
            }
            
            $registed = $this->filingRepository->storeGeneral($data);
            $filingId = $registed->id;

            if ($request->has('filesList') && is_array($request->filesList)) {
                foreach ($request->filesList as $fileItem) {
                    
                    // Sanitizar nombre de archivo
                    $filename = sanitizeFilename($fileItem['file_detail']['name']);
                    
                    // Preparar datos para el repositorio de documentos
                    $docData = [
                        'description'    => $fileItem['description'] ?? '',
                        'filing_id'      => $filingId,
                        'creado_por_id'  => Auth::id(),
                        'is_public'      => $fileItem['is_public'] ?? 0,
                        'file_detail'    => json_encode($fileItem['file_detail']),
                    ];

                    // Guardar registro en BD mediante el repositorio
                    $newDoc = $this->chargeDocFilingRepository->storeGeneral($docData);

                    // 4. Guardar archivo físico en Storage
                    $path = "doc_filing/$filingId/$filename";
                    Storage::disk('local')->put("public/" . $path, base64_decode($fileItem['file']));

                    // Actualizar la ruta en el registro del documento
                    $newDoc->file = $path;
                    $newDoc->save();

                    // 5. Crear Log de traza para cada archivo
                    $this->filingLogRepository->storeGeneral([
                        'action_es'      => 'Documento cargado al radicado',
                        'action_en'      => 'Document uploaded to filing',
                        'description_es' => "Se ha cargado el documento $filename al radicado {$registed->filing_number}.",
                        'description_en' => "The document $filename has been uploaded to filing {$registed->filing_number}.",
                        'icon'           => 'pi-paperclip',
                        'creado_por_id'  => Auth::id(),
                        'filing_id'      => $filingId,
                        'dependency_id'  => $registed->dependency_id,
                        'color'          => '#17A2B8'
                    ]);
                }
            }

            //guardar Datos DEL RADICADO Remitente
            $userData = $request->only(['name_social_reason_sender', 'first_surname_legal_representative_sender', 'second_surname_legal_representative_sender', 'address_sender', 'document_nit_sender', 'email_sender', 'phone_sender' ,'country_id', 'department_id' , 'city_id', 'type_person_id_sender','creado_por_id', 'type_document_id']);
            $userData['creation_type'] = 2;
            
            $existingThird = $this->thirdsRepository->findByDocument($userData['document_nit_sender']);
            
            if (!$existingThird) {
                $registedUser = $this->thirdsRepository->storeGeneral($userData);
            }

            // si es radicadion de salida crear una respuesta y enviar a unidad de distribucion directamente
            if($request->data_exit){
                $datos = ['filing_id' => $filingId , 'third_document_nit' => $request->document_nit_sender, 'state' => 5];
                $newRequest = new Request($datos);
                $sinResponse =  $this->storeResponseTemplate($newRequest);
            }

            if (!empty($request['associated_filings'])) {
                $this->associateFilings($registed->id, $request->associated_filings);
            }
            if (!empty($request['no_response'])) {
                return $registed;
            }
            $dataLog = [
                'action_es' => 'Creación de radicado',
                'action_en' => 'Creation of filing',
                'description_es' => 'Se radicó el documento de forma correcta',
                'description_en' => 'The document was filed correctly',
                'icon' => 'pi-plus',
                'creado_por_id' => Auth::user()->id,
                'filing_id' => $registed->id,
                'dependency_id' => $registed->dependency_id,
                'color' => '#4CAF50'
            ];
            $this->filingLogRepository->storeGeneral($dataLog);
            return response()->json($registed);
        } catch (\Exception $e) {
            throw $e;
            // Capturar cualquier excepción y devolver un error
            return response()->json(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()], 500);
        }
    }

    function filingStoreGmail(Request $request)
    {   
        try{
            if (empty($request['id'])) {
                $request['creado_por_id'] = Auth::user()->id;
            }

            $data = Arr::except($request->all(), ['id_email','associated_filings', 'masive', 'expiration_date', 'masive_destinatary', 'template', 'no_response' , 'filesList' ,'data_exit']);

            $data["expiration_date"] = Carbon::now()->addDays($request->input('remaining_days'));


            $distributionId = $this->distributionUnitRepository->getIdByDependency($data['dependency_id']);

            if (!$distributionId) {
                return response()->json([
                    'error' => 'Dependencia sin unidad de correspondencia'
                ], 409);
            }

            $data['distribution_id_filing'] = $distributionId;

            if (!empty($data['filing_number'])) {
                $existingFiling = Filing::where('filing_number', $data['filing_number'])->first();
                if ($existingFiling) {
                    return response()->json([
                        'error' => 'El número de radicado ' . $data['filing_number'] . ' ya existe. Intente nuevamente.'
                    ], 409);
                }
            }

            $registed = $this->filingRepository->storeGeneral($data);

            $email = ReceivedEmail::findOrFail($request->id_email);
            $email->state = 3; // radicacion Completa
            $email->save();

            return response()->json($registed);

        }catch(\Exception $e){
            throw $e;
            return response()->json(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()], 500);
        }
    }

    public function copyUfficialUniti(Request $request)
    {
        $filingId = $request->id;
        $unidadesDistribucion = $request->copia_units_id;

        foreach ($unidadesDistribucion as $unidadesDistribucionId) {

            DB::table('copy_filing')->insert([
                'id_filing'   => $filingId,
                'id_unitidis' => $unidadesDistribucionId,
                'estado'      => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        return response()->json(['ok' => true]);
    }

    public function envioCorreoRadicado($emailRemitente, $emailFuncionario, $radicado)
    {
        if (!$emailRemitente && !$emailFuncionario) {
            return;
        }
        try {
            // Base común de datos
            $dataBase = [
                'radicado' => $radicado,
                'aplicacion' => env('APP_NAME'),
                'numeroRadicado' => $radicado['filing_number'] ?? null,
                'fechaRespuesta' => $radicado['expiration_date'] ?? null,
            ];
            
            //Correo al Remitente (Ciudadano)
            if ($emailRemitente) {

                $dataRemitente = array_merge($dataBase, [
                    'usuario' => $emailRemitente,
                    'esFuncionario' => true
                ]);

                Mail::to($emailRemitente)
                    ->send(new NotificacionRemitenteFuncionario($dataRemitente));
            }

            //Correo al Funcionario
            if ($emailFuncionario) {

                $dataFuncionario = array_merge($dataBase, [
                    'usuario' => $emailFuncionario,
                    'esFuncionario' => false
                ]);

                Mail::to($emailFuncionario)
                    ->send(new NotificacionRemitenteFuncionario($dataFuncionario));
            }

        } catch (\Exception $e) {
            throw $e;
        }
    }


    private function associateFilings($id, $associatedFilings)
    {
        $this->associatedFilingRepository->insertAssociatedFilings($id, $associatedFilings);
    }

    private function masiveFiling(Request $request)
    {
        $request->merge(['masive' => false]);

        $destinataries = $this->filingRepository->masiveFiling($request);

        foreach ($destinataries as $key => $des) {
            $request->request->set('no_response', true);
            foreach ($des as $key => $de) {
                $request->request->set($key, $de);
            }
            $filing = $this->store($request);

            if (!empty($request['template'])) {
                $base64 = substr($request->template[0]['data'], strpos($request->template[0]['data'], ',') + 1);
                $filename = sanitizeFilename($request->template[0]['name']);
                $path = "filing/$filing->id/" . $filename;
                // Decodificar el archivo en Base64 y guardarlo en el almacenamiento
                Storage::disk('local')->put("public/" . $path, base64_decode($base64));
                $filing->template_url = $path;
                $filing->template_name = $filename;
                $filing->save();
            }
        }
        return response()->json([
            'count' => count($destinataries)
        ]);
    }

    function list(Request $request)
    {
        $data = $this->filingRepository->list($request->all(), ['typesFilings', 'documentalType', 'clasification', 'priority', 'peopleType', 'country', 'department', 'city', 'receptionMedia', 'dependency', 'city', 'official.persona', 'chargeDocFilings']);

        return response()->json($data);
    }

    function edit(string $id)
    {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        $receptionMedium = $this->receptionMediumRepository->all();
        $priorities = $this->priorityRepository->all();
        $typePerson = $this->typePersonRepository->all();
        $editar = true;
        $currentLocale = App::getLocale();
        return Inertia::render("filing/standard_filing/Create", compact('id', 'clasifications', 'currentLocale', 'typeDocs', 'receptionMedium', 'priorities', 'typePerson' , 'editar'));
    }

    function show(string $id)
    {
        $object = $this->filingRepository->find($id, [
            'associated_filings' => function ($q) {
                $q->selectRaw('filing_id as id,id as internalId,father_filing_id');
            }
        ]);
        return response()->json($object);
    }

    function showFiling(Filing $filing,Request $request)
    {
        $typeDocs = $this->expFilesTypeDocRepository->all();

        $filing->load([ 'typesFilings', 'documentalType', 'clasification', 'priority', 'peopleType', 'country', 'department', 'city', 'receptionMedia', 'dependency',
            'city', 'official.persona', 'chargeDocFilings', 'chargeDocFilings.typeDocumental', 'filing_logs','filing_logs.creador',
            'filing_logs.creador.dependency' , 'TypeOfProcedure', 'responseTemplates','filedDeparture' , 'responseTemplates.elabora', 'responseTemplates.revisa' ,
            'responseTemplates.aprueba','responseTemplates.signatories','responseTemplates.signatories.official' ]);
        $query = $request->all();

        return Inertia::render("filing/standard_filing/Show", compact('filing','query','typeDocs'));
    }

    public function destroy(string $id)
    {
        try {
            $object = $this->filingRepository->find($id);

            if (!$object) {
                return response()->json([
                    'success' => false,
                    'message' => 'El radicado no existe'
                ], 404);
            }

            $copias = $this->copyFilingRepository->deleteCopies($id);

            $object->delete();

            return response()->json([
                'success' => true,
                'message' => 'El radicado ha sido eliminado correctamente'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el radicado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->filingRepository->list(array_merge($filters, ['typeData' => 'todos']), with: ['documentalType']);
        $dataObtained = [];
        foreach ($data as $value) {
            $item = [
                'types_filing' => $value->typesFilings->name,
                'number_filing' => $value->filing_number,
                'creation_date' => $value->created_at,
                'client' => $value->name_social_reason_sender . " " . $value->first_surname_legal_representative_senderss,
                'subject' => $value->subject,
                'documental_type' => $value->documentalType['name_' . session('locale', 'es')],
                'due_date' => $value->expiration_date,
                'priority' => $value->priority['name_' . session('locale', 'es')],
                'document' => $value->document,
                'permission_file' => $value->clasification['name_' . session('locale', 'es')],
            ];

            $dataObtained[] = $item;
        }
        return $this->filingRepository->export($type, $dataObtained, 'Excel.Export.generalExport', 'filing.standard_filing.table', 'filing.standard_filing.title');
    }
    public function exportSticker(Request $request)
    {
        if(!$request->exportsExi){
            $filing = Filing::with('dependency', 'user.persona')->findOrFail($request->id);
            $filingNumber = $filing->filing_number;
        }else{
            $filing = Filing::with('dependency', 'user.persona')->findOrFail($request->exportsExi['filing']['id']);
            $filingNumber = $this->generateFiling($request->exportsExi['filing']['types_filings_id'], 1);
        }
        $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();

        // Generar código de barras en base64
        $barcode = base64_encode($generator->getBarcode($filingNumber, $generator::TYPE_CODE_128));

        // Generar PDF con la vista
        $pdf = Pdf::loadView('Sticker', compact('filing', 'barcode' , 'filingNumber'))
            ->setPaper([0, 0, 400, 150], 'portrait') // Ancho: 150px, Alto: 400px
            ->setOption('margin-top', 0)
            ->setOption('margin-bottom', 0)
            ->setOption('margin-left', 0)
            ->setOption('margin-right', 0);
        $dataLog = [
            'action_es' => $request->exportsExi ? 'Imprimir sticker de salida' : 'Imprimir sticker',
            'action_en' => $request->exportsExi ? 'Print outgoing sticker' : 'Print sticker',
            'description_es' => $request->exportsExi 
                ? 'Se generó e imprimió el sticker de salida correctamente.' 
                : 'Se generó e imprimió el sticker correctamente.',
            'description_en' => $request->exportsExi 
                ? 'The outgoing sticker was generated and printed correctly.' 
                : 'The sticker was generated and printed correctly.',
            'icon' => 'pi-print',
            'creado_por_id' => Auth::id(),
            'filing_id' => $filing->id,
            'dependency_id' => $filing->dependency_id,
            'color' => '#2196F3'
        ];

        $this->filingLogRepository->storeGeneral($dataLog);
        if ($request->exportsExi) {
            $dataFiledDeparture = [
                'filings_id' => $request->exportsExi['filing']['id'],
                'departure_filing' => $filingNumber,
                'id_response_template' => $request->exportsExi['id'],
            ];

            $this->answerRepository->storeGeneral($dataFiledDeparture);

            return $pdf->download("sticker_salida_{$filingNumber}.pdf");
        }

        return $pdf->download("sticker_{$filingNumber}.pdf");
    }

    public function sendResponseMail(Request $request)
    {
        try {
            if($request->send_to){
                $destinatarios = array_merge($request->send_to, $request->emails);
            }else{
                $destinatarios = $request->emails;
            }
            $destinatarios = array_unique($destinatarios);

            $responseId = $request->idResponse;
            $idResponse = str_replace('response_', '', $responseId);
            $filingNumber = $this->generateFiling($request['filing']['types_filings_id'], 1);

            $dataFiledDeparture = [
                'filings_id' => $request['filing']['id'],
                'departure_filing' => $filingNumber,
                'id_response_template' => $idResponse,
            ];

            $data = [
                'filing_number' => $request['filing']['filing_number'],
                'name_social_reason_sender' => $request['filing']['name_social_reason_sender'],
                'first_surname_legal_representative_sender' => $request['filing']['first_surname_legal_representative_sender'],
                'observation' => $request['filing']['observation'],
                'departure_filing' => $filingNumber,
            ];

            $documents = !empty($request->documents) ? $request->documents : [];

            // Enviar correos y registrar cada uno
            foreach ($destinatarios as $email) {
                $email = trim($email);
                $pattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
                $hasDoubleDots = str_contains($email, '..');
                $hasQuotes = str_contains($email, "'");

                $isValidFormat = preg_match($pattern, $email) && !$hasDoubleDots && !$hasQuotes;
                $domainExists = false;
                if ($isValidFormat) {
                    $domain = substr(strrchr($email, "@"), 1);
                    if (checkdnsrr($domain, "MX")) {
                        $domainExists = true;
                    }
                }

                if (!$isValidFormat || !$domainExists) {
                    $errorMsg = !$isValidFormat ? 'Formato inválido (puntos dobles o caracteres extraños).' : 'El dominio del correo no existe o no puede recibir mensajes.';
                    
                    $this->responseEmailRepository->recordEmail(
                        $idResponse,
                        $email,
                        'failed',
                        $errorMsg
                    );
                    continue; 
                }

                try {
                    Mail::to($email)->send(new CopiarACorreo($data, $documents));
                    
                    $this->responseEmailRepository->recordEmail(
                        $idResponse, 
                        $email, 
                        'success', 
                        null
                    );
                } catch (\Exception $e) {
                    $this->responseEmailRepository->recordEmail(
                        $idResponse,
                        $email,
                        'failed',
                        $e->getMessage()
                    );
                }
            }

            $filed_departure = $this->answerRepository->findBy([
                'id_response_template' => $idResponse
            ])->first();

            if(!$filed_departure){
                $this->answerRepository->storeGeneral($dataFiledDeparture);
            }

            $dataLog = [
                'action_es' => 'Enviar respuesta por correo',
                'action_en' => 'Send response via email',
                'description_es' => 'Se procesó el envío de respuesta a los destinatarios.',
                'description_en' => 'The response delivery was processed for recipients.',
                'icon' => 'pi-envelope',
                'creado_por_id' => Auth::id(),
                'filing_id' => $request->filing['id'],
                'dependency_id' => $request->filing['dependency_id'],
                'color' => '#E91E63'
            ];

            $this->filingLogRepository->storeGeneral($dataLog);

            $temple = ResponseTemplate::findOrFail($idResponse);
            $temple->state = 7; 
            $temple->transfer_date = Carbon::now();
            $temple->save();

            return response()->json([
                'success' => true,
                'mails' => $destinatarios,
                'response_template_id' => $idResponse,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error general en el proceso: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function sendEmailOfficial(Request $request)
    {
        try {
            $mails = [];
            if ($request->active != 1) {
                $filing = Filing::find($request['filing']['id']);
                $principal = $request['send_to'][0];
                $filing->dependency_id   = $principal['dependency_id'];
                $filing->official_id     = $principal['id'];
                $filing->transfer_date   = Carbon::now();
                $filing->transfer_status = 1;
                $filing->save();

                $data = [
                    'filing_number' => $request['filing']['filing_number'],
                    'name_social_reason_sender' => $request['filing']['name_social_reason_sender'],
                    'first_surname_legal_representative_sender' => $request['filing']['first_surname_legal_representative_sender'],
                    'observation' => $request['filing']['observation'],
                ];

                // RECORRER TODOS
                foreach ($request['send_to'] as $index => $official) {

                    // Enviar correo a todos
                    if (!empty($official['email'])) {

                        $correo = new notificacionMailable(
                            'Asignación de Radicado',
                            'Email.sendOfficial',
                            $data
                        );

                        Mail::to($official['email'])->send($correo);

                        $mails[] = $official['email'];
                    }

                    // Los adicionales quedan como copia
                    if ($index > 0) {

                        DB::table('copy_filing')->insert([
                            'id_filing'   => $request->filing['id'],
                            'id_official' => $official['id'],
                            'estado'      => 1,
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }

                $dataLog = [
                    'action_es' => 'Despacho a funcionario',
                    'action_en' => 'Send response via email',
                    'description_es' => 'Se envia tramite para gestion del funcionario.',
                    'description_en' => 'The response was successfully sent via email.',
                    'icon' => 'pi-file-export',
                    'creado_por_id' => Auth::id(),
                    'filing_id' => $request->filing['id'],
                    'dependency_id' => $request->filing['dependency_id'],
                    'color' => '#E91E63'
                ];

                $this->filingLogRepository->storeGeneral($dataLog);

            } else {

                foreach ($request['send_to'] as $official) {
                    if($official['id'] == Auth::id()){
                        return response()->json([
                            'success' => false,
                            'message' => 'No puedes sacar una Copia teniendo el Radicado'
                        ], 422);
                    }

                    DB::table('copy_filing')->insert([
                        'id_filing'   => $request->filing['id'],
                        'id_official' => $official['id'],
                        'estado'      => 1,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            if ($request->observation) {

                $dataLog = [
                    'action_es' => 'Nota de Observacion',
                    'action_en' => 'Send response via email',
                    'description_es' => $request->observation,
                    'description_en' => $request->observation,
                    'icon' => 'pi-tablet',
                    'creado_por_id' => Auth::id(),
                    'filing_id' => $request->filing['id'],
                    'dependency_id' => $request->filing['dependency_id'],
                    'color' => '#e9dc1e'
                ];
                $this->filingLogRepository->storeGeneral($dataLog);
            }

            return response()->json([
                'success' => true,
                'mails' => $mails,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function reassingTo(Request $request)
    {
        try {
            $filing = $this->filingRepository->find($request->filing, ['user.persona']);
            $userAfter = $this->usuarioRepository->find($request->official_id, ['persona']);
            //dd($userAfter->persona->nombre);
            $destinataries = $this->filingRepository->reassingFiling($request);
            //dd( $request);
            $dataLog = [
                'action_es' => 'Reasignar radicado',
                'action_en' => 'Reassign filing',
                'description_es' => sprintf(
                    'El radicado fue reasignado correctamente de %s %s a %s %s.',
                    $filing->user?->persona?->nombre ?? 'Usuario desconocido',
                    $filing->user?->persona?->apellido ?? '',
                    $userAfter->persona?->nombre ?? 'Usuario desconocido',
                    $userAfter->persona?->apellido ?? ''
                ),
                'description_en' => sprintf(
                    'The filing was successfully reassigned from %s %s to %s %s.',
                    $filing->user?->persona?->nombre ?? 'Unknown user',
                    $filing->user?->persona?->apellido ?? '',
                    $userAfter->persona?->nombre ?? 'Unknown user',
                    $userAfter->persona?->apellido ?? ''
                ),
                'icon' => 'pi-user-edit', // Icono representativo de cambio de usuario
                'creado_por_id' => Auth::id(),
                'filing_id' => $request->filing,
                'dependency_id' => $request->dependency_id,
                'color' => '#E91E63'
            ];
            $this->filingLogRepository->storeGeneral($dataLog);
            return response()->json([
                'success' => true,
                'mails' => $destinataries,
            ], 200);
        } catch (\Throwable $th) {
            dd($th);
            return response()->json([
                'message' => 'Error al enviar el correo: ' . $th->getMessage(),
            ], 500);
        }
    }

    function assingWk(Request $request)
    {
        $filing = $this->filingRepository->storeGeneral($request->all());
        $filing->current_node_id = $filing->workflow->nodes()->first()?->id;
        $filing->save();
        return response()->json([
            'success' => true,
        ], 200);
    }

    function workflow(Filing $filing)
    {
        if (empty($filing->workflow_id)) {
            return Inertia::render('filing/standard_filing/WorkflowNotAigned', compact('filing'));
        }

        $data = $this->filingRepository->getNodes($filing);
        $nodes = $data['nodes'];
        $edges = $data['edges'];
        $current_node_id = $data['current_node_id'];
        $last_node_id = $data['last_node_id'];
        $is_node_conditional = $data['is_node_conditional'];
        $next_node_yes = $data['next_node_yes'];
        $next_node_false = $data['next_node_false'];

        if ($filing->is_end_wk == 1) {
            return Inertia::render('filing/standard_filing/WorkflowComplete', compact('filing', 'nodes', 'edges', 'last_node_id', 'current_node_id', 'is_node_conditional', 'next_node_yes', 'next_node_false'));
        }
        return Inertia::render('filing/standard_filing/Workflow', compact('filing', 'nodes', 'edges', 'last_node_id', 'current_node_id', 'is_node_conditional', 'next_node_yes', 'next_node_false'));
    }

    function storeStep(Request $request)
    {
        $request['creador_por_id'] = Auth::user()->id;
        if ($request->is_node_conditional) {
            $filing = $this->filingRepository->find($request->filing_id);
            $filing->current_node_id = $request->node_id;
            $filing->save();
            return response()->json([
                'success' => true,
            ], 200);
        }
        $node_adv = $this->filingWorkflowRepository->storeGeneral($request->except('conditional_true', 'is_node_conditional'));
        $this->filingRepository->checkIsFinsihWk($node_adv->filing);
        $this->filingRepository->nextStep($node_adv->filing);
        return response()->json([
            'success' => true,
        ], 200);
    }

    function deletefilingWorkflow(FilingWorkflow $filingWorkflow)
    {
        $filingWorkflow->delete();
        return response()->json([
            'success' => true,
        ], 200);
    }

    function rejectStep(Filing $filing, Request $request)
    {
        $this->filingRepository->rejectStep($filing, $request);
        return response()->json([
            'success' => true,
        ], 200);
    }

    function typePerson(Request $request)
    {
        $data = $this->typePersonRepository->list($request->all());

        return response()->json($data);
    }

    public function storeResponseTemplate(Request $request)
    {
        try {
            DB::beginTransaction();
            // Buscar tercero por documento

            $document = $request->input('third_document_nit') ?? $request->input('document_nit_sender');
            $third = $this->thirdsRepository->findByDocument($document);
            // Si no existe lo creamos
            if (!$third) {
                $userData = [
                    'name_social_reason_sender' => $request['name_social_reason_sender'],
                    'first_surname_legal_representative_sender' => $request['first_surname_legal_representative_sender'],
                    'address_sender' => $request['address_sender'],
                    'document_nit_sender' => $request['document_nit_sender'],
                    'email_sender' => $request['email_sender'],
                    'phone_sender' => $request['phone_sender'],
                    'country_id' => $request['country_id'],
                    'department_id' => $request['department_id'],
                    'city_id' => $request['city_id'],
                    'type_person_id_sender' => $request['type_person_id_sender'],
                    'type_document_id' => $request['type_document_id'],
                    'creation_type' => 3,
                    'creado_por_id' => Auth::id()
                ];

                $third = $this->thirdsRepository->storeGeneral($userData);
            }

            // Guardar response template
            $data = [
                'third_id' => $third->id,
                'payroll_id' => $request->payroll_id ?? null,
                'template_url' => $request->template_url ?? null,
                'filings_id' => $request->filing_id,
                'id_elabora' => Auth::id(),
                'id_revisa' => $request->revisa,
                'id_aprueba' => $request->aprueba
            ];

            if(!$request->state){
                $urlAso = $this->associateTemplateUser($data)->getData();
                $data['template_url'] = $urlAso->url_res;
                $data['state'] = $urlAso->state; //1 = plantilla asociada
            }else{
                $data['state'] = $request->state; // si es salida se le asigna pendiente de acuse
            }
        
            $responseTemplate = $this->responseTemplateRepository->storeGeneral($data);

            if (!empty($request->officials)) {
                $signaturest = [];
                foreach ($request->officials as $officialId) {

                    $signatoryData = [
                        'response_id' => $responseTemplate->id,
                        'user_id' => $officialId,
                    ];
                    $signaturest[] = $signatoryData;

                    $this->signatoriesRepository->storeGeneral($signatoryData);
                }

                $responseAso = $this->associateSignaturesteUser(
                    $signaturest,
                    $request->filing_id,
                    $urlAso->url_res
                );

                $dataAso = $responseAso->getData();

                if (
                    isset($dataAso->success) &&
                    $dataAso->success === false
                ) {

                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' => $dataAso->message
                    ], 422);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $responseTemplate
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    function finishFiling(Request $request)
    {
        try {
            $filing = $this->filingRepository->finishFiling($request);

            $copias = $this->copyFilingRepository->deleteCopies($request->id);
            $object = $this->filingRepository->find($request->id);
            $object->delete();

            $dataLog = [
                'action_es' => 'Finalización de radicado',
                'action_en' => 'Filing completion',
                'description_es' => sprintf(
                    'El radicado ha sido finalizado. Observación: %s',
                    $request->finish_observation ?? 'Sin observaciones'
                ),
                'description_en' => sprintf(
                    'The filing has been completed. Observation: %s',
                    $request->finish_observation ?? 'No observations'
                ),
                'icon' => 'pi-flag', // Icono representativo de finalización
                'creado_por_id' => Auth::id(),
                'filing_id' => $request->id,
                'dependency_id' => $filing->dependency_id,
                'color' => '#F44336'
            ];
            $this->filingLogRepository->storeGeneral($dataLog);
            return response()->json([
                'success' => true,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al finalizar el radicado: ' . $th->getMessage(),
            ], 500);
        }
    }
    public function singFiling(Request $request)
    {
        try {

            $result = $this->signedFilingRepository->singFiling($request);
            if (isset($result['error'])) {
                return $result['message'];
            }
            foreach ($request->signatures as $key => $sing) {
                $filing = $this->filingRepository->find($sing['idRadicate']);
                //dd($filing->dependency_id);
                $dataLog = [
                    'action_es' => 'Radicado firmado',
                    'action_en' => 'Filed document signed', // Traducción más precisa

                    'description_es' => sprintf(
                        'El documento radicado ha sido firmado. Observación: %s',
                        $sing['number_filing'] ?: 'Sin observaciones'
                    ),
                    'description_en' => sprintf(
                        'The filed document has been signed. Note: %s', // "Note" suena más natural en inglés
                        $sing['number_filing'] ?: 'No notes'
                    ),

                    'icon' => 'pi-qrcode', // Icono representativo de finalización
                    'creado_por_id' => Auth::id(),
                    'filing_id' => $sing['idRadicate'],
                    'dependency_id' => $filing->dependency_id,
                    'color' => '#FFC107'
                ];

                $this->filingLogRepository->storeGeneral($dataLog);
            }
            return response()->json([
                'success' => true,
                'signedDocuments' => $result['signedDocuments'],
                'alreadySigned' => $result['alreadySigned'] // Añadir los ya firmados
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al finalizar el radicado: ' . $th->getMessage(),
            ], 500);
        }
    }
    public function includeExpFiling(Request $request)
    {
        try {
            $result = $this->filingExpFileRepository->attachExpFilesToFilings($request->ids_filing, $request->exp_files_ids);
            
            // FINALIZAR RADICADOS
            if (!empty($request->ids_filing)) {

                foreach ($request->ids_filing as $filingId) {

                    $requestFinish = new Request([
                        'id' => $filingId,
                        'finish_observation' => 'Archivado'
                    ]);

                    $this->filingRepository->finishFiling($requestFinish, true);
                }
            }

            if (isset($result['error'])) {
                return $result['message'];
            }

            foreach ($result['insertedRecords'] as $record) {
                $dataLog = [
                    'action_es' => 'Expediente asociado a radicado',
                    'action_en' => 'Filed document linked to file',

                    'description_es' => sprintf(
                        'El expediente %s ha sido asociado al radicado %s.',
                        $record['exp_file_num'] ?: 'Sin número',
                        $record['filing'] ?? 'Desconocido'
                    ),
                    'description_en' => sprintf(
                        'The file %s has been linked to filing %s.',
                        $record['exp_file_num'] ?: 'No number',
                        $record['filing'] ?? 'Unknown'
                    ),

                    'icon' => 'pi-folder',
                    'creado_por_id' => Auth::id(),
                    'filing_id' => $record['filing_id'],
                    'dependency_id' => $record['dependency_id'],
                    'color' => '#FFC107'
                ];

                $this->filingLogRepository->storeGeneral($dataLog);
            }
            return response()->json([
                'success' => true,
                'insertedRecords' => $result['insertedRecords'],
                'alreadyExists' => $result['alreadyExists'] // Añadir los ya firmados
            ], 200);
        } catch (\Throwable $th) {
            dd($th);
            return response()->json([
                'message' => 'Error al finalizar el radicado: ' . $th->getMessage(),
            ], 500);
        }
    }

    function masiveFilingView()
    {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        $receptionMedium = $this->receptionMediumRepository->all();
        $priorities = $this->priorityRepository->all();
        $typePerson = $this->typePersonRepository->all();
        $masive = true;
        //dd($receptionMedium);
        $currentLocale = App::getLocale();
        return Inertia::render("filing/standard_filing/Create", compact('clasifications', 'currentLocale', 'typeDocs', 'receptionMedium', 'priorities', 'typePerson', 'masive'));
    }
    function cancellationRequest(Request $request)
    {
        try {
            $filing = $this->filingRepository->cancellationRequest($request);
            //dd($filing);
            $dataRequest = [
                'filing_id' => $request->id,
                'request_observation' => $request->request_observation,
                'creado_por_id' => Auth::user()->id
            ];
            $this->cancellationRequestFilingRepository->storeGeneral($dataRequest);

            $dataLog = [
                'action_es' => 'Solicitud de cancelación de radicado',
                'action_en' => 'Filing cancellation request',

                'description_es' => sprintf(
                    'Se ha solicitado la cancelación del radicado  Observacion: %s',
                    $request['request_observation'] ?: 'Sin observación'
                ),
                'description_en' => sprintf(
                    'A cancellation request has been made for filing Observation:%s.',
                    $request['request_observation'] ?: 'Sin observación'

                ),

                'icon' => 'pi-ban', // Icono de cancelación
                'creado_por_id' => Auth::id(),
                'filing_id' => $request['id'],
                'dependency_id' => $filing->dependency_id,
                'color' => '#DC3545' // Rojo para indicar cancelación
            ];

            $this->filingLogRepository->storeGeneral($dataLog);

            //dd($filing);
            return response()->json([
                'success' => true,
                'filingRequest' => $filing->filing_number,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al finalizar el radicado: ' . $th->getMessage(),
            ], 500);
        }
    }
    function noResponseRequired(Request $request)
    {
        //dd($request->id);
        try {
            $expFiles = $this->expFilesRepository->noResponseRequired($request);
            $filing = $this->filingRepository->noResponseRequired($request->id, $expFiles->id);
            //dd($filing);
            $dataLog = [
                'action_es' => 'Radicado marcado como "No requiere respuesta"',
                'action_en' => 'Filing marked as "No response required"',

                'description_es' => sprintf(
                    'El radicado %s ha sido marcado como "No requiere respuesta".',
                    $filing['filing_number'] ?: 'Sin número'
                ),
                'description_en' => sprintf(
                    'The filing %s has been marked as "No response required".',
                    $filing['filing_number'] ?: 'No number'
                ),

                'icon' => 'pi-check-circle', // Icono de confirmación
                'creado_por_id' => Auth::id(),
                'filing_id' => $filing['id'],
                'dependency_id' => $filing['dependency_id'],
                'color' => '#28A745' // Verde para indicar que no requiere acción
            ];

            $this->filingLogRepository->storeGeneral($dataLog);
            return response()->json([
                'success' => true,
                'numberFiling' => $filing->filing_number,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al cambiar estado del radicado: ' . $th->getMessage(),
            ], 500);
        }
    }

    function typeProcess()
    {
        $tipoTramites = $this->tipoTramiteRepository->all();
        return response()->json(['tipoTramites' => $tipoTramites], 200);
    }

    private function associateTemplateUser($data)
    {
        $filing = Filing::findOrFail($data['filings_id']);
        $temple = PayrollManagement::findOrFail($data['payroll_id']);
        // dd($temple);
        $templatePath = storage_path('app/public/' . $temple->file);

        $templateProcessor = new TemplateProcessor($templatePath);

        // Campos simples
        $templateProcessor->setValue('nombre', $filing->name_social_reason_sender ?? '');
        $templateProcessor->setValue('nombreCompleto', $filing->name_social_reason_sender . ' ' . $filing->first_surname_legal_representative_sender );
        $templateProcessor->setValue('numero_filing', $filing->filing_number ?? '');
        $templateProcessor->setValue('dependesy', $filing->filing_number ?? '');
        $templateProcessor->setValue('fecha', $filing->document_date ?? '');
        $templateProcessor->setValue('direccion', $filing->address_sender ?? '');
        $templateProcessor->setValue('observacion', $filing->observation ?? '');
        $templateProcessor->setValue('numero', $filing->document_nit_sender ?? '');

        // mensaje Editable
        $asuntoHtml = $filing->edited_html ?: '';

        if(!empty($asuntoHtml)) {
           $asuntoHtml = $filing->edited_html ?: 'sin asuntos adicionales';
            $allowedTags = '<p><br><b><i><strong><em><ul><ol><li>';
            $asuntoSanitized = strip_tags($asuntoHtml, $allowedTags);

            $asuntoProcessed = preg_replace([
                '#<ul>#', '#</ul>#', '#<li>#', '#</li>#', '#<p>#', '#</p>#', '#<br\s*/?>#i'
            ], [
                "\n", "\n", "\t• ", "\n", "\n", "\n", "\n"
            ], $asuntoSanitized);

            $templateProcessor->setValue('contenido_editable_asunto', $asuntoProcessed);
        }

        // Guardar el archivo generado
        $basePath = storage_path('app/public/filing/' . $filing->id . '/responses');

        if (!File::exists($basePath)) {
            File::makeDirectory($basePath, 0777, true);
        }

        $folders = File::directories($basePath);

        $nextNumber = 1;

        if (!empty($folders)) {
            $numbers = array_map(function ($folder) {
                return (int) basename($folder);
            }, $folders);

            $nextNumber = max($numbers) + 1;
        }

        $responseDirectory = $basePath . '/' . $nextNumber;

        if (!File::exists($responseDirectory)) {
            File::makeDirectory($responseDirectory, 0777, true);
        }

        $newFileName = 'respuesta_v1.docx';
        $newFullPath = $responseDirectory . '/' . $newFileName;

        $templateProcessor->saveAs($newFullPath);

        $url = 'filing/'.$filing->id.'/responses/'.$nextNumber.'/'.$newFileName;

        return response()->json(['url_res' => $url,'state' => 1]);
        // return response()->download($newFullPath);
    }

    private function associateSignaturesteUser($signaturest, $filingId , $url)
    {
        $filing = Filing::findOrFail($filingId);

        $templatePath = storage_path('app/public/' . $url);

        $templateProcessor = new TemplateProcessor($templatePath);

        $userIds = collect($signaturest)->pluck('user_id');

        $users = User::with('persona','dependency')
            ->whereIn('id', $userIds)
            ->get();

        $contenidoFirmas = '';
        $contador = 0;

        foreach ($users as $user) {

            if (!$user->dependency) {

                return response()->json([
                    'success' => false,
                    'message' => "El usuario {$user->usuario} no tiene dependencia asignada"
                ], 422);
            }
        }

        foreach ($users as $user) {
            $contador++;

            $bloqueFirma  = "\${firmaDigital{$user->id}}\n";
            $bloqueFirma .= "\${firma{$contador}}\n";
            $bloqueFirma .= "\${dependency{$contador}}\n\n\n";

            $contenidoFirmas .= str_pad($bloqueFirma, 90);
        }

        $templateProcessor->setValue('ubicacion_firmas', $contenidoFirmas);
        foreach ($users as $index => $user) {

            $nombreApe = $user->persona->nombre.' '.$user->persona->apellido;
            $identi = $user->persona->numero_documento;
            $nameDepen = $user->dependency->name;

            $templateProcessor->setValue("firma".($index + 1),$nombreApe.' - '.$identi);
            $templateProcessor->setValue("dependency".($index + 1),$nameDepen);
        }

        // guardar sobre el mismo archivo
        $templateProcessor->saveAs($templatePath);

        return response()->json([
            'url_res' => $url
        ]);
    }


    public function downloadEdited($id)
    {
        $filing = Filing::findOrFail($id);

        if (!$filing->edited_html) {
            return back()->with('error', 'No hay versión editada');
        }

        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        \PhpOffice\PhpWord\Shared\Html::addHtml(
            $phpWord->addSection(),
            $filing->edited_html
        );

        $directory = storage_path('app/public/filing/' . $filing->id);

        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        $path = $directory . '/editado_' . $filing->id . '.docx';

        $writer = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($path);

        return response()->download($path);
    }

    public function editionTemplateUser(Request $request)
    {
        $filing = Filing::findOrFail($request->id);

        $docPath = storage_path('app/public/' . $filing->generated_document_url);
        $phpWord = \PhpOffice\PhpWord\IOFactory::load($docPath);

        // Convierte solo para preview, no para guardar
        $htmlWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'HTML');
        ob_start();
        $htmlWriter->save('php://output');
        $htmlContent = ob_get_clean();

        // Extraer bloque editable (usando marcador invisible)
        preg_match('/\$\{contenido_editable_asunto\}(.*?)\$\{\/contenido_editable_asunto\}/s', $htmlContent, $matches);
        $editableContent = $matches[1] ?? '<p>Escribe aquí tu contenido...</p>';

        return response()->json([
            'html' => $editableContent,
            'full_html' => $htmlContent // para preview completo
        ]);
    }

    public function signDocument(Request $request)
    {
        $responseId = $request->response_id;

        if (!str_starts_with($responseId, 'response_')) {
            return response()->json([
                'message' => 'Estas intentando firmar un documento que no es una respuesta.'
            ], 400);
        }

        $id = str_replace('response_', '', $responseId);

        $filing = Filing::findOrFail($request->filing_id);
        $temple = ResponseTemplate::findOrFail($id);

        $templatePath = storage_path('app/public/' . $temple->template_url);
        $templateProcessor = new TemplateProcessor($templatePath);

        $oldFile = $temple->template_url;

        $signaturePath = storage_path('app/public/' . auth()->user()->physical_signature);

        if (file_exists($signaturePath)) {

            $variables = $templateProcessor->getVariables();

            $firmasPendientes = array_filter($variables, function ($v) {
                return str_contains($v, 'firmaDigital');
            });

            $asuntoPendient = array_filter($variables, function ($v) {
                return str_contains($v, 'contenido_editable_asunto');
            });
            if($asuntoPendient){
                $templateProcessor->setValue('contenido_editable_asunto', '');
            }

            $yaSeFirmaron = count($firmasPendientes) === 0;

            if (!$yaSeFirmaron) {

                $variableFirma = 'firmaDigital' . (Auth::user()->id);

                $firmaEnDocumento = array_filter($variables, function ($v) use ($variableFirma) {
                    return str_contains($v, $variableFirma);
                });

                if (empty($firmaEnDocumento)) {
                    return response()->json([
                        'message' => 'No estás autorizado para hacer el proceso de firma'
                    ], 400);
                }

                if (in_array($variableFirma, $variables)) {
                    $templateProcessor->setImageValue($variableFirma, [
                        'path' => $signaturePath,
                        'width' => 300,
                        'height' => 300,
                        'ratio' => true
                    ]);
                }
            }
        }else{
            return response()->json([
                'message' => 'sin firma registrada en el sistema'
            ], 403);
        }

        // $directory = storage_path('app/public/filing/' . $filing->id);
        $directory = dirname($templatePath);

        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        // guardar DOCX firmado
        $docxName = 'respuesta_firmada_' . time() . '.docx';
        $docxPath = $directory . '/' . $docxName;

        $templateProcessor->saveAs($docxPath);
        if ($oldFile && Storage::disk('public')->exists($oldFile)) {
            Storage::disk('public')->delete($oldFile);
        }

        // detectar nuevamente si quedan firmas
        $phpWord = IOFactory::load($docxPath);
        $templateProcessor = new TemplateProcessor($docxPath);
        $variablesRestantes = $templateProcessor->getVariables();

        $firmasPendientes = array_filter($variablesRestantes, function ($v) {
            return str_contains($v, 'firmaDigital');
        });

        $yaSeFirmaron = count($firmasPendientes) === 0;
        $newUrl = dirname($temple->template_url) . '/' . $docxName;
        // si ya se firmó todo → convertir a PDF
        if ($yaSeFirmaron) {
            $pdfName = 'respuesta_final.pdf';
            $pdfUrl = dirname($temple->template_url) . '/' . $pdfName;
            $pdfPath = $directory . '/' . $pdfName;

            // DOCX → HTML
            $htmlWriter = IOFactory::createWriter($phpWord, 'HTML');

            ob_start();
            $htmlWriter->save('php://output');
            $html = ob_get_clean();

            $style = "
                <style>

                body{
                    margin:80px;
                    font-family: Arial, sans-serif;
                    font-size:12px;
                    line-height:1.2;
                }

                img{
                    max-width:100px;
                    max-height:100px;
                }

                p{
                    margin:0;
                    padding:0;
                    line-height:1.2;
                }

                </style>
            ";

            $html = $style . $html;

            $pdf = Pdf::loadHTML($html);

            $dompdf = $pdf->getDomPDF();
            $dompdf->render();

            $canvas = $dompdf->getCanvas();
            $cpdf = $canvas->get_cpdf();

            $cpdf->addInfo("Title", "Respuesta Radicado ".$filing->id);
            $cpdf->addInfo("Author", "CORTOLIMA");
            $cpdf->addInfo("Subject", "Documento generado por el sistemaaaa");
            $cpdf->addInfo("Keywords", "radicado, gestion documental");
            $cpdf->addInfo("Creator", "Sistema de Gestión Documental");
            $cpdf->addInfo("Productor", "Sistema de Gestión Documental");

            file_put_contents($pdfPath, $dompdf->output());


            // // eliminar DOCX
            if (file_exists($docxPath)) {
                unlink($docxPath);
            }

            $temple->template_url = $pdfUrl;
            $temple->state = 4;
            $temple->save();

            $filing->template_url = $pdfUrl;
            $filing->template_name = $pdfName;
            $filing->save();

            return response()->download($pdfPath);
        }

        // si aún faltan firmas devolver DOCX
        $temple->template_url = $newUrl;
        $temple->state = 3;
        $temple->save();

        return response()->download($docxPath);
    }
    public function getExpirationDate(Request $request)
    {
        $date = $this->calculateExpirationDate($request->days);

        return response()->json([
            'date' => $date->format('Y-m-d')
        ]);
    }

    public function calculateExpirationDate($days)
    {
        $date = now()->copy();
        $addedDays = 0;

        $nonWorkingDays = $this->hoursNotWorkRepository
            ->list()
            ->pluck('date')
            ->toArray();

        while ($addedDays < $days) {
            $date->addDay();

            if ($date->isWeekend()) {
                continue;
            }

            if (in_array($date->format('Y-m-d'), $nonWorkingDays)) {
                continue;
            }

            $addedDays++;
        }

        return $date;
    }

    public function showAcuse($idResponse)
    {   
        $responseId = $idResponse;
        $idResponse = str_replace('response_', '', $responseId);

        $responseTemplate = $this->responseTemplateRepository->find($idResponse);

        $filing = $this->filingRepository->find($responseTemplate->filings_id);
        $third = $this->thirdsRepository->find($responseTemplate->third_id);

        // Obtener todos los correos asociados a esta respuesta
        $emails = $this->responseEmailRepository->getByResponseTemplate($idResponse);

        $data = [
            'filing' => $filing,
            'recipient_email' => $third->email_sender ?? 'No email',
            'recipient_name' => $third->name_social_reason_sender . ' ' . $third->first_surname_legal_representative_sender ?? 'No name',
            'type' => 'Correo Electronico',
            'observation' => 'Notificacion De Respuesta a Radicado',
            'emails' => $emails, // Pasar todos los correos registrados
        ];

        $pdf = Pdf::loadView('acuse.recibidos', $data)
            ->setPaper('letter')
            ->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);

        return $pdf->stream('acuse_recibo_' . $filing->filing_number . '.pdf', ['Attachment' => false]);
    }

    public function documentaprovado(Request $request)
    {  
        $responseId = $request->response_id;
        $idResponse = str_replace('response_', '', $responseId);

        $responseTemplate = $this->responseTemplateRepository->find($idResponse);

        if (!$responseTemplate) {
            return response()->json([
                'message' => 'Documento de respuesta no encontrado.'
            ], 404);
        }

        if ($request->type == 1) {
            $responseTemplate->estado_revisa = $request->accion;
        } else {
            $responseTemplate->estado_aprueba = $request->accion;
        }
        
        $responseTemplate->save();

        return response()->json([
            'message' => 'Exitoso.'
        ], 200);
    
    }

}
