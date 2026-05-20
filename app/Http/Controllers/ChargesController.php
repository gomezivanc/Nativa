<?php

namespace App\Http\Controllers;

use App\Repositories\ChargesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ChargesController extends Controller
{
    public function __construct(private ChargesRepository $chargesRepository) {}

    public function index(Request $request)
    {
        return Inertia::render("Configuration/charges/Index");
    }

    public function create(Request $request)
    {
        return Inertia::render("Configuration/charges/Create");
    }

    function storeUpdate(Request $request)
    {
        $data = $request->validate([
            'id_regional' => 'required|integer|exists:regionals,id',
            'id_dependency' => 'required|integer|exists:g_d_dependencies,id',
            'cargo' => 'required|string|max:100',
            'observation' => 'nullable|string',
        ]);

        if ($request->id) {

            $object = $this->chargesRepository->find($request->id);
            $object->update($data);

        } else {

            $object = $this->chargesRepository->storeGeneral($data);

        }

        return response()->json([
            'success' => true,
            'data' => $object
        ]);
    }

    public function list(Request $request)
    {
        $data = $this->chargesRepository->list($request->all(),['dependency','regional']);

        return response()->json($data);
    }

    public function show(string $id)
    {
        $object = $this->chargesRepository->find($id);

        return response()->json($object);
    }

    public function destroy(string $id)
    {
        $object = $this->chargesRepository->find($id);

        $object->trashed() ? $object->restore() : $object->delete();

        return response()->json([
            'success' => true,
            'message' => $object->trashed() ? 'Cargo restaurado.' : 'Cargo eliminado.',
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->chargesRepository->list(array_merge($filters, ['typeData' => 'todos']), with: ['dependency', 'regional']);
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'id',
            ]);
        }

        return $this->chargesRepository->export(
            $type,
            $data->toArray(),
            'Excel.Export.generalExport',
            'configuration.charges.form'
        );
    }
}
