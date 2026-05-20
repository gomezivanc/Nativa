<?php

namespace App\Http\Controllers;

use App\Repositories\ConfMaskTrdRepository;
use App\Repositories\ConfProviderSendRepository;
use App\Repositories\ConfServicesProviderRepository;
use App\Repositories\ExternalRepresentantRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConfProviderSendController extends Controller
{
    public function __construct(private ConfProviderSendRepository $confProviderSendRepository, private ConfServicesProviderRepository $confServicesProviderRepository)
    {
    }

    function index(Request $request) {
        $services = $this->confServicesProviderRepository->all();

        return Inertia::render("Configuration/Providers/Index",[
            'services' => $services
        ]);
    }

    function create(Request $request) {
        $services = $this->confServicesProviderRepository->all();

        return Inertia::render("Configuration/Providers/Create",[
            'services' => $services
        ]);
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->confProviderSendRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->confProviderSendRepository->list($request->all(),['service','regional']);

        return response()->json($data);
    }

    function edit(String $id) {
        $services = $this->confServicesProviderRepository->all();

        return Inertia::render("Configuration/Providers/Create",compact('id','services'));
    }

    function show(String $id) {
        $object = $this->confProviderSendRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->confProviderSendRepository->find($id);
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
        $data = $this->confProviderSendRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $value) {
            $value->makeHidden(['created_at','updated_at','deleted_at','creado_por_id','service','departament','city','id']);
            $item = [
                'name' => $value->name,
                'conf_services_provider_id' => $value->service->name,
                'regional_id' => $value->regional->name,
            ];

            $dataO[] = $item;
        }
        return $this->confProviderSendRepository->export($type,$dataO,'Excel.Export.generalExport','configuration.provider.form');
    }
}
