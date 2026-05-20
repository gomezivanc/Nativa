<?php

    namespace App\Repositories;

    use App\Models\AccumulatedFund;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;

    class AccumulatedFundRepository extends BaseRepository
    {
        public function __construct(AccumulatedFund $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if (!empty($request['number'])) {
                        $query->where('number', 'like', '%' . $request['number'] . '%');
                    }
                    if (!empty($request['word'])) {
                        $query->where('word', 'like', '%' . $request['word'] . '%');
                    }
                    if (!empty($request['subject'])) {
                        $query->where('subject', 'like', '%' . $request['subject'] . '%');
                    }
                    if (!empty($request['dep_id'])) {
                        $query->where('dep_id', $request['dep_id']);
                    }
                    if (!empty($request['ciu_id'])) {
                        $query->where('ciu_id', $request['ciu_id']);
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
    }