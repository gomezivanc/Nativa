<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
        public function __construct(private CompanyRepository $companyRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/company/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Configuration/company/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->companyRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->companyRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/company/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->companyRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->companyRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->companyRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->companyRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }
}
