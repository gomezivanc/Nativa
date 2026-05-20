<?php

namespace App\Repositories;

use App\Exports\ClasificationDependecyExport;
use App\Exports\TrdExport;
use App\Exports\TrdTemplateExport;
use App\Models\GDDependency;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Serie;

class GDDependencyRepository extends BaseRepository{

    public function __construct(GDDependency $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = [], $hidden = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if(!empty($request['code'])) {
                    $query->where('code','like','%'.$request['code'].'%');
                }
                if(!empty($request['name'])) {
                    $query->where('name','like','%'.$request['name'].'%');
                }
                if(!empty($request['g_d_parent_id'])) {
                    $query->where('g_d_parent_id',$request['g_d_parent_id']);
                }
                if(!empty($request['dep_id'])) {
                    $query->where('dep_id',$request['dep_id']);
                }
                if(!empty($request['ciu_id'])) {
                    $query->where('ciu_id',$request['ciu_id']);
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at','>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at','<=', $request['created_at_end']);
                }
                // if(!empty($request['only_unit_admin'])) {     // la agrupacion por unidades administrativas
                //     $query->whereHas('gdDependenciesChildrens');
                // }
                if(!empty($request['regional_id'])) {
                    $query->where('regional_id', $request['regional_id']);
                }
            });
        $data->latest();
        if(!empty($request['active'])) {
            if($request['active'] == "false") {
                $data->onlyTrashed();
            }
        } 
        // else {
        //     $data->withTrashed();
        // }
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 999);
        } else {
            $data = $data->get()->map(function ($item) {
                $item->name = $item->code . ' - ' . $item->name; // Concatenar code y name
                return $item;
            });
        }
        foreach ($data as $item) {
            $item->makeHidden($hidden);
        }
        return $data;
    }

    function exportTrd($request)
    {
        if ($request->filled('ids')) {
            $dependencies = $this->model->whereIn('id', $request->ids)->get();
        } else {
            $dependencies = collect(); 
        }

        switch ($request->type) {
            case 'clasification':
                return Excel::download(
                    new ClasificationDependecyExport($dependencies),
                    'clasification.xlsx'
                );

            case 'trd':

                if ($dependencies->isEmpty()) {
                    return Excel::download(
                        new TrdTemplateExport(), // nueva clase solo plantilla
                        'trd_plantilla.xlsx'
                    );
                }

                return Excel::download(
                    new TrdExport($dependencies),
                    'trd.xlsx'
                );

            default:
                abort(400, 'Tipo inválido');
        }
    }
}
