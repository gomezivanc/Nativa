<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\signatory;


class SignatoriesRepository extends BaseRepository
{
    public function __construct(signatory $modelo)
    {
        parent::__construct($modelo);
    }

    public function list( $request = [], $with = [], $withCount = [], $select = ['*'] ): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {

                if (!empty($request['user_id'])) {
                    $query->where('user_id', $request['user_id']);
                }

                if (!empty($request['response_id'])) {
                    $query->where('response_id', $request['response_id']);
                }

                if (!empty($request['created_at_init'])) {
                    $query->where('created_at', '>=', $request['created_at_init']);
                }

                if (!empty($request['created_at_end'])) {
                    $query->where('created_at', '<=', $request['created_at_end']);
                }

            });

        return $data;
    }


}
