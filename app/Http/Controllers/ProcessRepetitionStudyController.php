<?php

namespace App\Http\Controllers;

use App\Models\Process;
use App\Repositories\ProcessBeforeComitteRepository;
use App\Repositories\ProcessFailsRepository;
use App\Repositories\ProcessRepository;
use App\Repositories\ProcessStudyRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProcessRepetitionStudyController extends Controller
{
    private $processRepository;
    private $processBeforeComitteRepository;
    private $processFailsRepository;
    private $processResultsRepository;
    private $userRepository;
    private $comitteeDecitionsRepository;
    private $processStudyRepository;

    public function __construct(
        ProcessRepository $processRepository, UserRepository $userRepository,
        ProcessStudyRepository $processStudyRepository,
        ProcessFailsRepository $processFailsRepository, 
    )
    {
        $this->processRepository = $processRepository;
        $this->processFailsRepository = $processFailsRepository;
        $this->userRepository = $userRepository;
        $this->processStudyRepository = $processStudyRepository;
    }

    function index(Request $request) {
        return Inertia::render("JudicialProcess/ProcessRepetitionStudy/Index");
    }

    function create(Request $request) {
        return Inertia::render("JudicialProcess/ProcessRepetitionStudy/Create");
    }

    // store - update
    function store(Request $request) { 
        if(empty($request['id'])) {
            $request['asignado_por'] = Auth::user()->id;
        }  
        $data = $this->processStudyRepository->storeGeneral($request->all());
        // guardar archivo
        return response()->json($data);
    }

    function translate(Request $request) {
        foreach ($request->data as $key => $value) {
            $this->processStudyRepository->storeGeneral($value);
        }
        
        return response()->json([
            'message' => 'Transladado con exito'
        ]);
    }

    function list(Request $request) {
        if(empty($request['any'])) {
            $request['asignado_a'] = Auth::user()->id;
        }
        $data = $this->processStudyRepository->list($request->all(),with: ['process:id,nro_radicado,a_proceso,id_demandante,id_responsable','process.plaintiffs:id,nombre','process.responsable.persona']);
        foreach ($data as $key => $value) {
            $process = Process::find($value->id_proceso); // Obtén el modelo Process específico por su ID
            $fail = $process->fails()->latest()->first();
            $value->fail = $fail;
            $value->fail->instance = $fail->instance;
            $value->fail->result = $fail->result;
        }
        return response()->json($data);
    }

    function dataForm(Request $request) {
        $fail = $this->processFailsRepository->getLastFailProcess($request->id_process);
        // $results = $this->processResultsRepository->all();
        $users = $this->userRepository->all(with: ['persona']);
        // $decitions = $this->comitteeDecitionsRepository->all();

        return response()->json(
            [
                'fail' => $fail,
                // 'results' => $results,
                'users' => $users,
                // 'decitions' => $decitions
            ]
        );
    }

    function show(String $id) {
        $object = $this->processStudyRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processStudyRepository->find($id);
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
}
