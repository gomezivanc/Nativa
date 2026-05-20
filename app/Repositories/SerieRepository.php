<?php

namespace App\Repositories;

use App\Models\Serie;
use App\Models\Retencion;
use App\Models\RetencionTipoDocumental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SerieRepository extends BaseRepository{

    public function __construct(Serie $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name','like', '%'.$request['name'].'%');
                }                
                if (!empty($request['code'])) {
                    $query->where('code','like', '%'.$request['code'].'%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at','>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at','<=', $request['created_at_end']);
                }
            });

        if(!empty($request['active'])) {
            if($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }
    
    public function storeSerie($data)
    {
        DB::beginTransaction();
        
        try {

            $retencion = null;
            if (isset($data['retencion']) && $data['retencion']) {

                $retencion = Retencion::create([
                    'archivo_gestion' => $data['archivo_gestion'] ?? null,
                    'archivo_central' => $data['archivo_central'] ?? null,
                    'papel' => $data['papel'] ?? false,
                    'electronico' => $data['electronico'] ?? false,
                    'eliminacion' => $data['eliminacion'] ?? false,
                    'conservacion_total' => $data['conservacion_total'] ?? false,
                    'seleccion' => $data['seleccion'] ?? false,
                    'digitalizacion_micro' => $data['digitalizacion_micro'] ?? false,
                    'procedimiento' => $data['procedimiento'] ?? null
                ]);

                if (!empty($data['tipos_documentales'])) {

                $retencionId = $retencion->id;
                    // eliminar anteriores
                    RetencionTipoDocumental::where('retencion_id', $retencionId)->delete();

                    // insertar nuevos
                    $insertData = collect($data['tipos_documentales'])->map(function ($tipoId) use ($retencionId) {
                        return [
                            'retencion_id' => $retencionId,
                            'tipo_documental_id' => $tipoId,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    })->toArray();

                    RetencionTipoDocumental::insert($insertData);
                }
            }
            
            $serie = Serie::create([
                'dependency_id' => $data['dependency_id'],
                'code' => $data['code'],
                'name' => $data['name'],
                'retencion_id' => $retencion->id ?? null
            ]);

            DB::commit();

            return $serie;

        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;

        }
    }

    public function updateSerie($id, $data)
    {
        DB::beginTransaction();

        try {

            $serie = Serie::findOrFail($id);

            if (!empty($data['retencion'])) {

                if ($serie->retencion_id) {

                    Retencion::where('id', $serie->retencion_id)->update([
                        'archivo_gestion' => $data['archivo_gestion'] ?? null,
                        'archivo_central' => $data['archivo_central'] ?? null,
                        'papel' => $data['papel'] ?? false,
                        'electronico' => $data['electronico'] ?? false,
                        'eliminacion' => $data['eliminacion'] ?? false,
                        'conservacion_total' => $data['conservacion_total'] ?? false,
                        'seleccion' => $data['seleccion'] ?? false,
                        'digitalizacion_micro' => $data['digitalizacion_micro'] ?? false,
                        'procedimiento' => $data['procedimiento'] ?? null
                    ]);

                } else {
                    $retencion = Retencion::create([
                        'archivo_gestion' => $data['archivo_gestion'] ?? null,
                        'archivo_central' => $data['archivo_central'] ?? null,
                        'papel' => $data['papel'] ?? false,
                        'electronico' => $data['electronico'] ?? false,
                        'eliminacion' => $data['eliminacion'] ?? false,
                        'conservacion_total' => $data['conservacion_total'] ?? false,
                        'seleccion' => $data['seleccion'] ?? false,
                        'digitalizacion_micro' => $data['digitalizacion_micro'] ?? false,
                        'procedimiento' => $data['procedimiento'] ?? null
                    ]);

                    $serie->retencion_id = $retencion->id;
                }

                if (!empty($data['tipos_documentales'])) {

                    $retencionId = $serie->retencion_id;
                    // eliminar anteriores
                    RetencionTipoDocumental::where('retencion_id', $retencionId)->delete();

                    // insertar nuevos
                    $insertData = collect($data['tipos_documentales'])->map(function ($tipoId) use ($retencionId) {
                        return [
                            'retencion_id' => $retencionId,
                            'tipo_documental_id' => $tipoId,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    })->toArray();

                    RetencionTipoDocumental::insert($insertData);
                }

            } else {
                if ($serie->retencion_id) {
                    Retencion::where('id', $serie->retencion_id)->delete();
                    $serie->retencion_id = null;
                }
            }

            $serie->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'retencion_id' => $serie->retencion_id
            ]);

            DB::commit();

            return $serie;

        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }
    }

    public function getWithRetencion($id)
    {
        return Serie::with('retencion')->find($id);
    }
}