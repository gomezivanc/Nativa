<?php

namespace App\Http\Controllers;

use App\Models\ExpFiles;
use App\Models\ExpFilesClasification;
use App\Models\User;
use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\ExpFilesFilesRepository;
use App\Repositories\ExpFilesRepository;
use App\Repositories\ExpFilesSupportTypeRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\ExpClasificationArchiveRepository;
use App\Repositories\ExpFileTypeControlRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\TrdRepository;
use App\Repositories\TypeAnnexesRepository;
use App\Repositories\TypesBodyRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ExpFilesFiles;

class ExpFilesController extends Controller
{
    public function __construct(private ExpFilesRepository $expFilesRepository, private ExpFilesClasificationsRepository $expFilesClasificationsRepository, private ExpClasificationArchiveRepository $expClasificationArchiveRepository, private TypesBodyRepository $typesBodyRepository, private UserRepository $userRepository,
    private TypeAnnexesRepository $typeAnnexesRepository, private ExpFilesTypeDocRepository $expFilesTypeDocRepository,private ExpFilesSupportTypeRepository $expFilesSupportTypeRepository, private ExpFilesFilesRepository $expFilesFilesRepository,
    private ExpFileTypeControlRepository $expFileTypeControlRepository, private GDDependencyRepository $gdDependencyRepository)
    {
        $this->expFilesRepository = $expFilesRepository;
    }

    function index(Request $request) {
        $typeAnex = $this->typeAnnexesRepository->all();
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();
        $expFilesSupportsType = $this->expFilesSupportTypeRepository->all();
        $repoRequest = ['typeData' => true];
        $clasifications = $this->expFilesClasificationsRepository->all();
        $archiveClasification = $this->expClasificationArchiveRepository->all();
        $dependencies = $this->gdDependencyRepository->list($repoRequest, ['series', 'series.subseries', 'series.retencion', 'series.subseries.retencion']);
        return Inertia::render("document_gestion/ExpFiles/Index",compact('typeAnex','expFilesTypeDocs', 'expFilesSupportsType', 'dependencies', 'clasifications', 'archiveClasification'));
    }

    function create(Request $request) {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $currentLocale = App::getLocale();
        $sub_exp = !empty($request->sub_exp) ? true : false;
        return Inertia::render("document_gestion/ExpFiles/Create",compact('clasifications','currentLocale','sub_exp'));
    }

    // store - update
    function store(Request $request)
    {        
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
            $request['number'] = $this->expFilesRepository->generateFileNumber();
        }
        
        $request['date_init'] = date('Y-m-d');
        $nombreExpediente = '';

        //Genera nombre
        if ($request->has('indices') && $request->has('indices_config')) {

            $indicesConfig = collect($request->indices_config)->filter(function ($item) {
                return $item['es_nombre'] == 1;
                })->sortBy(function ($item) {
                    return $item['orden'] ?? 999;
                });

            foreach ($indicesConfig as $config) {

                $indiceId = $config['indice']['id'];
                $valor = $request->indices[$indiceId] ?? '';

                if (empty($valor)) { continue;  }

                if ($config['indice']['tipo_dato'] === 'fecha') {
                    $valor = str_replace('-', '', $valor);
                }

                $valor = preg_replace('/\s+/', '_', $valor);
                $nombreExpediente .= ($nombreExpediente ? '_' : '') . $valor;
            }
        }

        if (empty($request['name']) && !empty($nombreExpediente)) {
            $request['name'] = $nombreExpediente;
        }        
        
        $requestData = $request->except('dependencies', 'sub_exps', 'indices', 'indices_config');

        $data = $this->expFilesRepository->storeGeneral($requestData);

        if ($request->has('dependencies') && is_array($request->dependencies)) {
            $data->dependencies()->delete();
            foreach ($request->dependencies as $d) {
                $data->dependencies()->create(['dependency_id' => $d]);
            }
        }

        if ($request->has('sub_exps') && count($request->sub_exps) > 0) {
            $data->subExp()->delete();
            foreach ($request->sub_exps as $s) {
                $s['number'] = $this->expFilesRepository->generateFileNumber();
                $s['creado_por_id'] = Auth::user()->id;
                $subExp = $data->subExp()->create(collect($s)->except('dependency_id', 'dependencies', 'id')->toArray());
                if (!empty($s['dependency_id'])) {
                    foreach ($s['dependency_id'] as $d) {
                        $subExp->dependencies()->create(['dependency_id' => $d]);
                    }
                }
            }
        }

        if ($request->has('indices')) {
            $data->indices()->delete();
            foreach ($request->indices as $indice_id => $valor) {
                $data->indices()->create([
                    'indice_id' => $indice_id,
                    'valor' => $valor
                ]);
            }
        }

