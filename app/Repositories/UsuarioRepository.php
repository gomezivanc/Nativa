<?php

namespace App\Repositories;

use App\Models\Permission;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UsuarioRepository extends BaseRepository{

    public function __construct(User $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->withTrashed()->select($select)
        ->with($with)
        ->withCount($withCount)
        ->where(function ($query) use ($request) {

            if (!empty($request['searchQuery'])) {
                $query->where('usuario','like', '%'.$request['searchQuery'].'%')
                    ->orWhere('email','like', '%'.$request['searchQuery'].'%');
            }

            if (!empty($request['user'])) {
                $query->where('usuario','like', '%'.$request['user'].'%');
            }

            if (!empty($request['created_at_init'])) {
                $query->where('created_at','>=', $request['created_at_init']);
            }

            if (!empty($request['created_at_end'])) {
                $query->where('created_at','<=', $request['created_at_end']);
            }

            if (!empty($request['dependency_id'])) {
                $query->where('dependency_id', $request['dependency_id']);
            }

            if (!empty($request['regional_id'])) {
                $query->where('regional_id', $request['regional_id']);
            }

            if (!empty($request['role_id'])) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('id', $request['role_id']);
                });
            }
        });

        if(isset($request['active'])) {
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

    public function findByOfficialId($officialId)
    {
        return $this->model
            ->with('persona')
            ->where('id', $officialId) // o id_persona si aplica
            ->first();
    }

    public function allContractor()
    {
        return $this->model
            ->with('persona')
            ->whereNotNull('is_contractor')
            ->get();
    }

    public function searchActiveUsers(string $search, int $limit = 10)
    {
        return User::query()
            ->with(['persona', 'dependency', 'regional', 'charge'])
            
            ->where(function($query) use ($search) {
                $query->whereHas('persona', function($q) use ($search) {
                    $q->where('nombre', 'LIKE', "%{$search}%")
                    ->orWhere('numero_documento', 'LIKE', "%{$search}%");
                })
                ->orWhere('email', 'LIKE', "%{$search}%");
            })
            
            ->select([
                'id', 
                'id_persona', 
                'email', 
                'dependency_id', 
                'regional_id', 
                'charge_id'
            ])
            
            ->limit($limit)
            ->get();
    }
}
