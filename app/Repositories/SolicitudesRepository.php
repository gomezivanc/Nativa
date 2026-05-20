<?php

    namespace App\Repositories;

    use App\Models\Solicitudes;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;

    class SolicitudesRepository extends BaseRepository
    {
        public function __construct(Solicitudes $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if (!empty($request['id'])) {
                        $query->where('id', 'like', '%' . $request['id'] . '%');
                    }
                    if (!empty($request['id_filing'])) {
                        $query->where('id_filing', $request['id_filing']);
                    }
                    if (!empty($request['tipo'])) {
                        $query->where('tipo', $request['tipo']);
                    }
                    if (!empty($request['estado'])) {
                        $query->where('estado', $request['estado']);
                    }
                    if (!empty($request['observation'])) {
                        $query->where('observation', 'like', '%' . $request['observation'] . '%');
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

    public function updateEstado($id, $estado = 1)
    {   
        $registro = $this->model->find($id);

        if (!$registro) {
            return null;
        }

        $registro->update([
            'estado' => $estado
        ]);

        return $registro;
    }

    }