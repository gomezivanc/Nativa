<?php

namespace App\Http\Controllers;

use App\Exports\ProcessContableExport;
use App\Exports\ProcessF21Export;
use App\Exports\ProcessGeneralExport;
use App\Repositories\DefendantsRepository;
use App\Repositories\DepartamentosRepository;
use App\Repositories\ExternalRepresentantRepository;
use App\Repositories\JudgeRepository;
use App\Repositories\JudicialOfficesRepository;
use App\Repositories\PlaintiffsRepository;
use App\Repositories\ProcessRepository;
use App\Repositories\SecretaryRepository;
use App\Repositories\ThemesRepository;
use App\Repositories\TypeAmountRepository;
use App\Repositories\TypeProcessRepository;
use App\Repositories\UnitiesRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ProcessController extends Controller
{
    private $processRepository;
    private $departamentosRepository;
    private $typeProcessRepository;
    private $typeAmountRepository;
    private $unitiesRepository;
    private $judicialOfficesRepository;
    private $defendantsRepository;
    private $plaintiffsRepository;
    private $userRepository;
    private $judgeRepository;
    private $themesRepository;
    private $externalRepresentantRepository;
    private $secretaryRepository;

    public function __construct(
        ProcessRepository $processRepository,DepartamentosRepository $departamentosRepository,TypeProcessRepository $typeProcessRepository,
        TypeAmountRepository $typeAmountRepository, UnitiesRepository $unitiesRepository, JudicialOfficesRepository $judicialOfficesRepository,
        DefendantsRepository $defendantsRepository, PlaintiffsRepository $plaintiffsRepository, UserRepository $userRepository, JudgeRepository $judgeRepository,
        ThemesRepository $themesRepository, ExternalRepresentantRepository $externalRepresentantRepository, SecretaryRepository $secretaryRepository
    )
    {
        $this->processRepository = $processRepository;
        $this->departamentosRepository = $departamentosRepository;
        $this->typeProcessRepository = $typeProcessRepository;
        $this->typeAmountRepository = $typeAmountRepository;
        $this->unitiesRepository = $unitiesRepository;
        $this->judicialOfficesRepository = $judicialOfficesRepository;
        $this->defendantsRepository = $defendantsRepository;
        $this->plaintiffsRepository = $plaintiffsRepository;
        $this->userRepository = $userRepository;
        $this->judgeRepository = $judgeRepository;
        $this->themesRepository = $themesRepository;
        $this->externalRepresentantRepository = $externalRepresentantRepository;
        $this->secretaryRepository = $secretaryRepository;
    }

    function index(Request $request) {
        $typeProcess = $this->typeProcessRepository->all();
        $users = $this->userRepository->all();
        $plaintiffs = $this->plaintiffsRepository->all();
        $externalRepresentants = $this->externalRepresentantRepository->all();


        return Inertia::render("JudicialProcess/Process/Index",[
            'typeProcess' => $typeProcess, 'users' => $users
            ,'plaintiffs' => $plaintiffs, 'externalRepresentants' => $externalRepresentants
        ]);
    }
    function noActive(Request $request) {
        return Inertia::render("JudicialProcess/ProcessFail/Activation");
    }

    function create(Request $request) {
        $departaments = $this->departamentosRepository->all();
        $typeProcess = $this->typeProcessRepository->all();
        $typeAmount = $this->typeAmountRepository->all();
        $unities = $this->unitiesRepository->all();
        $offices = $this->judicialOfficesRepository->all();
        $defendants = $this->defendantsRepository->all();
        $plaintiffs = $this->plaintiffsRepository->all();
        $users = $this->userRepository->all();
        $judges = $this->judgeRepository->all();
        $themes = $this->themesRepository->all();
        $externalRepresentants = $this->externalRepresentantRepository->all();
        $secretaries = $this->secretaryRepository->all();
        return Inertia::render("JudicialProcess/Process/Create",compact(
            'departaments','typeProcess','typeAmount', 'unities','offices',
            'plaintiffs', 'users','defendants','judges', 'themes', 'externalRepresentants',
            'secretaries'
        ));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
            $request->validate([
                'nro_radicado' => [
                    'required',
                    Rule::unique('processes')->where(function ($query) {
                        return $query->whereNull('deleted_at');
                    }),
                ],
            ],[
                'nro_radicado.unique' => 'El número de radicado ya está en uso',
            ]);
        }   
        $data = $this->processRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function translate(Request $request) {
        foreach ($request->data as $key => $value) {
            $this->processRepository->storeGeneral($value);
        } 
        
        return response()->json([
            'message' => 'Transladado con exito'
        ]);
    }

    function list(Request $request) {
        $request['with_archived'] = true;
        $data = $this->processRepository->list($request->all(),with: [
            'responsable.persona:id,nombre','plaintiffs','defendant', 'typeProcess',
            'theme','unity', 'office', 'judges'
        ]);
        return response()->json($data);
    }

    function edit(String $id) {
        $departaments = $this->departamentosRepository->all();
        $typeProcess = $this->typeProcessRepository->all();
        $typeAmount = $this->typeAmountRepository->all();
        $unities = $this->unitiesRepository->all();
        $offices = $this->judicialOfficesRepository->all();
        $defendants = $this->defendantsRepository->all();
        $plaintiffs = $this->plaintiffsRepository->all();
        $users = $this->userRepository->all();
        $judges = $this->judgeRepository->all();
        $themes = $this->themesRepository->all();
        $externalRepresentants = $this->externalRepresentantRepository->all();
        $secretaries = $this->secretaryRepository->all();
        return Inertia::render("JudicialProcess/Process/Create",compact(
            'departaments','typeProcess','typeAmount', 'unities','offices',
            'plaintiffs', 'users','defendants','judges', 'themes', 'externalRepresentants',
            'secretaries','id'
        ));
    }

    function show(String $id) {
        $object = $this->processRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processRepository->find($id);
        if ($object) {
            // Verifica si el registro está borrado
            if ($object->trashed()) {
                // Restaura el registro borrado
                $object->restore();
            } else {
                $object->delete();
            }
        }
        return response()->json($object);
    }

    function reactive(Request $request) {
        if($request['isArchived']) {
            $request['estado'] = null;
        } else {
            $request['estado'] = 'C';
        }
        $data = $this->processRepository->storeGeneral($request->only(['id','estado','razon_cam_estado']));
        return $data;
    }

    function masiveArchivement(Request $request) {
        foreach ($request['selectedProcess'] as $key => $value) {
            $item = [
                'id' => $value['id'],
                'razon_cam_estado' => $request['razon_cam_estado'],
                'estado' => 'C'
            ];
            $this->processRepository->storeGeneral($item);
        }
    }

    // Excel Exports

    function excelGeneral(Request $request) {
        $request['typeData'] = 'todos';
        $data = $this->list($request);
        // return $data;
        $dataExcel = [
            'data' => $data->original
        ];
        // dd($dataExcel);
        $title = "Informe general ".Carbon::now()->toString().".xlsx";
        return Excel::download(new ProcessGeneralExport($dataExcel),$title);
    }

    function excelContable(Request $request) {
        $request['typeData'] = 'todos';
        $data = $this->list($request);
        // return $data;
        $dataExcel = [
            'data' => $data->original
        ];
        // dd($data);
        $title = "Informe Formato contabilidad ".Carbon::now()->toString().".xlsx";
        return Excel::download(new ProcessContableExport($dataExcel),$title);
    }

    function excelF21(Request $request) {
        $request['typeData'] = 'todos';
        $data = $this->list($request);
        // return $data;
        $dataExcel = [
            'data' => $data->original
        ];
        // dd($data);
        $title = "Informe Contraloria Formato F21 ".Carbon::now()->toString().".xlsx";
        return Excel::download(new ProcessF21Export($dataExcel),$title);
    }
}
