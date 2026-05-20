<?php

namespace App\Http\Controllers;

use App\Repositories\ConfMaskTrdRepository;
use App\Repositories\ConfProviderSendRepository;
use App\Repositories\ConfServicesProviderRepository;
use App\Repositories\DependencyHistoricRepository;
use App\Repositories\SubserieRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\SerieRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GDDependencyController extends Controller
{
    public function __construct(private GDDependencyRepository $gddependencyRepository,private ExpFilesTypeDocRepository $expFilesTypeDocRepository, private DependencyHistoricRepository $dependencyHistoricRepository, private TrdRepository $trdRepository, private SubserieRepository $subserieRepository, private SerieRepository $serieRepository, private ConfMaskTrdRepository $confMaskTrdRepository, private ConfProviderSendRepository $confProviderSendRepository, private ConfServicesProviderRepository $confServicesProviderRepository)
    {
    }

    function index(Request $request) {
        $dependencies = $this->gddependencyRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        return Inertia::render("document_gestion/dependency/Index",[
            'dependencies' => $dependencies,
            'tipo' => $typeDocs
        ]);
    }

    function create(Request $request) {
        $dependencies = $this->gddependencyRepository->all();

        return Inertia::render("document_gestion/dependency/Create", [
            'dependencies' => $dependencies
        ]);
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;

            $request->validate([
                'code' => 'required|string',
                'name' => 'required|string|unique:g_d_dependencies,name'
            ],[
                'name.unique' => 'El Nombre registrado ya existe',
            ]);
        }
        $data = $this->gddependencyRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function versioning(String $id) {
        $depen = $this->gddependencyRepository->find($id);
        $dependency = $this->gddependencyRepository->getModel()->whereHas('historic')->with(['gdDependency','regional'])->where('code',$depen->code)->onlyTrashed()->first();
        $historics = null;
        if($dependency){
            $historics = $dependency->historic;
        }
        // if(!$historics) {
        //     return redirect()->to('/documental-gestion/dependencies');
        // }
        return Inertia::render('document_gestion/dependency/Versioning',compact('historics','dependency'));
    }

    function list(Request $request) {
        $data = $this->gddependencyRepository->list($request->all(),['regional','gdDependency','gdDependency']);

        foreach ($data as $key => $value) {
            $value->trd_active = $value->current_version ? __('auth.yes_not.yes') : __('auth.yes_not.no');
        }
        return response()->json($data);
    }

    function edit(String $id) {
        $dependencies = $this->gddependencyRepository->all();
        return Inertia::render("document_gestion/dependency/Create",compact('id','dependencies'));
    }

    function show(String $id) {
        $object = $this->gddependencyRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->gddependencyRepository->find($id);
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
        $data = $this->gddependencyRepository->list(array_merge($filters, ['typeData' => 'todos']), hidden: ['created_at','updated_at','deleted_at','creado_por_id',
        'departament','city','id','gdDependency']);
        foreach ($data as $value) {
            $value->g_d_parent_id = $value->gdDependency?->name;
            $value->regional = $value->regional->name;
        }
        return $this->gddependencyRepository->export($type,$data->toArray(),'Excel.Export.generalExport','documental_gestion.dependency.form');
    }

    function exportTrd(Request $request) {
        return $this->gddependencyRepository->exportTrd($request);
    }

    public function detail(String $id)
    {
        $dependency = $this->gddependencyRepository->find($id, [
            'gdDependency',
            'regional',

            // SERIES
            'series.retencion',
            'series.retencion.tiposDocumentales',
            'series.retencion.indices.indice',

            // SUBSERIES (dentro de series)
            'series.subseries.retencion',
            'series.subseries.retencion.tiposDocumentales',
            'series.subseries.retencion.indices.indice',
        ]);

        return Inertia::render('document_gestion/dependency/Detail',compact('dependency'));
    }

    function updateHistoric(Request $request) {
        $this->dependencyHistoricRepository->storeGeneral($request->data);

        return response()->json([
            'success' => true
        ]);
    }

    //funciones Subserie
    function storeSubserie(Request $request, String $serieId) {
        $data = $request->all();
        $data['serie_id'] = $serieId;

        $subserie = $this->subserieRepository->storeSubserie($data);

        return response()->json([
            'success' => true,
            'message' => 'Subserie creada correctamente',
            'data' => $subserie
        ]);
    }
    
    public function updateSubserie(Request $request, $id)
    {
        $this->subserieRepository->updateSubserie($id, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Subserie actualizada correctamente'
        ]);
    }

    public function destroySubserie($id)
    {
        try {
            $this->subserieRepository->delete($id);

            return response()->json([
                'message' => 'Subserie deshabilitada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al deshabilitar la subserie'
            ], 500);
        }
    }

    //funciones series
    public function storeSerie(Request $request, String $dependencyId)
    {
        $data = $request->all();
        $data['dependency_id'] = $dependencyId;

        $serie = $this->serieRepository->storeSerie($data);

        return response()->json([
            'success' => true,
            'message' => 'Serie creada correctamente',
            'data' => $serie
        ]);
    }

    public function updateSerie(Request $request, $id)
    {
        $this->serieRepository->updateSerie($id, $request->all());

        return response()->json([
            'message' => 'Serie actualizada correctamente'
        ]);
    }

    public function destroySerie($id)
    {
        try {
            $this->serieRepository->delete($id);

            return response()->json([
                'message' => 'Serie deshabilitada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al deshabilitar la serie'
            ], 500);
        }
    }

    public function getTypeDocs()
    {
        try {
            $typeDocs = $this->expFilesTypeDocRepository->all();

            return response()->json($typeDocs, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los tipos documentales',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeTypeDoc(Request $request)
    {
        $tipo = $this->expFilesTypeDocRepository->storeGeneral($request->all());
        return response()->json($tipo);
    }

    public function getTypeDocsByDependency(String $dependencyId)
    {
        try {
            $dependency = $this->gddependencyRepository->find($dependencyId, [
                'series.retencion.tiposDocumentales',
                'series.retencion.indices',
                'series.subseries.retencion.tiposDocumentales',
                'series.subseries.retencion.indices'
            ]);

            if (!$dependency) {
                return response()->json([
                    'message' => 'Dependencia no encontrada'
                ], 404);
            }

            $typeDocsCollection = collect();

            // Agregar tipos documentales de series
            if ($dependency->series) {
                foreach ($dependency->series as $serie) {
                    if ($serie->retencion && $serie->retencion->tiposDocumentales) {
                        $typeDocsCollection = $typeDocsCollection->merge($serie->retencion->tiposDocumentales);
                    }
                    
                    // Agregar tipos documentales de subseries
                    if ($serie->subseries) {
                        foreach ($serie->subseries as $subserie) {
                            if ($subserie->retencion && $subserie->retencion->tiposDocumentales) {
                                $typeDocsCollection = $typeDocsCollection->merge($subserie->retencion->tiposDocumentales);
                            }
                        }
                    }
                }
            }

            // Eliminar duplicados usando el ID como identificador
            $uniqueTypeDocs = $typeDocsCollection->unique('id')->values();

            return response()->json($uniqueTypeDocs, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los tipos documentales de la dependencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
