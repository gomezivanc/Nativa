<?php

namespace App\Repositories;

use App\Models\Agreements;
use App\Models\ConfTrd;
use App\Models\DocumentCategories;
use App\Models\ExternalRepresents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\GDDependency;
use App\Models\Serie;
use App\Models\Subserie;
use App\Models\Retencion;

class TrdRepository extends BaseRepository{

    public function __construct(ConfTrd $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []){
        $data = $this->model->select($select)
            ->with($with)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['searchQuery'])) {
                    $query->orWhere('nombre', 'like', '%'. $request['searchQuery']. '%');
                }
            });

        if(!empty($request['active'])) {
            if($request['active'] == "false") {
                $data->onlyTrashed();
            }
        } else {
            $data->withTrashed();
        }
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }

    public function listSerie($request = [], $with = [], $select = ['*'])
    {
        $query = Serie::select($select)
            ->with($with);

        if (!empty($request['by_dependency'])) {
            $query->where('dependency_id', $request['by_dependency']);
        }

        return $query->get();
    }

    public function listSubserie($request = [], $with = [], $select = ['*'])
    {
        $query = Subserie::select($select)
            ->with($with);

        if (!empty($request['by_serie'])) {
            $query->where('serie_id', $request['by_serie']);
        }

        return $query->get();
    }

    public function import(array $processedData)
    {
        DB::transaction(function () use ($processedData) {
            GDDependency::query()->update([
                    'deleted_at' => now()
            ]);

            foreach ($processedData as $dependencyData) {


                $dependency = GDDependency::create([
                    'code' => $dependencyData['dependency_code'],
                    'name' => $dependencyData['dependency_name'],
                    'g_d_parent_id' => null,
                    'creado_por_id' => auth()->id(),
                    'regional_id' => 1,
                    // 'current_version_id' => 2,
                ]);

                // 2️ Crear series
                $seriesMap = [];

                foreach ($dependencyData['series'] as $serieData) {

                    $serie = Serie::create([
                        'code' => $serieData['serie'],
                        'name' => $serieData['nombre'],
                        'dependency_id' => $dependency->id,
                    ]);

                    $seriesMap[$serieData['serie']] = $serie;
                }

                // 3️ Crear subseries
                $subseriesMap = [];

                foreach ($dependencyData['subseries'] as $subserieData) {

                    if (!isset($seriesMap[$subserieData['serie']])) {
                        continue; // seguridad
                    }

                    $subserie = Subserie::create([
                        'code' => $subserieData['subserie'],
                        'name' => $subserieData['nombre'],
                        'serie_id' => $seriesMap[$subserieData['serie']]->id,
                    ]);

                    $subseriesMap[
                        $subserieData['serie'] . '-' . $subserieData['subserie']
                    ] = $subserie;
                }

                // 4️ Crear retenciones
                foreach ($dependencyData['retencion'] as $retencionData) {

                    $retencion = Retencion::create([
                        'papel' => $retencionData['papel'],
                        'electronico' => $retencionData['electronico'],
                        'archivo_gestion' => $retencionData['archivoGestion'],
                        'archivo_central' => $retencionData['archivoCentral'],
                        'eliminacion' => $retencionData['eliminacion'],
                        'seleccion' => $retencionData['seleccion'],
                        'conservacion_total' => $retencionData['conservacionTotal'],
                        'digitalizacion_micro' => $retencionData['digitalizacionMicro'],
                        'procedimiento' => $retencionData['procedimiento'],
                    ]);
                    if ($retencionData['nivel'] === 'serie') {

                        if (isset($seriesMap[$retencionData['serie']])) {
                            $seriesMap[$retencionData['serie']]
                                ->update(['retencion_id' => $retencion->id]);
                        }

                    } else {

                        $key = $retencionData['serie'] . '-' . $retencionData['subserie'];

                        if (isset($subseriesMap[$key])) {
                            $subseriesMap[$key]
                                ->update(['retencion_id' => $retencion->id]);
                        }
                    }
                }
            }
        });
    }

    public function findWithStructure($id)
    {
        return GDDependency::with([
            'series.retencion',
            'series.subseries.retencion'
        ])->findOrFail($id);
    }
}
