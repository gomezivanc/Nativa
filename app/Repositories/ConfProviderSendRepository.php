<?php

namespace App\Repositories;

use App\Models\ConfProviderSend;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ConfProviderSendRepository extends BaseRepository{

    public function __construct(ConfProviderSend $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->orWhere('name', 'like', '%'. $request['name']. '%');
                }
                if (!empty($request['conf_services_provider_id'])) {
                    $query->orWhere('conf_services_provider_id', $request['conf_services_provider_id']);
                }
                if (!empty($request['dep_id'])) {
                    $query->orWhere('dep_id', $request['dep_id']);
                }
                if (!empty($request['ciu_id'])) {
                    $query->orWhere('ciu_id', $request['ciu_id']);
                }
                if (!empty($request['regional_id'])) {
                    $query->orWhere('regional_id', $request['regional_id']);
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