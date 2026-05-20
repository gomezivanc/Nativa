<?php

namespace App\Http\Controllers;

use App\Repositories\SmlvRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SmlvController extends Controller
{
    private $smlvRepository;

    public function __construct(SmlvRepository $smlvRepository)
    {
        $this->smlvRepository = $smlvRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Smlv/Index");
    }

    function create(Request $request) {
        $lastSm = $this->smlvRepository->getLast();
        return Inertia::render("Maestros/Smlv/Create",compact('lastSm'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->smlvRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->smlvRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/Smlv/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->smlvRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->smlvRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
