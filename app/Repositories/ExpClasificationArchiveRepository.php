<?php

namespace App\Repositories;

use App\Models\ExpClasificationArchive;
use App\Models\ExpFiles;
use App\Models\ExpFilesClasification;

class ExpClasificationArchiveRepository extends BaseRepository{

    public function __construct(ExpClasificationArchive $modelo){
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
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }
}