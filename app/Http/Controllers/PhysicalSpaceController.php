<?php

namespace App\Http\Controllers;

use App\Repositories\PhysicalSpaceRepository;
use App\Repositories\PhysicalSpacesUbicationsRepository;
use App\Repositories\TypesBodyRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PhysicalSpaceController extends Controller
{
    public function __construct(private PhysicalSpaceRepository $physicalSpaceRepository, private TypesBodyRepository $typesBodyRepository, private PhysicalSpacesUbicationsRepository $physicalSpacesUbicationsRepository)
    {
    }

    function index(Request $request) {
        $typeBodies = $this->typesBodyRepository->all();
        return Inertia::render("archive_gestion/physicalSpace/Index",compact('typeBodies'));
    }

    function create(Request $request) {
        $typeBodies = $this->typesBodyRepository->all();
        $buildings = $this->physicalSpaceRepository->all();
        return Inertia::render("archive_gestion/physicalSpace/Create",compact('typeBodies','buildings'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        if(!empty($request['building_id'])) {
            $request['name'] = $this->physicalSpaceRepository->find($request['building_id'])?->name;
            unset($request['building_id']);
        }
        $data = $this->physicalSpaceRepository->storeGeneral($request->except('physical_spaces_ubications','is_exist','building_id','ubications'));

        $data->ubications()->delete();
        foreach ($request->physical_spaces_ubications as $key => $ubication) {
            $ubication['physical_space_id'] = $data->id;
            $data->ubications()->create($ubication);
        }
        return response()->json($data);
    }

    function select(Request $request) {
        $data = $this->physicalSpaceRepository->select(request: $request->all(), groupBy: ['name']);
        return $data;
    }
    function selectFloors(Request $request) {
        $data = $this->physicalSpacesUbicationsRepository->list(select: ['floor'],request: $request->all(), groupBy: ['floor']);
        return $data;
    }
    function selectFilesArea(Request $request) {
        $data = $this->physicalSpacesUbicationsRepository->list(request: $request->all());
        return $data;
    }

    function list(Request $request) {
        $data = $this->physicalSpacesUbicationsRepository->list($request->all(),['building','typeBody']);

        return response()->json($data);
    }

    function edit(String $id) {
        $typeBodies = $this->typesBodyRepository->all();
        $buildings = $this->physicalSpaceRepository->all();
        return Inertia::render("archive_gestion/physicalSpace/Create",compact('id','typeBodies','buildings'));
    }

    function show(String $id) {
        $object = $this->physicalSpaceRepository->find($id,['ubications']);
        return response()->json($object);
    }

    function showUbication(String $id) {
        $object = $this->physicalSpacesUbicationsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->physicalSpacesUbicationsRepository->find($id);
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
        $data = $this->physicalSpacesUbicationsRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }

        $dataObtained = [];
        foreach ($data as $key => $value) {
            $item = [
                'name' => $value->building?->name,
                'floor' => $value->floor,
                'file_area' => $value->file_area,
                'rack' => $value->rack,
                'module' => $value->module,
                'type_body_id' => $value->typeBody?->name,
                'created_at' => $value->created_at,
            ];

            $dataObtained[] = $item;
        }
        return $this->physicalSpaceRepository->export($type,$dataObtained,'Excel.Export.generalExport','archive_gestion.physicalSpace.table');
    }
}
