<?php

namespace App\Repositories;

use App\Models\Indice;
use App\Models\RetencionIndice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

    class RetencionIndiceRepository extends BaseRepository
    {
        public function __construct(RetencionIndice $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if(!empty($request['retencion_id'])) {
                    $query->where('retencion_id',$request['retencion_id']);
                    }
                    if(!empty($request['indice_id'])) {
                        $query->where('indice_id',$request['indice_id']);
                    }
                    if(!empty($request['obligatorio'])) {
                        $query->where('obligatorio',$request['obligatorio']);
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

    }