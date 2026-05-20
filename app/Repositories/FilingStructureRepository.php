<?php

namespace App\Repositories;

use App\Models\FilingStructure;
use App\Models\Regional;
use App\Models\TypesFilings;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class FilingStructureRepository extends BaseRepository{

    public function __construct(FilingStructure $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        //dd($request);
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['filing_structure'])) {
                    $query->where('filing_structure','like', '%'.$request['filing_structure'].'%');
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