<?php

namespace App\Http\Controllers;

use App\Repositories\PayrollManagementRepository;
use App\Repositories\VariablesTemplatesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VariablesTemplatesController extends Controller
{
    public function __construct(private VariablesTemplatesRepository $variablesTemplatesRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/variables_templates/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/variables_templates/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->variablesTemplatesRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->variablesTemplatesRepository->list($request->all(), []);

        return response()->json($data);
    }

    function edit(String $id)
    {

        return Inertia::render("Configuration/variables_templates/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->variablesTemplatesRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->variablesTemplatesRepository->find($id);
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
        $data = $this->variablesTemplatesRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'departament',
                'city',
                'id',
                'gdDependency'
            ]);
        }

        return $this->variablesTemplatesRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.variables_templates.form');
    }
}
