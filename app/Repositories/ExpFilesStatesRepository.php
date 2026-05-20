<?php

namespace App\Repositories;

use App\Models\ExpFiles;

class ExpFilesStatesRepository extends BaseRepository{

    public function __construct(ExpFiles $modelo){
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

                if (!empty($request['onlyExp'])) {
                    $query->whereNull('sub_exp_id');
                }
            });
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }

    function generateFileNumber() {
        $año = date('Y'); // Año actual
        $numeroAleatorio = mt_rand(1000000, 9999999); // Número aleatorio de 7 dígitos
        $numeroExpediente = $año . $numeroAleatorio; // Concatenar año y número aleatorio
        return $numeroExpediente;
    }
}