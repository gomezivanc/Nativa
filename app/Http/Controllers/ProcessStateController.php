<?php

namespace App\Http\Controllers;

use App\Repositories\ProcessStateRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProcessStateController extends Controller
{
    private $processStateRepository;

    public function __construct(ProcessStateRepository $processStateRepository)
    {
        $this->processStateRepository = $processStateRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/ProcessState/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/ProcessState/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->processStateRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->processStateRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/ProcessState/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->processStateRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processStateRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
