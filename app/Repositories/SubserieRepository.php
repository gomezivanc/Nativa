<?php

namespace App\Repositories;

use App\Models\Subserie;
use App\Models\Retencion;
use App\Models\RetencionTipoDocumental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SubserieRepository extends BaseRepository{

    public function __construct(Subserie $modelo){
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
    
    
    public function storeSubserie($data)
    {
        DB::beginTransaction();

        try {
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
        
            $subserie = Subserie::create([
                'serie_id' => $data['serie_id'],
                'code' => $data['code'],
                'name' => $data['name'],
                'retencion_id' => $retencion->id
            ]);

            DB::commit();

            return $subserie;

        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;

        }
    }

    public function updateSubserie($id, $data)
    {
        DB::beginTransaction();

        try {

            $subserie = Subserie::findOrFail($id);
            $retencionId = null;

            if (!empty($data['retencion'])) {

                if ($subserie->retencion_id) {

                    Retencion::where('id', $subserie->retencion_id)->update([
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

                    $retencionId = $subserie->retencion_id;

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

                    $retencionId = $retencion->id;
                    $subserie->retencion_id = $retencionId;
                }

                if (!empty($data['tipos_documentales'])) {

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

                if ($subserie->retencion_id) {

                    RetencionTipoDocumental::where('retencion_id', $subserie->retencion_id)->delete();

                    Retencion::where('id', $subserie->retencion_id)->delete();
                    $subserie->retencion_id = null;
                }
            }

            $subserie->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'retencion_id' => $subserie->retencion_id
            ]);

            DB::commit();

            return $subserie;

        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }
    }

    public function getWithRetencion($id)
    {
        return Subserie::with('retencion')->find($id);
    }
}