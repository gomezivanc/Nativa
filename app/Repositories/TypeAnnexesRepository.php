<?php

namespace App\Repositories;

use App\Models\Agreements;
use App\Models\ConfMaskTrd;
use App\Models\ConfTrd;
use App\Models\DocumentCategories;
use App\Models\ExternalRepresents;
use App\Models\TypeAnnexes;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class TypeAnnexesRepository extends BaseRepository{

    public function __construct(TypeAnnexes $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
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