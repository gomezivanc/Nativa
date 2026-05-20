<?php

namespace App\Repositories;

use App\Models\Indice;
use App\Models\Serie;
use App\Models\Subserie;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

    class IndiceRepository extends BaseRepository
    {
        public function __construct(Indice $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if (!empty($request['search'])) {
                        $query->where('nombre', 'like', '%' . $request['nombre'] . '%');
                    }                    
                    if (!empty($request['codigo'])) {
                        $query->where('codigo', 'like', '%' . $request['codigo'] . '%');
                    }
                    if (!empty($request['tipo_dato'])) {
                        $query->where('tipo_dato', 'like', '%' . $request['tipo_dato'] . '%');
                    }
                    
                });

            if(!empty($request['active'])) {
                if($request['active'] == "false") {
                    $data->onlyTrashed();
                }
            }
            if (empty($request['typeData'])) {
                $data = $data->paginate($request['perPage'] ?? 10);
            } else {
                $data = $data->get();
            }

            return $data;
        }

    public function getByRetencion($serie_id, $subserie_id = null)
    {
        if ($subserie_id) {
            $subserie = Subserie::with('retencion')->find($subserie_id);
            $retencion = $subserie?->retencion;
        } else {
            $serie = Serie::with('retencion')->find($serie_id);
            $retencion = $serie?->retencion;
        }

        if (!$retencion) {
            return collect([]);
        }

        // Traer índices
        return $retencion->indices()->with('indice')->orderBy('orden')->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'orden' => $item->orden,
                'obligatorio' => $item->obligatorio,
                'es_nombre' => $item->es_nombre,
                'indice' => [
                    'id' => $item->indice->id,
                    'codigo' => $item->indice->codigo,
                    'nombre' => $item->indice->nombre,
                    'tipo_dato' => $item->indice->tipo_dato,
                    'opciones' => $item->indice->opciones,
                ]
            ];
        });
    }

}