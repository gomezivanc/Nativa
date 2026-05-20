<?php

namespace App\Http\Controllers;

use App\Repositories\DependencyHistoricRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DependencyHistoricController extends Controller
{
    public function __construct(private DependencyHistoricRepository $dependencyHistoricRepository, private GDDependencyRepository $gDDependencyRepository , private TrdRepository $trdRepository,)
    {
    }

    function index(Request $request) {
        return Inertia::render("document_gestion/TrdVersioning/Index");
    }

    function create(Request $request) {
        return Inertia::render("document_gestion/TrdVersioning/Create");
    }

    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->dependencyHistoricRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->dependencyHistoricRepository->list($request->all());
        $data = collect($data);
        $filters = [
            'dependencies' => $data->pluck('dependency')->unique('id')->values(),
            'serie' => $data->pluck('serie')->unique('name')->values(),
            'subseries' => $data->pluck('subserie')->unique('name')->values(),
            'names' => $data->unique('name')->values(),
        ];
        return response()->json([
            'data' => $data,
            'filters' => $filters
        ]);
    }

    public function seriesSelect(Request $request)
    {
        $serie = $this->trdRepository->listSerie([
            'by_dependency' => $request->by_dependency,
            'typeData' => 'get'
        ],[
            'retencion.tiposDocumentales'
        ]);

        return ['serie' => $serie];
    }

    public function SubseriesSelect(Request $request)
    {
        $subSerie = $this->trdRepository->listSubserie([
            'by_serie' => $request->serie['id'],
            'typeData' => 'get'
        ], [
            'retencion.tiposDocumentales'
        ]);
        return ['subSerie' => $subSerie];
    }

    function edit(String $id) {
        return Inertia::render("document_gestion/TrdVersioning/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->dependencyHistoricRepository->find($id);
        return response()->json($object);
    }

    function show_view(String $id) {
        $historic = $this->dependencyHistoricRepository->getModel()->find($id);
        $dependency = $historic->dependency()->with(['gdDependency','regional'])->first();
        return Inertia::render('document_gestion/dependency/Detail',compact('historic','dependency'));
    }

    function activeH(Request $request) {
        $data = $this->dependencyHistoricRepository->getModel()->find($request->id);
        $this->dependencyHistoricRepository->getModel()->where('gd_dependency_id',$data->gd_dependency_id)->update([
            'is_approval' => 0
        ]);
        $data = $this->dependencyHistoricRepository->storeGeneral($request->all());
        $dependency = $this->gDDependencyRepository->find($data->gd_dependency_id);
        $dependency->delete();
        $dependencynew = $this->gDDependencyRepository->storeGeneral(Arr::except($dependency->toArray(), ['id','deleted_at']));
        $dependencynew->current_version_id = $data->id;
        $dependencynew->save();

        return response()->json([]);
    }

    function destroy(String $id) {
        $object = $this->dependencyHistoricRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $data = $this->dependencyHistoricRepository->list($request->all());

        $data2 = [];
        foreach ($data as $key => $value) {
            $data2[$key]['created_at'] = $value->created_at->format('d/m/Y H:i:s');
            $data2[$key]['dependency'] = $value->dependency->code . ' ' . $value->dependency->name;
            $data2[$key]['serie'] = $value->serie->name;
            $data2[$key]['Subserie'] = $value->subserie->name;
            $data2[$key]['type_doc'] = $value->name;
        }
        return $this->dependencyHistoricRepository->export($type,$data2,'Excel.Export.generalExport','documental_gestion.trd_versioning.table');
    }
}
