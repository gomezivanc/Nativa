<?php

namespace App\Http\Controllers;

use App\Repositories\ConfMaskTrdRepository;
use App\Repositories\ExternalRepresentantRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrdController extends Controller
{
    public function __construct(private TrdRepository $trdRepository, private ConfMaskTrdRepository $confMaskTrdRepository)
    {
        $this->trdRepository = $trdRepository;
    }

    function index(Request $request) {
        return Inertia::render("Configuration/Trd/Index",[
        ]);
    }

    function create(Request $request) {
        $masks = $this->confMaskTrdRepository->all();

        return Inertia::render("Configuration/Trd/Create",[
            'masks' => $masks
        ]);
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->trdRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->trdRepository->list($request->all(),['mask']);

        return response()->json($data);
    }

    function edit(String $id) {
        $masks = $this->confMaskTrdRepository->all();

        return Inertia::render("Configuration/Trd/Create",compact('id','masks'));
    }

    function show(String $id) {
        $object = $this->trdRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->trdRepository->find($id);
        if($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->trdRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $value) {
            $value->makeHidden(['created_at','updated_at','deleted_at','conf_mask_trd_id','creado_por_id','mask','id']);
            $value->mask_name = $value->mask->name;
        }
        return $this->trdRepository->export($type,$data->toArray(),'Excel.Export.generalExport','configuration.trd.form');
    }
}
