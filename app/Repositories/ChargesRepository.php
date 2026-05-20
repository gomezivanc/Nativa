<?php

    namespace App\Repositories;

    use App\Models\Charge;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;

    class ChargesRepository extends BaseRepository
    {
        public function __construct(Charge $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if (!empty($request['cargo'])) {
                        $query->where('cargo', 'like', '%' . $request['cargo'] . '%');
                    }
                    if (!empty($request['id_regional'])) {
                        $query->where('id_regional', $request['id_regional']);
                    }
                    if (!empty($request['id_dependency'])) {
                        $query->where('id_dependency', $request['id_dependency']);
                    }
                    if (!empty($request['observation'])) {
                        $query->where('observation', 'like', '%' . $request['observation'] . '%');
                    }
                    if(!empty($request['id_dependency'])) {
                        $query->where('id_dependency', $request['id_dependency']);
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