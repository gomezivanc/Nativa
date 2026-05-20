<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

class MenusRepository extends BaseRepository{

    public function __construct(Menu $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['title'])) {
                    $query->where('title','like', '%'.$request['title'].'%');
                }                
                if (!empty($request['uri'])) {
                    $query->where('uri','like', '%'.$request['uri'].'%');
                }
                if (!empty($request['parent_id'])) {
                    $query->where('parent_id','like', '%'.$request['parent_id'].'%');
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

    /**
     * Obtener menús disponibles para un rol específico
     * Evita consultas N+1 usando eager loading y cache
     */
    public function getMenusByRoleId(int $roleId, int $parentId = 0): Collection
    {
        $menuIds = Role::find($roleId)
            ->permissions()
            ->pluck('id_menu')
            ->unique();

        if ($menuIds->isEmpty()) {
            return collect();
        }

        return $this->model
            ->where('status', 1)
            ->where('parent_id', $parentId)
            ->where(function ($query) use ($menuIds) {
                $query->whereIn('id', $menuIds)
                    ->orWhereIn('id', function ($subQuery) use ($menuIds) {
                        $subQuery->select('parent_id')
                            ->from('menus')
                            ->whereIn('id', $menuIds)
                            ->where('parent_id', '!=', 0);
                    });
            })
            ->orderBy('id')
            ->get();
    }
}