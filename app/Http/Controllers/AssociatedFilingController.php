<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AssociatedFilingController extends Controller
{
        public function __construct(private AssociatedFilingRepository $associatedFilingRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/associatedFiling/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Configuration/associatedFiling/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->associatedFilingRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->associatedFilingRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/associatedFiling/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->associatedFilingRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->associatedFilingRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->associatedFilingRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->associatedFilingRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }
}
