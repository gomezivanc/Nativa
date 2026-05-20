<?php

namespace App\Http\Controllers;

// use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\RolePermission;
use App\Models\Rol;
use App\Models\Permission;
use App\Models\TipoExamen;
use App\Repositories\RolesRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RolController extends Controller
{
    function __construct(private RolesRepository $rolesRepository)
    {

        // $this->middleware('permission:view_roles')->only('index');
        // $this->middleware('permission:add_roles')->only('store');
        // $this->middleware('permission:edit_roles')->only('update');
        // $this->middleware('permission:delete_roles')->only(['inactivar', 'activar']);
    }

    public function getRoles()
    {
        $roles = Rol::orderBy('id', 'asc')->get();
        return response()->json($roles);
    }



    public function index()
    {
        $roles = Rol::orderBy('id', 'asc')
            ->where(function ($query) {
                if (request()->input('queryRoles')) {
                    $searchValue = strtolower(request()->input('queryRoles'));
                    $query->whereRaw('LOWER(roles.name) LIKE ?', ["%{$searchValue}%"]);
                }
            });

        $permisos_menu = Permission::select('id','name','status')->orderBy('id','asc')->get();

        return Inertia::render('Roles/Index', [
            'queryRoles' => request()->input('queryRoles'),
            'roles'  => $roles->paginate(10),
            'permisos' => $permisos_menu,
        ]);
    }
    public function consulta(Request $request)
    {
        $id = $request->params['id'];

        $rol = Rol::find($id);
        $permissionsRol = $rol->getAllPermissions(); // Permisos asignados al rol
        $permissions = Permission::all(); // Todos los permisos

        foreach ($permissions as $permission) {
            // Verifica si el permiso actual está en la lista de permisos del rol
            $permission->status = $permissionsRol->contains('id', $permission->id) ? true : false;
        }
        return response()->json(['permisos_rol' =>$permissions]);
    }


    public function update(Request $request)
    {
        $rol = Rol::find($request->id);
        $rol->name = $request->nombre;
        $rol->description = $request->description;
        $rol->save();
        return $rol;
    }

    public function inactivar(Request $request)
    {
        $rol = Rol::findOrFail($request->id);
        $rol->status = 0;
        $rol->save();
    }

    public function activar(Request $request)
    {
        $rol = Rol::findOrFail($request->id);
        $rol->status = 1;
        $rol->save();
    }

    public function asignarPermisos(Request $request)
    {

        $role = Rol::findOrFail($request->id);
        $permissionsToAssign = [];
        foreach ($request->permisos as $module) {
            // Verificamos si existe la clave "permisos" y la recorremos
            if (isset($module['permisos']) && is_array($module['permisos'])) {
                foreach ($module['permisos'] as $permiso) {
                    // Si el permiso tiene "status" en true, lo agregamos
                    if ($permiso['status']) {
                        $permissionsToAssign[] = $permiso['id_permiso'];
                    }
                }
            }
        }
        // Sincroniza los permisos activos con el rol
        $role->syncPermissions($permissionsToAssign);
    }

    public function obtenerRolPermisos(Request $request)
    {
        $id_rol = $request->id_rol;
        $permisos = RolePermission::join('permissions', 'permissions.id', '=', 'role_has_permissions.permission_id')
            ->join('roles', 'roles.id', '=', 'role_has_permissions.role_id')
            ->where('role_has_permissions.role_id', '=', $id_rol)
            ->get();

        return ['permisos' => $permisos];
    }
    public function getPermissions(Request $request)
    {
        $childPermissions = Permission::join('menus', 'menus.id', '=', 'permissions.id_menu')
            ->select('permissions.*', 'menus.title')
            ->get();
        // $fatherPermissions = Permission::select('name_module')->distinct()->get();
        $assignedPermissions = Rol::find($request->input('data')['id'])->getAllPermissions()->pluck('id');
        // $assignedPermissions = Rol::find($request->input('data')['id'])->getPermissions->pluck('id')->toArray();

        $permissions = collect([]);

        // Crear la estructura inicial del array $permissions
        foreach ($childPermissions as $childPer) {

            if (!empty($childPer->name_module)) {
                $moduleName = $childPer->name_module;
            } else {
                $moduleKey = explode('.', $childPer->title)[0];
                $moduleName = trans("menu.$moduleKey.$moduleKey");
            }

            $index = $permissions->search(fn($item) => $item['nombre'] === $moduleName);

            if ($index === false) {
                $permissions->push([
                    'nombre' => $moduleName,
                    'permisos' => collect([])
                ]);
                $index = $permissions->count() - 1;
            }

            $status = $assignedPermissions->contains($childPer->id);

            $permissions[$index]['permisos']->push([
                'id_permiso' => $childPer->id,
                'name_permiso' => $childPer->name,
                'status' => $status
            ]);
        }

        return response()->json(['permisos' => $permissions]);
    }
    function list(Request $request)
    {
        $data = $this->rolesRepository->list($request->all());
        return response()->json($data);
    }
    function create(Request $request)
    {
        return Inertia::render("Roles/Create", []);
    }
    function store(Request $request)
    {
        $data = $this->rolesRepository->storeGeneral($request->except('serie_bool'));
        return response()->json($data);
    }
    function edit(String $id)
    {
        return Inertia::render("Roles/Create", compact('id'));
    }
    function show(string $id)
    {
        $object = $this->rolesRepository->find($id);
        return response()->json($object);
    }
    function destroy(String $id)
    {
        $object = $this->rolesRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }
    function detail(String $id){
        return Inertia::render("Roles/Detail", compact('id'));
    }
    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->rolesRepository->list(array_merge($filters, ['typeData' => 'todos']));
        $dataObtained = [];
        foreach ($data as $value) {
            $item = [
                'name' => $value->name,
                'guard_name' => $value->guard_name,
            ];
            $dataObtained[] = $item;
        }
        return $this->rolesRepository->export($type, $dataObtained, 'Excel.Export.generalExport', 'roles.table', 'Roles');
    }
}
