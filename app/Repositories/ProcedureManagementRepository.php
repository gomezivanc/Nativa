<?php

namespace App\Repositories;

use App\Models\TypeOfProcedure;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProcedureManagementRepository extends BaseRepository{

    public function __construct(TypeOfProcedure $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->withTrashed()
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name','like', '%'.$request['name'].'%');
                }
                if (!empty($request['response_time'])) {
                    $query->where('response_time','like', '%'.$request['response_time'].'%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at','>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at','<=', $request['created_at_end']);
                }
            });

        if(!empty($request['active'])) {
            if($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }

    public function updateWithVersioning($request)
    {
        DB::beginTransaction();

        try {
            $procedure = TypeOfProcedure::findOrFail($request->id);

            if ($procedure->response_time == $request->response_time) {
                DB::commit();
                return [
                    'success' => true,
                    'data' => $procedure
                ];
            }

            $procedure->delete();

            $data = $request->only(['response_time']);

            $new = TypeOfProcedure::create([
                'name' => $procedure->name,
                'response_time' => $data['response_time'],
            ]);

            DB::commit();

            return [
                'success' => true,
                'data' => $new
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function existsActiveByName($name)
    {
        return $this->model
            ->where('name', $name)
            ->whereNull('deleted_at')
            ->exists();
    }
}
