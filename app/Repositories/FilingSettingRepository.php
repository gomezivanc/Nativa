<?php

namespace App\Repositories;

use App\Models\Filing;
use App\Models\FilingSetting;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class FilingSettingRepository extends BaseRepository
{

    public function __construct(FilingSetting $modelo)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name', 'like', '%' . $request['name'] . '%');
                }
                if (!empty($request['code'])) {
                    $query->where('code', 'like', '%' . $request['code'] . '%');
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
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }
    public function softDeletePreviousRecords()
    {
        return FilingSetting::whereNull('deleted_at')  // Solo los registros no eliminados
            ->delete();  // Soft delete: establece `deleted_at` a la fecha actual
    }
    public function hasExistingFilings()
    {
        // Verificar si hay radicados que no estén eliminados (soft delete)
        return Filing::whereNull('deleted_at')->exists();
    }
}
