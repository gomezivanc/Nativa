<?php

namespace App\Repositories;

use App\Models\ReceivedEmail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReceivedEmailRepository extends BaseRepository
{
    public function __construct(ReceivedEmail $modelo)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['sender'])) {
                    $query->orWhere('sender', 'like', '%' . $request['sender'] . '%');
                }
                if (!empty($request['subject'])) {
                    $query->orWhere('subject', 'like', '%' . $request['subject'] . '%');
                }
                if (!empty($request['mail_config_id'])) {
                    $query->orWhere('mail_config_id', $request['mail_config_id']);
                }
                if (!empty($request['received_at_init'])) {
                    $query->orWhere('received_at', '>=', $request['received_at_init']);
                }
                if (!empty($request['received_at_end'])) {
                    $query->orWhere('received_at', '<=', $request['received_at_end']);
                }
            });

        if (!empty($request['per_page'])) {
            return $data->paginate($request['per_page']);
        }
        if (!empty($request['page'])) {
            return $data->paginate(15, ['*'], 'page', $request['page']);
        }
        return $data->paginate(15);
    }

    public function getByDistributionUnit($distributionUnitId)
    {
        return $this->model->where('mail_config_id', $distributionUnitId)
            ->where('state', 1)
            ->with('mailConfig')->get();
    }

    public function getByDistributionUnitQuery($distributionUnitId)
    {
        return $this->model->where('mail_config_id', $distributionUnitId)
            ->where('state', 1)
            ->with('mailConfig');
    }
}
