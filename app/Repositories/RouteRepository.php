<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RouteRepository extends BaseRepository{

    public function __construct(Menu $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['title'])) {
                    $query->where('title','like', '%'.$request['title'].'%');
                }                
                if (!empty($request['uri'])) {
                    $query->where('uri','like', '%'.$request['uri'].'%');
                }
                if (!empty($request['parent_id'])) {
                    $query->where('parent_id','like', '%'.$request['parent_id'].'%');
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