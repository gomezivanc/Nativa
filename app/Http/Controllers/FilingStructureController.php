<?php

namespace App\Http\Controllers;

use App\Repositories\FilingStructureRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FilingStructureController extends Controller
{
    //
    public function __construct(private FilingStructureRepository $filingStructureRepository) {}

    // function index(Request $request)
    // {
    //     return Inertia::render("Configuration/filling_setting/Index", []);
    // }

    // function create(Request $request)
    // {
    //     return Inertia::render("Configuration/filling_setting/Create", []);
    // }

    // // store - update
    // function store(Request $request)
    // {
    //     if (empty($request['id'])) {
    //         $request['creado_por_id'] = Auth::user()->id;
    //     }
    //     $data = $this->filingStructureRepository->storeGeneral($request->all());
    //     return response()->json($data);
    // }

    function list(Request $request)
    {
        $data = $this->filingStructureRepository->list($request->all());
        return response()->json($data);
    }

    // function edit(String $id)
    // {
    //     return Inertia::render("Configuration/filling_setting/Create", compact('id'));
    // }

    // function show(String $id)
    // {
    //     $object = $this->filingStructureRepository->find($id);
    //     return response()->json($object);
    // }

    // function destroy(String $id)
    // {
    //     $object = $this->filingStructureRepository->find($id);
    //     if ($object->trashed()) {
    //         $object->restore();
    //     } else {
    //         $object->delete();
    //     }
    //     return response()->json($object);
    // }

    // function export(Request $request)
    // {
    //     $type = $request->type;
    //     $data = $this->filingStructureRepository->all(hidden: [
    //         'created_at',
    //         'updated_at',
    //         'deleted_at',
    //         'creado_por_id',
    //         'id',
    //     ]);

    //     return $this->filingStructureRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.types_of_filings.form');
    // }
}
