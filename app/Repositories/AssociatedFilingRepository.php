<?php

    namespace App\Repositories;

    use App\Models\AssociatedFiling;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

    class AssociatedFilingRepository extends BaseRepository
    {
        public function __construct(AssociatedFiling $modelo)
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
        public function insertAssociatedFilings(int $principalId,array $associatedFilings)
        {
            try {
                $this->model->where('father_filing_id', $principalId)->delete();
                foreach ($associatedFilings as $key => $id) {
                    $item = [
                        'father_filing_id' => $principalId,
                        'filing_id' => $id,
                        'creado_por_id' => Auth::user()->id
                    ];
                    $this->model->create($item);
                    //dd($associatedFilings);
                }             
            } catch (\Throwable $th) {
                dd( $th);
            }
        }
    }