<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use App\Models\Permission;
use App\Models\Rol;
use App\Models\RolePermission;
use App\Models\User;
use App\Repositories\MenusRepository;
use App\Repositories\RolesRepository;
use App\Repositories\RouteRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Http\Response;

class MenuController extends Controller
{

    function __construct(private MenusRepository $menusRepository)
    {
        // $this->middleware('permission:view_parametrizar_menus')->only(['index']);
        // $this->middleware('permission:add_parametrizar_menus')->only(['create', 'store']);
        // $this->middleware('permission:edit_parametrizar_menus')->only(['edit', 'update']);
        // $this->middleware('permission:delete_parametrizar_menus')->only('destroy');
    }

    public function index(Request $request)
    {
        $menus = (new Menu())->newQuery();
        $menus->when($request->input('queryMenus'), function ($query, $search) {
            $query->where('menus.title', 'ILIKE', "%" . $search . "%")
                ->orWhere('menus.uri', 'ILIKE', "%" . $search . "%");
        })->leftJoin('menus as parent_menu', function ($join) {
            $join->on('menus.parent_id', '=', 'parent_menu.id')
                ->where('menus.parent_id', '!=', 0);
        })->with(['parent'])->orderBy('menus.id', 'desc')
            ->select('menus.*', 'parent_menu.title as title_parents');

        $menus = $menus->paginate(12)->onEachSide(2)->appends(request()->query());

        return Inertia::render('Menu/Index', ['menus' => $menus, 'queryMenus' => $request->input('queryMenus'), 'page' => $request->input('page')]);
    }


    public function allMenus(Request $request, MenusRepository $menusRepository)
    {
        $menuParent = $request->input('parent', 0);
        $user = Auth::user();
        $currentRoleId = session('current_role_id');

        if (!$currentRoleId) {
            $firstRole = $user->roles()->orderBy('id')->first();

            if (!$firstRole) {
                return response()->json([]);
            }

            $currentRoleId = $firstRole->id;
            session(['current_role_id' => $currentRoleId]);
        }

        return response()->json(
            $menusRepository->getMenusByRoleId($currentRoleId, $menuParent)
        );
    }

    protected function isChildrenMenuRole($menu)
    {
        $children = Menu::where('parent_id', $menu->id)->where('status', 1)->get();
        $user = auth()->user();
        foreach ($children as $child) {
            $userRoles = $user->roles;
            return $this->isChildrenMenuRole($child);
        }
        return false;
    }

    public function create()
    {
        $services = $this->menusRepository->all();
        //dd($services);
        return Inertia::render('Menu/Create',[
            'services' => $services
        ]);
    }

    public function store(StoreMenuRequest $request)
    {
        //dd('entra');
        try {
            // $menu = Menu::where('uri', $request->uri)->first();
            // if ($menu == null) {
                $menu = Menu::create($request->except(['roles']));
                $moduleKey = explode('.', $menu->title)[0]; // configuration
                $moduleName = trans("menu.$moduleKey.$moduleKey");
                // dd($moduleKey, $moduleName);
                // $abilities = ['view', 'add', 'edit', 'delete'];
                $abilities = ['view'];

                $permissions = [];
                foreach ($abilities as  $abilitie) {
                    $nombre = strtolower($abilitie . '_' . $request->uri);
                    $permission = Permission::where('name', $nombre)->first();
                    if ($permission == null && !str_contains($nombre, 'main')) {
                        $permissions[] = Permission::create([
                            'name' => $nombre,
                            'guard_name' => 'web',
                            'id_menu' => $menu->id,
                            'name_module' => $moduleName
                        ]);
                    }
                }

                // $menu->permissions()->saveMany($permissions);
                return response()->json(['status' => 200, 'mensaje' => 'Menu creado exitosamente']);
            // } else {
            //     return response()->json(['status' => 403, 'mensaje' => 'Ese menu ya existe']);
            // }
        } catch (\Exception $e) {
            dd($e);
            return response()->json(['status' => 403, 'mensaje' => 'Ocurrio un error']);
        }
    }

    function edit(String $id)
    {
        return Inertia::render("Menu/Create", compact('id'));
    }
    function show(string $id)
    {
        $object = $this->menusRepository->find($id);
        return response()->json($object);
    }
    public function update(StoreMenuRequest $request, Menu $menu)
    {
        try {
            $menu = Menu::find($request  ->id);
            $menu->title        = $request->title;
            $menu->type         = $request->type;
            $menu->uri          = $request->uri;
            $menu->parent_id    = $request->parent_id;
            $menu->target       = $request->target;
            $menu->icon         = $request->icon;
            $menu->save();

            $abilities = ['view', 'add', 'edit', 'delete'];

            foreach ($abilities as $ability) {

                $nombre = strtolower($ability . '_' . $menu->uri);

                $exists = Permission::where('name', $nombre)
                    ->where('id_menu', $menu->id)
                    ->exists();

                if (!$exists && !str_contains($nombre, 'main')) {

                    $moduleKey = explode('.', $menu->title)[0];
                    $moduleName = trans("menu.$moduleKey.$moduleKey");

                    Permission::create([
                        'name' => $nombre,
                        'guard_name' => 'web',
                        'id_menu' => $menu->id,
                        'name_module' => $moduleName
                    ]);
                }
            }

            return response()->json(['status' => 200, 'mensaje' => 'Menu actualizado exitosamente']);
        } catch (\Exception $e) {
            return response()->json(['status' => 403, 'mensaje' => 'Ocurrio un error']);
        }
    }

    public function cambioEstado(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        try {
            $menus_status = Menu::where('id', $request->id)->first();
            $menus_status->status = $request->estado;
            $menus_status->save();
            return response()->json(['status' => 200]);
        } catch (\Exception $e) {
            dd($e);
        }
    }
    function list(Request $request)
    {
        $data = $this->menusRepository->list($request->all(),['parent']);
        return response()->json($data);
    }
    function destroy(String $id)
    {
        $object = $this->menusRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }
}