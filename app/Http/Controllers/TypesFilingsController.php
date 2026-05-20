<?php

namespace App\Http\Controllers;

use App\Repositories\TypeFillingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TypesFilingsController extends Controller
{
    //
    public function __construct(private TypeFillingsRepository $typeFillingsRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/types_filings/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/types_filings/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->typeFillingsRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->typeFillingsRepository->list($request->all());
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/types_filings/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->typeFillingsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->typeFillingsRepository->find($id);
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
        $data = $this->typeFillingsRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'id',
            ]);
        }

        return $this->typeFillingsRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.types_of_filings.form');
    }
}
