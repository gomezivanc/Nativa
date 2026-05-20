<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Permission;
use App\Models\MenuOld;
use App\Repositories\PermisionRepository;
use App\Repositories\MenusRepository;
use DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PermisosController extends Controller
{

    function __construct(private PermisionRepository $permisionRepository , private MenusRepository $menusRepository)
    {
        // $this->middleware('permission:view_permisos')->only('index');
        // $this->middleware('permission:add_permisos')->only('store');
        // $this->middleware('permission:edit_permisos')->only('update');
        // $this->middleware('permission:delete_permisos')->only(['inactivar','activar']);
    }


    public function index(Request $request)
    {
        return Inertia::render("Permisos/Index", []);
    }

    function list(Request $request)
    {
        $data = $this->permisionRepository->list($request->all(),['roles']);
        return response()->json($data);
    }


    function store(Request $request)
    {
        $data = $this->permisionRepository->storeGeneral($request->all());
        return response()->json($data);
    }


    public function update(Request $request)
    {
        $permiso = Permission::where('id', $request->id)->first();
        $permiso->name = $request->nombre;
        $permiso->save();
    }

    public function inactivar(Request $request)
    {
        $rol = Permission::findOrFail($request->id);
        $rol->status = 0;
        $rol->save();
    }

    public function activar(Request $request)
    {
        $rol = Permission::findOrFail($request->id);
        $rol->status = 1;
        $rol->save();
    }
    function show(string $id)
    {
        $object = $this->permisionRepository->find($id);
        return response()->json($object);
    }

    function create(Request $request)
    {
        $menu = $this->menusRepository->list([
            'typeData' => 'all'
        ]);
        return Inertia::render("Permisos/Create", compact('menu'));
    }
    function edit(String $id)
    {
        $menu = $this->menusRepository->list([
            'typeData' => 'all'
        ]);
        return Inertia::render("Permisos/Create", compact('id','menu'));
    }
    function destroy(String $id)
    {
        $object = $this->permisionRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    // public function index(Request $request)
    // {

    //     if (!$request->ajax()) return redirect('/');

    //     $buscar = $request->buscar;
    //     $criterio = $request->criterio;

    //     if ($buscar=='')
    //     {
    //         $permission = Permission::join('menus','menus.id','=','permissions.id_componente')
    //                                 ->select('permissions.id as id','permissions.name','permissions.status as status','permissions.created_at as created_at','menus.id as id_menu','menus.name as nombre_menu')
    //                                 ->where('permissions.status','1')
    //                                 ->orderBy('id', 'desc')
    //                                 ->paginate(10);

    //     }
    //     else
    //     {
    //         $permission = Permission::join('menus','menus.id','=','permissions.id_componente')
    //                                 ->select('permissions.id as id','permissions.name','permissions.status as status','permissions.created_at as created_at','menus.id as id_menu','menus.name as nombre_menu')
    //                                 ->where('permissions.status','1')
    //                                 ->where('permissions.'.$criterio, 'like', '%'. $buscar . '%')
    //                                 ->orderBy('id', 'desc')
    //                                 ->paginate(10);

    //     }

    //     return [
    //         'pagination' => [
    //             'total'        => $permission->total(),
    //             'current_page' => $permission->currentPage(),
    //             'per_page'     => $permission->perPage(),
    //             'last_page'    => $permission->lastPage(),
    //             'from'         => $permission->firstItem(),
    //             'to'           => $permission->lastItem(),
    //         ],
    //         'permission' => $permission
    //     ];
    // }

    // public function store(Request $request)
    // {
    //     if (!$request->ajax()) return redirect('/');

    //     $permission = Permission::where('name', 'LIKE', '%'. $request->name)->pluck('id')->first();

    //     if($permission == null and $request->id_componente != 0)
    //     {
    //         $menu = MenuOld::where('id',$request->id_componente)->first();

    //         if(is_object($menu)){
    //             $var = Permission::firstOrCreate(['name' => $request->name, 'guard_name' => 'web','id_componente' => $request->id_componente]);

    //             $menssage = 'El permiso ' .' '.$var->name.' '. 'fue creado con exito';
    //             return response()->json(['status' => 'success', 'message' => $menssage]);

    //         }else{
    //             return response()->json(['status' => 'error', 'message' => 'Error asociarlo con el item del menu']);

    //         }
    //     }
    //     else
    //     {
    //     	return response()->json(['status' => 'error', 'message' => 'Este nombre permiso ya existe']);
    //     }
    // }

    // private function generatePermissions($attr)
    // {
    //     $abilities = ['view', 'add', 'edit', 'delete'];
    //     $name = $attr;

    //     return array_map(function($val) use ($name) {
    //         return $val . '_'. $name;
    //     }, $abilities);
    // }

    // public function update(Request $request)
    // {
    //     if (!$request->ajax()) return redirect('/');

    //     try
    //     {
    //         DB::beginTransaction();

    //         $permiso = Permission::where('id', $request->id)->first();
    //         $permiso->name = $request->name;
    //         $permiso->id_componente = $request->id_componente;
    //         $permiso->save();

    //         DB::commit();

    //     	return response()->json(['status' => 'success', 'message' => 'Permiso actualizado correctamente']);

    //     }
    //     catch (Exception $e)
    //     {
    //         DB::rollBack();

    //     	return response()->json(['status' => 'error', 'message' => 'Ocurrió un error']);

    //     }
    // }

    // public function cambiarEstado(Request $request)
    // {
    // 	if (!$request->ajax()) return redirect('/');

    //     try
    //     {
    //         DB::beginTransaction();

    //         $pedido = Permission::where('id', $request->id)->first();
    //         $pedido->status = $request->estado;
    //         $pedido->save();

    //         DB::commit();

    //         echo json_encode('ok');

    //     }
    //     catch (Exception $e)
    //     {
    //         DB::rollBack();
    //         echo json_encode('no');

    //     }
    // }

    // public function obtenerPermisos()
    // {

    //     $permisos_menu = Permission::join('menus','menus.id','=','permissions.id_componente')
    //                         ->select('permissions.id_componente','permissions.id as id_permiso','permissions.name','menus.id as id_menu','menus.name as nombre_menu','menus.ruta as ruta')
    //                         ->where('permissions.status','1')
    //                         ->where('menus.status','1')
    //                         ->groupBy('permissions.id_componente','permissions.id','permissions.name','menus.id','menus.name','menus.ruta')
    //                         ->get();
    //     $permisos = [];
    //     foreach($permisos_menu as $menu => $key){

    //         if($key->id_menu == $key->id_menu){
    //             if(!isset($permisos[$key->id_menu]['nombre'])){
    //                 $permisos[$key->id_menu] = ['nombre' => $key->nombre_menu,'ruta' => $key->ruta];
    //             }
    //             $permisos[$key->id_menu]['permisos'][]= ['name_permiso' => $key->name,'id_permiso' => $key->id_permiso];
    //         }
    //     }

    // 	return response()->json(['permisos' => $permisos]);
    // }
    function cleanStorage($folder)
    {
        $allowedFolders = [
            'distribution_shipping_filings',
            'doc_filing',
            'exp_file',
            'filing',
            'payroll_managment',
        ];

        if (!in_array($folder, $allowedFolders)) {
            return response()->json([
                'message' => 'Carpeta no permitida',
                'folder_requested' => $folder,
                'allowed_folders' => $allowedFolders,
            ], 403);
        }

        $fullPath = storage_path("app/public/{$folder}");

        if (!is_dir($fullPath)) {
            $basePath = storage_path('app/public');
            $exists = is_dir($basePath);
            $contents = $exists ? array_values(array_diff(scandir($basePath), ['.', '..'])) : [];

            return response()->json([
                'message' => 'Carpeta no encontrada',
                'searched_path' => $fullPath,
                'base_path_exists' => $exists,
                'base_path_contents' => $contents,
                'hint' => 'Verifica que la carpeta exista en storage/app/public/ del servidor',
            ], 404);
        }

        try {
            $deletedCount = $this->deleteDirectoryContents($fullPath);

            return response()->json([
                'message' => "Carpeta {$folder} limpiada correctamente",
                'items_deleted' => $deletedCount,
                'path' => $fullPath,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el contenido',
                'error' => $e->getMessage(),
                'path' => $fullPath,
            ], 500);
        }
    }

    private function deleteDirectoryContents($dir)
    {
        if (!is_dir($dir)) {
            return 0;
        }

        $count = 0;
        $items = array_diff(scandir($dir), ['.', '..']);

        foreach ($items as $item) {
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $count += $this->deleteDirectoryContents($path);
                if (!rmdir($path)) {
                    throw new \Exception("No se pudo eliminar el directorio: {$path}");
                }
                $count++;
            } else {
                if (!unlink($path)) {
                    throw new \Exception("No se pudo eliminar el archivo: {$path}");
                }
                $count++;
            }
        }

        return $count;
    }

    public function cleanStorage_v($folder)
    {
        $allowedFolders = [
            'distribution_shipping_filings',
            'doc_filing',
            'exp_file',
            'filing',
            'payroll_managment',
        ];

        // Validar carpeta permitida
        if (!in_array($folder, $allowedFolders)) {
            return response()->json([
                'message' => 'Carpeta no permitida',
                'folder_requested' => $folder,
            ], 403);
        }

        try {

            $disk = Storage::disk('public');

            // Verificar existencia
            if (!$disk->exists($folder)) {
                return response()->json([
                    'message' => 'Carpeta no encontrada',
                    'path' => storage_path("app/public/{$folder}"),
                ], 404);
            }

            // Contar contenido antes de eliminar
            $files = $disk->allFiles($folder);
            $directories = $disk->allDirectories($folder);

            $deletedFiles = count($files);
            $deletedDirectories = count($directories);

            // Eliminar completamente la carpeta
            $deleted = $disk->deleteDirectory($folder);

            if (!$deleted) {
                return response()->json([
                    'message' => 'No fue posible eliminar la carpeta',
                    'path' => storage_path("app/public/{$folder}"),
                ], 500);
            }

            // Recrear carpeta vacía
            $disk->makeDirectory($folder);

            return response()->json([
                'success' => true,
                'message' => "Carpeta {$folder} limpiada correctamente",
                'deleted_files' => $deletedFiles,
                'deleted_directories' => $deletedDirectories,
                'storage_path' => storage_path("app/public/{$folder}"),
            ]);

        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al limpiar la carpeta',
                'error' => $e->getMessage(),
                'folder' => $folder,
            ], 500);
        }
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->permisionRepository->list(array_merge($filters, ['typeData' => 'todos']), ['roles']);
        $dataObtained = [];
        foreach ($data as $value) {
            $item = [
                'name' => $value->name,
                'guard_name' => $value->guard_name,
            ];
            $dataObtained[] = $item;
        }
        return $this->permisionRepository->export($type, $dataObtained, 'Excel.Export.generalExport', 'permisos.table', 'Permisos');
    }
}
