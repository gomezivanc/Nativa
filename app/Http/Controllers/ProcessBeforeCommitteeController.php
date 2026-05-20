<?php

namespace App\Http\Controllers;

use App\Repositories\ComitteeDecitionsRepository;
use App\Repositories\ProcessBeforeComitteRepository;
use App\Repositories\ProcessFailsRepository;
use App\Repositories\ProcessRepository;
use App\Repositories\ProcessResultsRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProcessBeforeCommitteeController extends Controller
{
    private $processRepository;
    private $processBeforeComitteRepository;
    private $processFailsRepository;
    private $processResultsRepository;
    private $userRepository;
    private $comitteeDecitionsRepository;

    public function __construct(
        ProcessRepository $processRepository, ProcessBeforeComitteRepository $processBeforeComitteRepository,
        ProcessFailsRepository $processFailsRepository, ProcessResultsRepository $processResultsRepository,
        UserRepository $userRepository, ComitteeDecitionsRepository $comitteeDecitionsRepository
    )
    {
        $this->processRepository = $processRepository;
        $this->processBeforeComitteRepository = $processBeforeComitteRepository;
        $this->processFailsRepository = $processFailsRepository;
        $this->processResultsRepository = $processResultsRepository;
        $this->userRepository = $userRepository;
        $this->comitteeDecitionsRepository = $comitteeDecitionsRepository;
    }

    function index(Request $request) {
        return Inertia::render("JudicialProcess/ProcessBeforeComitee/Index");
    }

    function create(Request $request) {
        return Inertia::render("JudicialProcess/Process/Create");
    }

    // store - update
    function store(Request $request) { 
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }  
        $data = $this->processBeforeComitteRepository->storeGeneral($request->all());
        // guardar archivo
        return response()->json($data);
    }
    function list(Request $request) {
        $data = $this->processBeforeComitteRepository->list($request->all(),with: ['process:id,nro_radicado,a_proceso,id_demandante,id_responsable','process.plaintiffs:id,nombre','process.responsable.persona']);
        foreach ($data as $key => $value) {
            $value['allow_edit'] = $value->process->id_responsable == Auth::user()->id;
        }
        return response()->json($data);
    }

    function dataForm(Request $request) {
        $fail = $this->processFailsRepository->getLastFailProcess($request->id_process);
        $results = $this->processResultsRepository->all();
        $users = $this->userRepository->all(with: ['persona']);
        $decitions = $this->comitteeDecitionsRepository->all();

        return response()->json(
            [
                'fail' => $fail,
                'results' => $results,
                'users' => $users,
                'decitions' => $decitions
            ]
        );
    }

    function show(String $id) {
        $object = $this->processBeforeComitteRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processBeforeComitteRepository->find($id);
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
