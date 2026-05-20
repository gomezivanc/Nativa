<?php

namespace App\Http\Controllers;

use App\Repositories\ProcedureManagementRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProcedureManagementController extends Controller
{
    public function __construct(private ProcedureManagementRepository $procedureManagementRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/procedure_management/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/procedure_management/Create", []);
    }

    // store - update
    public function store(Request $request)
    {
        if ($request->id) {
            $data = $this->procedureManagementRepository->updateWithVersioning($request);
        } else {
            // dd('sapaaa');
            $data = $this->procedureManagementRepository->storeGeneral($request->only(['name', 'response_time']));
        }

        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->procedureManagementRepository->list($request->all(), []);

        return response()->json($data);
    }

    function edit(String $id)
    {

        return Inertia::render("Configuration/procedure_management/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->procedureManagementRepository->find($id);
        // dd('sapa');
        return response()->json($object);
    }

    public function destroy(String $id)
    {
        $object = $this->procedureManagementRepository->find($id);

        if ($object->trashed()) {

            $exists = $this->procedureManagementRepository
                ->existsActiveByName($object->name);

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'same_name'
                ], 422);
            }

            $object->restore();

        } else {
            $object->delete();
        }

        return response()->json([
            'success' => true,
            'data' => $object
        ]);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->procedureManagementRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'response_time',
                'name',
                'id',
            ]);
        }

        return $this->procedureManagementRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.hours_work.form');
    }
}
