<?php

namespace App\Repositories;

use App\Models\Agreements;
use App\Models\ManualUsuarios;
use Illuminate\Support\Facades\Hash;

class ManualUsuarioRepository extends BaseRepository{

    public function __construct(ManualUsuarios $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []){
        $data = $this->model->select($select)
            ->with($with)
            ->with($with)
            ->where(function ($query) use($request) {
                if (!empty($request['nombre'])) {
                    $query->where('nombre', 'like', '%'. $request['nombre']. '%');
                }
                if (!empty($request['archivo_nombre'])) {
                    $query->where('archivo_nombre', 'like', '%'. $request['archivo_nombre']. '%');
                }
            });

        if (!empty($request['isactive'])) {
            if($request['isactive'] == "false") {
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