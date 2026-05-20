<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Repositories\RegionalRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RegionalController extends Controller
{
    public function __construct(private RegionalRepository $regionalRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/regional/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/regional/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->regionalRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->regionalRepository->list($request->all(), ['country','departament','city']);
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/regional/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->regionalRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->regionalRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->regionalRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'country',
                'departament',
                'city',
                'id',
                'gdDependency'
            ]);
        }

        foreach ($data as $key => $value) {
            $value->country_id = $value->country?->name;
            $value->departament_id = $value->departament?->nombre;
            $value->city_id = $value->city?->nombre;
        }
        return $this->regionalRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.regional.form');
    }

    function countries() {
        return response()->json(Country::all());
    }
}
