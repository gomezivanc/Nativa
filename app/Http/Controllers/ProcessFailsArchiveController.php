<?php

namespace App\Http\Controllers;

use App\Repositories\ProcessFailsRepository;
use App\Repositories\ProcessInstanceRepository;
use App\Repositories\ProcessRepository;
use App\Repositories\ProcessResultsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProcessFailsArchiveController extends Controller
{
    private $processFailsRepository;
    private $processInstanceRepository;
    private $processResultsRepository;
    private $processRepository;

    public function __construct(
        ProcessFailsRepository $processFailsRepository,ProcessInstanceRepository $processInstanceRepository,
        ProcessResultsRepository $processResultsRepository, ProcessRepository $processRepository
    )
    {
        $this->processFailsRepository = $processFailsRepository;
        $this->processInstanceRepository = $processInstanceRepository;
        $this->processResultsRepository = $processResultsRepository;
        $this->processRepository = $processRepository;
    }

    function index(Request $request) {
        $processInstances = $this->processInstanceRepository->all();
        $processResults = $this->processResultsRepository->all();

        return Inertia::render("JudicialProcess/ProcessFailArchive/Index",[
            'processInstances' => $processInstances,
            'processResults' => $processResults
        ]);
    }

    function create(Request $request) {
        return Inertia::render("JudicialProcess/ProcessFailArchive/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $isArchived = $request['isArchived'];
        unset($request['isArchived']);
        $data = $this->processFailsRepository->storeGeneral($request->all());
        if($isArchived) {
            // archivar el proceso
            $this->processRepository->find($data->id_proceso)->update([
                'estado' => "C"
            ]);
        }
        return response()->json($data);
    }

    function list(Request $request) {
        $request['prejudicial'] = true;
        $data = $this->processFailsRepository->list($request->all(),with: ['process','instance']);
        foreach ($data as $key => $value) {
            $value['allow_edit'] = $value->process->id_responsable == Auth::user()->id;
        }
        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("JudicialProcess/ProcessFailArchive/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->processFailsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processFailsRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
