<?php

    namespace App\Repositories;

    use App\Models\Thirds;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;

    class ThirdsRepository extends BaseRepository
    {
        public function __construct(Thirds $modelo)
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

        public function findByDocument($document)
        {
            return $this->model->where('document_nit_sender', $document) ->first();
        }

        public function searchActiveThir(string $search, int $limit = 15)
        {
            return Thirds::query()
                ->where(function($query) use ($search) {
                    $query->orWhere('document_nit_sender', 'LIKE', "%{$search}%");
                    $query->orWhere('name_social_reason_sender', 'LIKE', "%{$search}%");
                })
                ->select(['*'])
                ->limit($limit)
                ->get();
        }
    }