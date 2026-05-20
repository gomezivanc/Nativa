<?php

namespace App\Http\Controllers;

use App\Repositories\DistributionUnitRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\FilingRepository;
use App\Repositories\FilingLogRepository;
use App\Repositories\UsuarioRepository;
use App\Repositories\ReceivedEmailRepository;
use App\Repositories\CopyFilingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\FilingController;
use Illuminate\Support\Facades\DB;
use App\Models\Filing;

class DistributionUnitController extends Controller
{
    public function __construct(
        private DistributionUnitRepository $distributionUnitRepository,
        private GDDependencyRepository $gdDependencyRepository,
        private FilingRepository $filingRepository,
        private UsuarioRepository $usuarioRepository,
        private FilingController $filingController,
        private FilingLogRepository $filingLogRepository,
        private ReceivedEmailRepository $receivedEmailRepository,
        private CopyFilingRepository $copyFilingRepository,
    ) {
    }

    public function index(Request $request)
    {
        return Inertia::render("Configuration/Distribution/Index", []);
    }

    public function indexmane(Request $request)
    {
        return Inertia::render("correspondenceManagement/DistributionUnitFilings/Index", []);
    }

    public function create(Request $request)
    {
        $dependencies = $this->gdDependencyRepository->all();

        return Inertia::render("Configuration/Distribution/Create", [
            'dependencies' => $dependencies
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'id_dependency' => 'required|exists:g_d_dependencies,id',
            'observation' => 'nullable|string',
        ]);

        $data = $this->distributionUnitRepository->storeGeneral($request->except('dependency'));
        return response()->json($data);
    }

    public function list(Request $request)
    {
        $data = $this->distributionUnitRepository->list($request->all(), ['dependency']);

        // Agregar conteo de radicados a cada unidad
        foreach ($data as $value) {
            if ($value->central_bool == 1) {
                // Para unidades centrales: contar correos con el repositorio
                $value->filing_count = $this->receivedEmailRepository->getByDistributionUnit($value->id_mail)->count();
            } else {
                // Para unidades normales: contar radicados sin oficial asignado
                $value->filing_count = $value->filings()->where('official_id', null)->count();
            }
        }

        return response()->json($data);
    }

    public function listFull(Request $request)
    {
        $full = $request->full ?? 1;

        $unidadesDisrtibucion = $full == 1
            ? $this->distributionUnitRepository->listFull()
            : $this->distributionUnitRepository->listOfficial();

        foreach ($unidadesDisrtibucion as $value) {
            if (!$value->relationLoaded('dependency')) {
                $value->load('dependency');
            }

            if ($value->central_bool == 1) {
                $value->filing_count = $this->receivedEmailRepository->getByDistributionUnit($value->id_mail)->count();
            } else {
                $originalCount = $value->filings()->where('official_id', null)->count();

                $copyCount = DB::table('copy_filing')
                    ->where('id_unitidis', $value->id)
                    ->where('estado', 1)
                    ->whereNull('id_official')
                    ->count();
                $value->filing_count = $originalCount + $copyCount;
            }
        }

        return response()->json($unidadesDisrtibucion);
    }

    public function edit(String $id)
    {
        $dependencies = $this->gdDependencyRepository->all();

        return Inertia::render("Configuration/Distribution/Create", compact('id', 'dependencies'));
    }

    public function show(String $id)
    {
        $object = $this->distributionUnitRepository->find($id, ['dependency']);
        return response()->json($object);
    }

