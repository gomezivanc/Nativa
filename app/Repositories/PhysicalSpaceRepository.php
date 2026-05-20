<?php

namespace App\Repositories;

use App\Models\PhysicalSpace;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PhysicalSpaceRepository extends BaseRepository
{
    public function __construct(PhysicalSpace $modelo)
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
                    $query->where('name', 'like', '%' . $request['name'] . '%');
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
                if (!empty($request['ciu_id'])) {
                    $query->where('ciu_id', $request['ciu_id']);
                }
                if (!empty($request['dep_id'])) {
                    $query->where('dep_id', $request['dep_id']);
                }
                if (!empty($request['type_body_id'])) {
                    $query->where('type_body_id', $request['type_body_id']);
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
            });

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        $data->groupBy($groupBy);

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }

    function select($request,$groupBy = []) {
        return $this->list(request: $request,select: ['name'], groupBy: $groupBy);
    }
}
