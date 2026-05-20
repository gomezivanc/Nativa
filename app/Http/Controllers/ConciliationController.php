<?php

namespace App\Http\Controllers;

use App\Repositories\ConciliationRepository;
use App\Repositories\TypeConciliationRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConciliationController extends Controller
{
    private $conciliationRepository;
    private $typeConciliationRepository;

    public function __construct(ConciliationRepository $conciliationRepository,TypeConciliationRepository $typeConciliationRepository)
    {
        $this->conciliationRepository = $conciliationRepository;
        $this->typeConciliationRepository = $typeConciliationRepository;
    }

    function index(Request $request) {
        $typesConciliation = $this->typeConciliationRepository->all();

        return Inertia::render("JudicialProcess/ConciliationProcess/Index",[
            'typesConciliation' => $typesConciliation
        ]);
    }

    function create(Request $request) {
        return Inertia::render("JudicialProcess/ConciliationProcess/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->conciliationRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->conciliationRepository->list($request->all(),with: ['process.responsable.persona:id,nombre','typeConciliation']);
        foreach ($data as $key => $value) {
            $value['allow_edit'] = $value->process->id_responsable == Auth::user()->id;
        }
        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("JudicialProcess/ConciliationProcess/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->conciliationRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->conciliationRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
