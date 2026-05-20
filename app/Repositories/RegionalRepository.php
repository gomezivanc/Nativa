<?php

namespace App\Repositories;

use App\Models\Regional;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RegionalRepository extends BaseRepository{

    public function __construct(Regional $modelo){
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
                if (!empty($request['sigla'])) {
                    $query->where('sigla','like', '%'.$request['sigla'].'%');
                }
                if (!empty($request['country_id'])) {
                    $query->where('country_id','like', '%'.$request['country_id'].'%');
                }
                if (!empty($request['departament_id'])) {
                    $query->where('departament_id','like', '%'.$request['departament_id'].'%');
                }
                if (!empty($request['city_id'])) {
                    $query->where('city_id','like', '%'.$request['city_id'].'%');
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
}