<?php

namespace App\Http\Controllers;

use App\Repositories\RadicationLabelRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RadicationLabelController extends Controller
{
    //
    public function __construct(private RadicationLabelRepository $radicationLabelRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/radication_label/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/radication_label/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->radicationLabelRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->radicationLabelRepository->list($request->all());
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/radication_label/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->radicationLabelRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->radicationLabelRepository->find($id);
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
        $data = $this->radicationLabelRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'id',
            ]);
        }
        return $this->radicationLabelRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.radication_label.form','configuration.radication_label.title');
    }
}
