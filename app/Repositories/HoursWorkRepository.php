<?php

namespace App\Repositories;

use App\Models\HoursWork;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class HoursWorkRepository extends BaseRepository{

    public function __construct(HoursWork $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['init_work_hour'])) {
                    $query->orWhere('init_work_hour',$request['init_work_hour']);
                }
                if (!empty($request['end_work_hour'])) {
                    $query->orWhere('end_work_hour',$request['end_work_hour']);
                }
                if (!empty($request['day_of_week_init'])) {
                    $query->orWhere('day_of_week_init',$request['day_of_week_init']);
                }
                if (!empty($request['day_of_week_end'])) {
                    $query->orWhere('day_of_week_end',$request['day_of_week_end']);
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