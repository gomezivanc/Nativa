<?php

namespace App\Http\Controllers;

use App\Repositories\FilingSettingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FilingSettingController extends Controller
{
    //
    public function __construct(private FilingSettingRepository $filingSettingRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/filling_setting/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/filling_setting/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        // Verificar si ya existen radicados
        // if ($this->filingSettingRepository->hasExistingFilings()) {
        //     return response()->json(['error' => 'No se puede cambiar la configuración porque ya hay radicados creados.'], 400);
        // }
        $this->filingSettingRepository->softDeletePreviousRecords();
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->filingSettingRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->filingSettingRepository->list($request->all(), ['filingStructure']);
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/filling_setting/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->filingSettingRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->filingSettingRepository->find($id);
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
        $data = $this->filingSettingRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'id',
            ]);
        }

        return $this->filingSettingRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.types_of_filings.form');
    }
}