        return response()->json($data);
    }

    function storeOnlyExpFile(Request $request) {
        foreach ($request->ids as $key => $id) {
            $request['id'] = $id;
            $data = $this->expFilesRepository->storeGeneral($request->except('ids','rol_id','type_controls'));
        }

        if(!empty($request['type_controls'])) {
            $data->acccess()->delete();

            foreach ($request['type_controls'] as $key => $tc) {
                $data->acccess()->create([
                    'type_control_id' => $tc,
                ]);
            }
        }

        if(!empty($request['rol_id'])) {
            $data->syncRoles(Role::whereIn('name', (array) $request['rol_id'])->where('guard_name', 'web')->get());
        }

        return $data;
    }
    
    public function detailex(Request $request)
    {
        $expFilesSupportsType = $this->expFilesSupportTypeRepository->all();

        return response()->json([
            'expFilesSupportsType' => $expFilesSupportsType
        ]);
    }

    public function expFilesTypeDocs(Request $request)
    {
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();

        return response()->json([
            'expFilesTypeDocs' => $expFilesTypeDocs
        ]);
    }

    function list(Request $request) {
        $data = $this->expFilesRepository->list(request: $request->all(), with: [ 'dependency','createBy.persona',
        'stateLoan','clasification','indices.indice','files','acccess.typeControl',
        'documentaryLoan' => function ($query) {
            $query->latest();
        },
        'documentaryLoan.type_loan','documentaryLoan.requirements', 'documentaryLoan.created_by.persona',
        'roles:id,name','expFilesArchived.typeArea'], withCount: ['expFilesArchived']);
        
        return response()->json($data);
    }

    // function detail(String $id, Request $request)  {
    //     $expFiles = $this->expFilesRepository->find($id,['clasification','dependency','dependencies',
    //     'responsible:id,id_persona','responsible.persona:id,nombre,apellido','logs' => function ($q) {
    //         $q->where('log_name','Expediente_detalle');
    //     },'logs.causer.persona']);

    //     $clasifications = $this->expFilesTypeDocRepository->all();
    //     $supports_type  = $this->expFilesSupportTypeRepository->all();

    //     $request['exp_file_id'] = $expFiles->id;
    //     $request['typeData'] = 'todos';
    //     $expFiles->files = $this->expFilesFilesRepository->list($request->all(),['supportType', 'creador.persona', 'segments.typeDocumental']);
    //     foreach ($expFiles->files as $key => $file) {
    //         if($file->file) {
    //             $file->last_page_pdf = readLastPage(storage_path().'/app/public/'.$file->file);
    //         }
    //     }

    //     if(request()->expectsJson()) {
    //         return response()->json([
    //             'expFiles' => $expFiles,
    //             'supports_type' => $supports_type,
    //             'clasifications' => $clasifications,
    //         ]);
    //     }

    //     return Inertia::render("document_gestion/ExpFiles/Detail",compact('expFiles','clasifications'));
    // }

    function detail(String $id, Request $request)  
    {
        $expFiles = $this->expFilesRepository->find($id, [
            'clasification',
            'dependency',
            'responsible:id,id_persona',
            'responsible.persona:id,nombre,apellido',
            'indices.indice',
            'filings.chargeDocFilings',
            'filings.chargeDocFilings.supportType',
            'filings.responseTemplates',
            'filings.responseTemplates.answers',
            'filings.user.persona',
            'filings.typeOfProcedure',
            'filings.chargeDocFilings.user.persona',
            'logs' => function ($q) {
                $q->where('log_name','Expediente_detalle');
            },
            'logs.causer.persona'
        ]);

        $clasifications = $this->expFilesTypeDocRepository->all();
        $supports_type  = $this->expFilesSupportTypeRepository->all();

        $expFiles->files = $this->expFilesRepository->buildFilesForDetail($expFiles, $request->all(), $this->expFilesFilesRepository);
        $expFiles->filings_detail = $this->expFilesRepository->buildFilingsForDetail($expFiles);
        // índices
        $expFiles->indices_formateados = $expFiles->indices->map(function ($indice) {
            return [
                'nombre' => $indice->indice->nombre ?? '',
                'valor'  => $indice->valor ?? ''
            ];
        });
        // dd($expFiles);
        if ($request->expectsJson()) {
            return response()->json([
                'expFiles' => $expFiles,
                'supports_type' => $supports_type,
                'clasifications' => $clasifications,
            ]);
        }

        return Inertia::render("document_gestion/ExpFiles/Detail", [
            'expFiles' => $expFiles,
            'clasifications' => $clasifications,
            'supports_type' => $supports_type
        ]);
    }

    public function generateIndex($id)
    {
        $exp = ExpFiles::with(['files.typeDocumental', 'dependency'])->findOrFail($id);

        $serie = $exp->serie ?? [];
        $subserie = $exp->subserie ?? [];

        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><IndiceElectronico/>');

        // ENCABEZADO DEL EXPEDIENTE
        $encabezado = $xml->addChild('Encabezado');
        $encabezado->addChild('CodigoDependencia', $exp->dependency->code ?? '');
        $encabezado->addChild('NombreDependencia', $exp->dependency->name ?? '');
        $encabezado->addChild('CodigoSerie', $serie['code'] ?? '');
        $encabezado->addChild('NombreSerie', $serie['name'] ?? '');
        $encabezado->addChild('CodigoSubserie', $subserie['code'] ?? '');
        $encabezado->addChild('NombreSubserie', $subserie['name'] ?? '');
        $encabezado->addChild('NumeroExpediente', $exp->number);
        $encabezado->addChild('NombreExpediente', $exp->name);
        $encabezado->addChild('FechaInicio', $exp->date_init);
        $encabezado->addChild('FechaCierre', $exp->deleted_at ?? '');
        $encabezado->addChild('CantidadDocumentos', $exp->files->count());

        // Calcular total de páginas/folios
        $totalPaginas = 0;
        foreach ($exp->files as $file) {
            $filePath = storage_path('app/public/' . $file->file);
            if ($file->num_pages) {
                $totalPaginas += $file->num_pages;
            } else {
                $extension = strtolower(pathinfo(json_decode($file->file_detail)->name ?? '', PATHINFO_EXTENSION));
                $totalPaginas += ($extension === 'pdf' && file_exists($filePath)) ? readLastPage($filePath) : 1;
            }
        }
        $encabezado->addChild('CantidadFolios', $totalPaginas);

        // DOCUMENTOS
        $documentos = $xml->addChild('Documentos');
        $paginaActual = 1;

        foreach ($exp->files as $i => $file) {
            $filePath = storage_path('app/public/' . $file->file);
            $fileDetail = json_decode($file->file_detail);
            $extension = strtolower(pathinfo($fileDetail->name ?? '', PATHINFO_EXTENSION));
            $isPdf = $extension === 'pdf';

            // Calcular número de páginas
            if ($file->num_pages) {
                $numPages = $file->num_pages;
            } else {
                $numPages = ($isPdf && file_exists($filePath)) ? readLastPage($filePath) : 1;
            }

            // Calcular hash
            $hash = file_exists($filePath) ? hash_file('sha256', $filePath) : '';

            // Determinar origen
            $origen = 'Electrónico';
            if ($file->supportType) {
                $origen = $file->supportType->name_es ?? 'Electrónico';
            }

            $doc = $documentos->addChild('Documento');
            $doc->addChild('Orden', $i + 1);
            $doc->addChild('Nombre', $fileDetail->name ?? '');
            $doc->addChild('FechaDocumento', $file->date ?? $file->created_at->format('Y-m-d'));
            $doc->addChild('FechaInclusion', $file->created_at->format('Y-m-d'));
            $doc->addChild('Hash', $hash);
            $doc->addChild('PaginaInicial', $paginaActual);
            $doc->addChild('PaginaFinal', $paginaActual + $numPages - 1);
            $doc->addChild('Formato', strtoupper($extension));
            $doc->addChild('Tamanio', $fileDetail->size ?? '0');
            $doc->addChild('Origen', $origen);
            $doc->addChild('TipologiaDocumental', $file->typeDocumental->name_es ?? '—');
            $doc->addChild('NumeroPaginas', $numPages);

            $paginaActual += $numPages;
        }

        $fileName = "indice_exp_{$exp->id}_" . now()->format('YmdHis') . ".xml";

        Storage::put("indices/" . $fileName, $xml->asXML());

        return response()->json(['file' => $fileName]);
    }

    public function downloadIndex($fileName)
    {
        $path = storage_path("app/indices/" . $fileName);

        if (!file_exists($path)) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }

        return response()->download($path, $fileName, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"'
        ]);
    }

    function close(Request $request) {
        $ids = $request->ids;
        $password = $request->password;
        $user = Auth::user();
        if(!Auth::attempt(['usuario' => $user->usuario, 'password' => $password])) {
            return response()->json([
                'message' => __('documental_gestion.exp_files.dialogs.close_form.message_error_login')
            ],422);
        }
        foreach ($ids as $key => $id) {
            $data = $this->expFilesRepository->storeGeneral([
                'id' => $id,
                'close_observation' => $request->close_observation,
            ]);
            $data->deleted_by = Auth::user()->id;
            $data->save();
            $data->delete();

            activity('Expediente_detalle')
            ->causedBy(auth()->user()) // Usuario que realiza la acción
            ->performedOn($data) // Relación con ExpFiles
            ->withProperties([
                'expFiles' => $data
            ])
            ->log("Se cerro el expediente");
        }

        if(count($ids) == 1) {
            return $this->expFilesRepository->exportClosePdf([
                'data' => $data
            ]);
        }

        return response()->json();
    }

    function exportFuid(Request $request) {
        $pdfName = 'Fuid'.'.pdf';

        $expFile = $this->expFilesRepository->find($request->id);
        // Generamos el PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('PDF.Fuid', ['expFile' => $expFile]);
        $pdf->setPaper('A4', 'landscape');
        return response($pdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="export.xlsx"')->header('X-File-Name', $pdfName);
    }

    function exportSheetControl(Request $request) {
        $id = $request->id;
        $exp = $this->expFilesRepository->find($id);

        return response()->json();
    }

    function exportPackageZip(Request $request) {
        try {
            return $this->expFilesRepository->exportPackageZip($request);
        } catch (\Throwable $th) {
            throw $th;
            return response()->json(['error' => 'No se pudo crear el archivo ZIP.'], 500);
        }
    }

    function edit(String $id, Request $request) {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $currentLocale = App::getLocale();
        $sub_exp = !empty($request->sub_exp) ? true : false;
        return Inertia::render("document_gestion/ExpFiles/Create",compact('id','clasifications','currentLocale','sub_exp'));
    }

    function show(String $id) {
        $object = $this->expFilesRepository->find($id,['dependencies','subExp.dependencies']);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->expFilesRepository->find($id);
        if($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesRepository->list(request: array_merge($filters, ['typeData' => 'todos']),select: [
            'number',
            'name',
            'serie',
            'subserie',
            'date_init',
            'dependency_id',
            'creado_por_id',
            'clasification_id',
        ]);
        foreach ($data as $value) {
            $value->serie_name = $value->serie['name'];
            $value->subserie_name = $value->subserie['name'];

            // Obtener el nombre de la dependencia
            $value->dependency_id = $value->dependency->name ?? null;
            $value->creado_por_id = $value->createBy->persona->nombre . ' '. $value->createBy->persona->apellido;
            $value->clasification_id = $value->clasification['name_'.session('locale','es')] . ' '. $value->clasification['name_'.session('locale','es')];
        }
        $data = $data->toArray();

        $data2 = [];
        foreach ($data as $key => $value) {
            unset($value['serie']);
            unset($value['subserie']);
            unset($value['dependency']);
            unset($value['create_by']);
            unset($value['clasification']);
            $data2[] = $value;
        }
        return $this->expFilesRepository->export($type,$data2,'Excel.Export.generalExport','documental_gestion.exp_files.table');
    }
    function exportTableControl(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesRepository->list(request: array_merge($filters, ['typeData' => 'todos']));
        $data2 = [];
        foreach ($data as $value) {
            $item = [
                'code' => $value->dependency?->code,
                'name' => $value->dependency?->name,
                'code_serie' => $value->serie['code'],
                'serie' => $value->serie['name'],
                'code_subserie' => $value->subserie['code'],
                'subserie' => $value->subserie['name'],
                'access' => implode(', ',$value->acccess->map(function ($i) {
                    return $i->typeControl['name_'.session('locale','es')];
                })->toArray()),
                'rol' => implode(', ',$value->roles->map(function ($i) {
                    return $i->name;
                })->toArray()),
                'state' => is_null($value->clasification_id) ? __('auth.state.active') : $value->clasification['name_'.session('locale','es')],
            ];

            $data2[] = $item;
        }
        return $this->expFilesRepository->export($type,$data2,'Excel.Export.generalExport','documental_gestion.exp_files.table_control');
    }
    function exportTransfer(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesRepository->list(request: array_merge($filters, ['typeData' => 'todos', 'onlyWithUbications' => true]));
        $data2 = [];
        foreach ($data as $value) {
            $item = [
                'name' => $value->name,
                'number' => $value->number,
                'serie' => $value->serie['name'],
                'subserie' => $value->subserie['name'],
                'date_init' => $value->date_init,
                'dependency_id' => $value->dependency->name,
                'creado_por_id' => $value->createBy->persona->nombre . ' '. $value->createBy->persona->apellido,
                'type_archive' =>
                    $value->expFilesArchiveds()->count() == 1 || $value->expFilesArchiveds()->count() == 0
                    ? __('documental_gestion.exp_files.table.type_archive_state.first')
                    : __('documental_gestion.exp_files.table.type_archive_state.second'),
                'state_table' => $this->expFilesRepository->getState($value)
            ];

            $data2[] = $item;
        }
        return $this->expFilesRepository->export($type,$data2,'Excel.Export.generalExport','documental_gestion.exp_files.table');
    }
    function exportArchive(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesRepository->list(request: array_merge($filters, ['typeData' => 'todos']));
        $data2 = [];
        foreach ($data as $value) {
            $item = [
                'number' => $value->number,
                'name' => $value->name,
                'description' => $value->description,
                'serie' => $value->serie['name'],
                'subserie' => $value->subserie['name'],
                'created_at' => $value->created_at->format('Y-m-d'),
                'time_gestion' => $value->created_at->format('Y-m-d'),
                'time_central' => $value->expFilesArchived?->created_at->format('Y-m-d'),
                'space' => $value->expFilesArchiveds()->count() ? __('documental_gestion.exp_files.table.space_states.assigned') : __('documental_gestion.exp_files.table.space_states.not_assigned'),
            ];

            $data2[] = $item;
        }
        return $this->expFilesRepository->export($type,$data2,'Excel.Export.generalExport','documental_gestion.exp_files.table');
    }

    function archive(Request $request)  {
        $typeAnex = $this->typeAnnexesRepository->all();
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();
        $expFilesSupportsType = $this->expFilesSupportTypeRepository->all();
        $typesBody = $this->typesBodyRepository->all();
        return Inertia::render("document_gestion/ExpFiles/Archive",compact('typeAnex','expFilesTypeDocs','expFilesSupportsType','typesBody'));
    }
    function tableControl(Request $request)  {
        $typeAnex = $this->typeAnnexesRepository->all();
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();
        $expFilesSupportsType = $this->expFilesSupportTypeRepository->all();
        $typesBody = $this->typesBodyRepository->all();
        $clasifications = $this->expFilesClasificationsRepository->all();
        $expFilesTypeControl = $this->expFileTypeControlRepository->all();
        return Inertia::render("document_gestion/ExpFiles/TableControl",compact('typeAnex','expFilesTypeDocs','expFilesSupportsType','typesBody','clasifications','expFilesTypeControl'));
    }

    function transfer(Request $request)  {
        $typeAnex = $this->typeAnnexesRepository->all();
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();
        $expFilesSupportsType = $this->expFilesSupportTypeRepository->all();
        $typesBody = $this->typesBodyRepository->all();
        $users = $this->userRepository->list(['typeData' => 'todos'], ['persona']);

        return Inertia::render("document_gestion/ExpFiles/Transfer",compact('typeAnex','expFilesTypeDocs','expFilesSupportsType','typesBody','users'));
    }

    function exportTableControlPdf(ExpFiles $expFile) {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('PDF.PapperControl', ['expFile' => $expFile]);
        $pdf->setPaper('A4', 'landscape');
        return $pdf->stream();
    }

    function exportLogs(ExpFiles $expFile) {
        $data = [];

        foreach ($expFile->logs()->where('log_name','Expediente_detalle')->get() as $key => $log) {
            $item = [
                'Usuario' => $log->causer->persona->nombre. ' '. $log->causer->persona->apellido,
                'Dependencia' => $expFile->dependency->name,
                'Observación' => $log->description
            ];

            $data[] = $item;
        }

        return $this->expFilesRepository->export('excel',$data,'Excel.Export.generalExport','','Historico de expediente');nameModule:
    }

    public function moveDocuments(Request $request)
    {
        $request->validate([
            'source_exp_id' => 'required|exists:exp_files,id',
            'target_exp_id' => 'required|exists:exp_files,id|different:source_exp_id',
            'file_ids' => 'required|array|min:1',
            'file_ids.*' => 'required|integer',
        ]);

        $sourceExpId = $request->source_exp_id;
        $targetExpId = $request->target_exp_id;
        $fileIds = $request->file_ids;

        $files = ExpFilesFiles::whereIn('id', $fileIds)
            ->where('exp_file_id', $sourceExpId)
            ->get();

        if ($files->count() !== count($fileIds)) {
            return response()->json([
                'error' => 'Algunos documentos no pertenecen al expediente origen o no existen.'
            ], 422);
        }

        ExpFilesFiles::whereIn('id', $fileIds)
            ->update(['exp_file_id' => $targetExpId]);

        return response()->json([
            'message' => 'Documentos trasladados correctamente.'
        ]);
    }
}
