<?php

namespace App\Http\Controllers;

use App\Repositories\SignedFilingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SignedFilingController extends Controller
{
        public function __construct(private SignedFilingRepository $signedFilingRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/signedFiling/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Configuration/signedFiling/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->signedFilingRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->signedFilingRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/signedFiling/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->signedFilingRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->signedFilingRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->signedFilingRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->signedFilingRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }
}
