<?php

namespace App\Repositories;

use App\Models\PhysicalSpacesUbications;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PhysicalSpacesUbicationsRepository extends BaseRepository
{
    public function __construct(PhysicalSpacesUbications $modelo)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $groupBy = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->whereHas('building', function ($q) use($request) {
                        $q->where('name', 'like', '%' . $request['name'] . '%');
                    });
                }
                if (!empty($request['floor'])) {
                    $query->where('floor', 'like', '%' . $request['floor'] . '%');
                }
                if (!empty($request['file_area'])) {
                    $query->where('file_area', 'like', '%' . $request['file_area'] . '%');
                }
                if (!empty($request['box'])) {
                    $query->where('box', 'like', '%' . $request['box'] . '%');
                }
                if (!empty($request['type_body_id'])) {
                    $query->whereHas('typeBody', function ($q) use($request) {
                        $q->where('type_body_id', $request['type_body_id']);
                    });
                }

                if (!empty($request['physical_space_name'])) {
                    $query->whereHas('building', function ($q) use($request) {
                        $q->where('name', $request['physical_space_name']);
                    });
                }
                if (!empty($request['physical_space_floor'])) {
                    $query->where('floor', $request['physical_space_floor']);
                }

                if (!empty($request['created_at_init'])) {
                    $query->where('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->where('created_at', '<=', $request['created_at_end']);
                }
            });

        if(!empty($groupBy)) {
            $data->groupBy($groupBy);
        }

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }
}
