<?php

namespace App\Repositories;

use App\Models\CancellationRequestFiling;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class CancellationRequestFilingRepository extends BaseRepository
{
    public function __construct(CancellationRequestFiling $modelo)
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
    public function updateStateCancelation($data)
    {
        try {
            //code...
            $cancellation_request_filings = $this->find($data->id_request);
            $cancellation_request_filings->observation_response = $data->observation_response;
            $cancellation_request_filings->request_status = $data->cancelation_status;
            $cancellation_request_filings->respuesto_por_id = Auth::user()->id;
            $cancellation_request_filings->save();
            return $cancellation_request_filings->id;           
        } catch (\Throwable $th) {
            dd($th);
        }

    }
}