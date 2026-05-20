<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserGroupRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UsersGroupController extends Controller
{
    public function __construct(private UserGroupRepository $userGroupRepository)
    {
    }

    function index(Request $request) {
        $dependencies = $this->userGroupRepository->all();
        return Inertia::render("Configuration/usersGroup/Index",[
            'dependencies' => $dependencies
        ]);
    }

    function create(Request $request) {
        $users = User::with(['persona'])->get();
        return Inertia::render("Configuration/usersGroup/Create", [
            'users' => $users
        ]);
    }

    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->userGroupRepository->storeGeneral($request->except('users','dependencies'));

        $data->users()->delete();
        foreach ($request->users as $key => $id) {
            $data->users()->create([
                'user_id' => $id,
            ]);
        }
        $data->dependencies()->delete();
        foreach ($request->dependencies as $key => $id) {
            $data->dependencies()->create([
                'dependency_id' => $id,
            ]);
        }
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->userGroupRepository->list($request->all(),['users.user.persona:id,nombre,apellido','dependencies.dependency:id,name,code']);

        return response()->json($data);
    }

    function edit(String $id) {
        $users = User::with(['persona'])->get();

        return Inertia::render("Configuration/usersGroup/Create",compact('id','users'));
    }

    function show(String $id) {
        $object = $this->userGroupRepository->find($id,['users','dependencies']);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->userGroupRepository->find($id);
        if($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->userGroupRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $value) {
            $value->makeHidden(['created_at','updated_at','deleted_at','creado_por_id','dependency','id']);
            $item = [
                'name' => $value->name,
                'g_d_dependency_id' => "",
                'created_at' => $value->created_at->format('d/m/Y H:i:s'),
            ];

            $item['g_d_dependency_id'] = implode(', ',$value->dependencies->map(function ($item) {
                return "{$item->dependency->code} {$item->dependency->name}";
            })->toArray());

            $dataO[] = $item;
        }

        return $this->userGroupRepository->export($type,$dataO,'Excel.Export.generalExport','configuration.users_group.form');
    }
}