    public function destroy(String $id)
    {
        $object = $this->distributionUnitRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    public function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->distributionUnitRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $value) {
            $value->makeHidden(['created_at', 'updated_at', 'deleted_at']);
            $value->dependency_name = $value->dependency->name ?? 'N/A';
        }
        return $this->distributionUnitRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.distribution.form');
    }

    public function showFilings(String $id)
    {   
        $distributionUnit = $this->distributionUnitRepository->find($id, ['dependency']);
        
        // Obtener radicados normales sin oficial asignado
        $filings = $distributionUnit->filings()
            ->where('official_id', null)
            ->with('chargeDocFilings', 'clasification', 'documentalType', 'receptionMedia', 'TypeOfProcedure')
            ->orderByDesc('created_at')
            ->get();

        // Marcar originales como no-copia
        foreach ($filings as $filing) {
            $filing->is_copy = false;
            $filing->copy_id = null;
        }

        // Obtener copias SIN FUNCIONARIO asignado
        $copiesData = DB::table('copy_filing')
            ->where('id_unitidis', $id)
            ->where('estado', 1)
            ->whereNull('id_official')
            ->get();
        
        $copiesFilings = [];
        if ($copiesData->isNotEmpty()) {
            $copyFilingIds = $copiesData->pluck('id_filing')->toArray();
            $copiesMap = $copiesData->keyBy('id_filing');

            $copiesFilings = Filing::whereIn('id', $copyFilingIds)
                ->with('chargeDocFilings', 'clasification', 'documentalType', 'receptionMedia', 'TypeOfProcedure')
                ->get();
            
            // Marcar como copia y adjuntar copy_id
            foreach ($copiesFilings as $copy) {
                $copy->is_copy = true;
                $copyData = $copiesMap->get($copy->id);
                if ($copyData) {
                    $copy->copy_id = $copyData->id;
                }
            }
        }

        // Combinar y ordenar
        $allFilings = $filings->concat($copiesFilings)->sortByDesc('created_at');
        
        $distributionUnit->setRelation('filings', $allFilings);
        
        return Inertia::render("correspondenceManagement/DistributionUnitFilings/Show", [
            'distributionUnit' => $distributionUnit
        ]);
    }

    public function listReceivedEmails(Request $request, String $id)
    {
        $query = $this->receivedEmailRepository->getByDistributionUnitQuery($id);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('filing_number', 'like', '%' . $search . '%')
                ->orWhere('subject', 'like', '%' . $search . '%');
            });
        }

        // Pagination
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        
        // Execute pagination on the builder
        $data = $query->orderByDesc('received_at')
                    ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function showOther(String $id , $id2)
    {   
        $object = $this->receivedEmailRepository->getByDistributionUnitQuery($id)
                ->orderByDesc('received_at')
                ->paginate(10);

        $distributionUnit = $this->distributionUnitRepository->find($id2, ['dependency']);
        $distributionUnit->load(['filings' => function ($query) {
            $query->where('official_id', null)
                ->with('chargeDocFilings')
                ->with('clasification')
                ->with('documentalType')
                ->with('receptionMedia')
                ->with('TypeOfProcedure')
                ->orderByDesc('created_at');
        }]);
    
        return Inertia::render("correspondenceManagement/DistributionUnitFilings/ShowOther", [
            'distributionUnit' => $distributionUnit,
            'correosCentral' => $object
        ]);
    }

    public function listFilings(Request $request, String $id)
    {
        $distributionUnit = $this->distributionUnitRepository->find($id);
        
        // Obtener radicados normales de esta unidad
        $query = $distributionUnit->filings()
            ->where('official_id', null)
            ->with(['dependency', 'priority', 'user', 'chargeDocFilings','solicitud' => function ($q) {$q->withTrashed();},])
            ->withTrashed();

        // Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('filing_number', 'like', '%' . $search . '%')
                ->orWhere('subject', 'like', '%' . $search . '%');
        }

        // Pagination
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        
        $filings = $query->orderByDesc('created_at')
                    ->get();

        foreach ($filings as $filing) {
            $filing->is_copy = false;
            $filing->copy_id = null;
        }

        // Obtener copias SIN FUNCIONARIO asignado
        $copiesData = DB::table('copy_filing')
            ->where('id_unitidis', $id)
            ->where('estado', 1)
            ->whereNull('id_official')
            ->get();

        $copiesFilings = [];
        if ($copiesData->isNotEmpty()) {
            $copyFilingIds = $copiesData->pluck('id_filing')->toArray();
            $copiesMap = $copiesData->keyBy('id_filing');

            $copiesFilings = Filing::whereIn('id', $copyFilingIds)
                ->with(['dependency', 'priority', 'user', 'chargeDocFilings'])
                ->withTrashed()
                ->get();
            
            // Marcar como copia y adjuntar copy_id
            foreach ($copiesFilings as $copy) {
                $copy->is_copy = true;
                // Obtener el ID de la copia desde copy_filing
                $copyData = $copiesMap->get($copy->id);
                if ($copyData) {
                    $copy->copy_id = $copyData->id;
                }
            }
        }

        // Combinar resultados
        $allFilings = $filings->concat($copiesFilings);
        
        // Filtrar por búsqueda si es necesario
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $allFilings = $allFilings->filter(function ($filing) use ($search) {
                return strpos($filing->filing_number, $search) !== false ||
                        strpos($filing->subject ?? '', $search) !== false;
            });
        }

        // Ordenar por fecha de creación
        $allFilings = $allFilings->sortByDesc('created_at');

        // Paginar manualmente
        $total = $allFilings->count();
        $items = $allFilings->forPage($page, $perPage)->values();

        $data = new \Illuminate\Pagination\LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            [
                'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
                'query' => \Illuminate\Pagination\Paginator::resolveQueryString(),
            ]
        );

        return response()->json($data);
    }

    public function transferFiling(Request $request, String $filingId)
    {
        $request->validate([
            'distribution_id_filing' => 'required|exists:distribution_units,id',
        ]);

        try {
            $filing = $this->filingRepository->find($filingId);
            
            if (!$filing) {
                return response()->json(['message' => 'Filing not found'], 404);
            }

            $updated = $this->filingRepository->find($filingId)->update(['distribution_id_filing' => $request->distribution_id_filing]);

            $dataLog = [
                'action_es' => 'Traslado de radicado Unidad Correspondencia',
                'action_en' => 'Creation of filing',
                'description_es' => 'se realizo un traspaso a una nueva unidad de correspondencia',
                'description_en' => 'The document was filed correctly',
                'icon' => 'pi-at',
                'creado_por_id' => Auth::user()->id,
                'filing_id' => $filing->id,
                'dependency_id' => $filing->dependency_id,
                'color' => '#af904c'
            ];
            $this->filingLogRepository->storeGeneral($dataLog);

            return response()->json(['message' => 'Filing transferred successfully', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
    public function transferFilingCopy(Request $request, String $copyId)
    {
        try {
            $copy = $this->copyFilingRepository->find($copyId);

            if (!$copy) {
                return response()->json(['message' => 'Copy not found'], 404);
            }
            $updated = $this->copyFilingRepository->updateUnitByCopyId($copyId, $request->distribution_id_filing);

            return response()->json(['message' => 'Copy transferred successfully', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function finishCopy(Request $request, String $copyId)
    {
        try {
            $copy = $this->copyFilingRepository->find($copyId);

            if (!$copy) {
                return response()->json(['message' => 'Copy not found'], 404);
            }

            $updated = $this->copyFilingRepository->finishCopy($copyId, $request->observation);

            return response()->json(['message' => 'Copy finished successfully', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function assignOfficial(Request $request, String $filingId)
    {
        try {
            $filing = $this->filingRepository->find($filingId);
            
            if (!$filing) {
                return response()->json(['message' => 'Filing not found'], 404);
            }

            // Actualizar el official_id del filing mediante el repositorio

            $usuario = $this->usuarioRepository->findByOfficialId($request->official_id);
            // Usar la instancia inyectada en lugar de crear una nueva
            if (method_exists($this->filingController, 'envioCorreoRadicado')) {
                $this->filingController->envioCorreoRadicado($filing->email_sender, $usuario->email, $filing);
            }
            
            $updated = $this->filingRepository->find($filingId)->update(['official_id' => $request->official_id , 'serie' => $request->serie , 'sub_serie' => $request->subSerie , 'document_type_id' => $request->document_type_id]);

            $dataLog = [
                'action_es' => 'Funcionario asociado',
                'action_en' => 'Creation of filing',
                'description_es' => 'Se realizo la asociacion',
                'description_en' => 'The document was filed correctly',
                'icon' => 'pi-user-plus',
                'creado_por_id' => Auth::user()->id,
                'filing_id' => $filing->id,
                'dependency_id' => $filing->dependency_id,
                'color' => '#6f4caf'
            ];
            $this->filingLogRepository->storeGeneral($dataLog);

            return response()->json(['message' => 'Official assigned successfully', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function assignOfficialCopy(Request $request, String $copyId)
    {
        try {
            $copy = $this->copyFilingRepository->find($copyId);
            
            if (!$copy) {
                return response()->json(['message' => 'Copy not found'], 404);
            }
            
            $updated = $this->copyFilingRepository->updateUnitByofficial($copyId, $request->official_id);

            return response()->json(['message' => 'Official assigned successfully', 'data' => $updated]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function getFilingCopies(String $filingId)
    {
        try {
            $copies = $this->copyFilingRepository->getByFilingId($filingId);
            return response()->json($copies);
        
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

}
