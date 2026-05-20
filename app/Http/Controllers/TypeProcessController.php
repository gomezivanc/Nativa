<?php

namespace App\Http\Controllers;

use App\Repositories\TypeProcessRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TypeProcessController extends Controller
{
    private $typeProcessRepository;

    public function __construct(TypeProcessRepository $typeProcessRepository)
    {
        $this->typeProcessRepository = $typeProcessRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/TypeProcess/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/TypeProcess/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->typeProcessRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->typeProcessRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/TypeProcess/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->typeProcessRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->typeProcessRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
