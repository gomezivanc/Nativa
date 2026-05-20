<?php

namespace App\Repositories;
use App\Models\User;

class UserRepository extends BaseRepository{

    public function __construct(User $modelo){
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

        // $data->whereHas('aplicativos',function ($q) {
        //     $q->where('id_aplicativo',tenant()->id);
        // });

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }
}