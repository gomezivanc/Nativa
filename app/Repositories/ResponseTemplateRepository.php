<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\ResponseTemplate;
use Carbon\Carbon;


class ResponseTemplateRepository extends BaseRepository
{
    public function __construct(ResponseTemplate $modelo)
    {
        parent::__construct($modelo);
    }

    public function list( $request = [], $with = [], $withCount = [], $select = ['*'] ): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {

                if (!empty($request['third_id'])) {
                    $query->where('third_id', $request['third_id']);
                }
                if (!empty($request['id'])) {
                    $query->where('id', $request['id']);
                }

                if (!empty($request['state'])) {

                    if (is_array($request['state'])) {
                        $query->whereIn('state', $request['state']);
                    } else {
                        $query->where('state', $request['state']);
                    }

                }
                if (!empty($request['payroll_id'])) {
                    $query->where('payroll_id', $request['payroll_id']);
                }

                if (!empty($request['created_at_init'])) {
                    $query->where('transfer_date', '>=', $request['created_at_init']);
                }

                if (!empty($request['created_at_end'])) {
                    $query->where('transfer_date', '<=', $request['created_at_end']);
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

    public function mailtransfer($id)
    {   
        try {
            $temple = $this->find($id);
            $temple->state = 5;
            $temple->transfer_date = Carbon::now();
            $temple->save();
            return $temple;
        } catch (\Throwable $th) {
            dd($th);
        }
    }

}
