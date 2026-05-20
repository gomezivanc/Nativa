<?php

namespace App\Http\Controllers;

use App\Repositories\FilingExpFileRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FilingExpFileController extends Controller
{
        public function __construct(private FilingExpFileRepository $filingExpFileRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/filingExpFile/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Configuration/filingExpFile/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->filingExpFileRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->filingExpFileRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/filingExpFile/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->filingExpFileRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->filingExpFileRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->filingExpFileRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->filingExpFileRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }
}
