<?php

namespace App\Repositories;

use App\Models\DistributionUnit;

class DistributionUnitRepository extends BaseRepository
{
    public function __construct(DistributionUnit $model)
    {
        parent::__construct($model);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = [])
    {
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['searchQuery'])) {
                    $query->orWhere('name', 'like', '%' . $request['searchQuery'] . '%')
                        ->orWhere('observation', 'like', '%' . $request['searchQuery'] . '%');
                }
            });

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        } else {
            $data->withTrashed();
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }

    public function listFull()
    {
        return $this->model->get();
    }

    public function listOfficial()
    {
        $centralUnit = $this->model->where('central_bool', 1)->first();

        if (!$centralUnit) {
            return $this->model->get();
        }

        return $this->model
            ->where('id_dependency', '!=', $centralUnit->id_dependency)
            ->get();
    }

    public function getIdByDependency($dependencyId)
    {
        return $this->model
            ->where('id_dependency', $dependencyId)
            ->value('id');
    }

    public function getIdByDependencyUniti($unitid)
    {
        return $this->model
            ->where('id', $unitid)
            ->value('id_dependency');
    }
}
