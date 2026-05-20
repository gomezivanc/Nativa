<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TypePersonController extends Controller
{
        public function __construct(private TypePersonRepository $typePersonRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/typePerson/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Configuration/typePerson/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->typePersonRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->typePersonRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/typePerson/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->typePersonRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->typePersonRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->typePersonRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->typePersonRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }
}
