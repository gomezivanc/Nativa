<?php

namespace App\Http\Controllers;

use App\Repositories\RolesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UserCreateRequest;
use App\Models\User;
use App\Models\Rol;
use App\Models\Persona;
use App\Models\AplicativoUsuario;
use App\Models\AplicativosCentralizado;
use App\Models\ModelHasRol;
use App\Models\TipoDocumento;
use App\Models\Password;
use App\Repositories\GDDependencyRepository;
use App\Repositories\UsuarioRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Stancl\Tenancy\Tenancy;
use App\Models\Permission;
use App\Models\PersonaCentralizado;
use App\Repositories\ThirdsRepository;

class UsuarioController extends Controller
{
    protected $nameDbCent;

    public function __construct(private UsuarioRepository $usuarioRepository, private ThirdsRepository $thirdsRepository ,private RolesRepository $rolesRepository, private GDDependencyRepository $gDDependencyRepository)
    {
        // $this->middleware('permission:view_usuarios', ['only' => ['index']]);
        // $this->middleware('permission:add_usuarios', ['only' => ['create']]);
        // $this->middleware('permission:edit_usuarios', ['only' => ['update']]);
        // $this->middleware('permission:delete_usuarios', ['only' => ['inactivar', 'activar']]);
        // $this->nameDbCent = config('database.connections.centralizado.schema');
    }

    public function index(Request $request)
    {
        // if (!$request->ajax() && !$request->isMethod('GET')) {
        //     return redirect('/');
        // }

        $usuarios = User::join('personas as pers', 'usuarios.id_persona', '=', 'pers.id')
            ->join('tipos_documentos as tip_doc', 'pers.tipo_documento', '=', 'tip_doc.id')
            ->select(
                'usuarios.id',
                'usuarios.email as email',
                'deleted_at as estado',
                'usuarios.usuario as usuario',
                'usuarios.observaciones as observaciones',
                'usuarios.id_persona as persona_id',
                'tip_doc.id AS tipo_documento',
                'tip_doc.nombre AS n_tipo_documento',
                'pers.numero_documento as numero_documento',
                'pers.nombre as nombre',
                'pers.apellido as apellidos',
            )
            ->orderBy('usuarios.id', 'asc')
            ->where(function ($query) {
                $searchValue = request()->input('queryUsuarios');
                if ($searchValue) {
                    $query->where("usuarios.usuario", "like", '%' . $searchValue . '%');
                }
            });

        $usuarios = $usuarios->paginate(10);
        $result = $usuarios->items();
        foreach ($result as $consul) {
            $rol = Rol::join('model_has_roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('model_has_roles.model_id', $consul->id)
                ->get();
            $roles_name = Rol::join('model_has_roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('model_has_roles.model_id', $consul->id)
                ->pluck('roles.name')
                ->implode(' - ');
            if ($rol != null) {
                $id_rol = [];
                foreach ($rol as $role) {
                    $id_rol[] = $role->id;
                }
                $consul->idrol = $id_rol;
                $consul->rol_nom = $roles_name;
            }

            $consul->dependency = $consul->dependency_id;
        }
        $tipo_documento = TipoDocumento::orderBy('id', 'ASC')->where('estado', 1)->get();
        $roles = Rol::orderBy('id', 'asc')->where('status', true)->get();
        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'tipo_documento' => $tipo_documento,
            'roles' => $roles
        ]);
    }
    
    function list(Request $request)
    {
        $data = $this->usuarioRepository->list($request->all(), ['dependency','persona', 'regional', 'charge']);
        if (empty($request['typeData'])) {
            foreach ($data->items() as $key => $value) {
                $value->rol = ModelHasRol::with(['roles:id,name'])->where('model_type', User::class)->where('model_id', $value->id)->get();
            }
        }
        return response()->json($data);
    }

    public function actualizarPerfil(User $user, Request $request)
    {        
        // Obtener el usuario existente por su ID
        $user = User::find($request->id);
        $numero_documento_existente = Persona::where('numero_documento', $request->numero_documento)
        ->where('id', '!=', $user->id_persona)
        ->exists();
        
        if ($numero_documento_existente) {
            return back()->withErrors([
                'numero_documento' => 'El número de documento ya está asociado a otro usuario'
            ])->withInput();
        }

        // Actualizar roles del usuario
        if ($request->roles) {
            // Obtener roles como array
            $rolesArray = is_array($request->roles) ? $request->roles : [$request->roles];
            
            // Eliminar los roles actuales
            ModelHasRol::where('model_id', $user->id)
                ->where('model_type', 'App\Models\User')
                ->delete();
            
            // Asignar los nuevos roles
            foreach ($rolesArray as $roleId) {
                ModelHasRol::create([
                    'role_id' => $roleId,
                    'model_id' => $user->id,
                    'model_type' => 'App\Models\User'
                ]);
            }
        }

        // Verificar si las contraseñas coinciden
        if ($request->contrasena !== $request->contrasena2) {
            return back()->withErrors(['contrasena' => 'Las contraseñas no coinciden'])->withInput();
        }

        $usuario = $request->usuario;
        $usuarioExistente = User::where('usuario', $usuario)->first();

        if ($usuarioExistente && $usuarioExistente->id != $request->id) {
            return back()->withErrors([
                'usuario' => 'El Usuario ingresado ya está registrado!'
            ])->withInput();
        }

        $person = Persona::find($request->id_persona);

        $person->nombre = $request->nombres;
        $person->apellido = $request->apellidos;
        $person->tipo_documento = $request->tipo_documento;
        $person->numero_documento = $request->numero_documento;
        $person->save();

        $user = User::find($request->id);
        $user->id_persona = $person->id;
        $user->usuario = $request->usuario;
        $user->email = $request->email;
        $user->observaciones = $request->observaciones;
        $user->regional_id = $request->regional_id;
        $user->dependency_id = $request->dependency_id;
        $user->charge_id = $request->charge_id;
        //contratista 
        $user->boss_mail = $request->boss_mail;
        $user->notification = $request->notification;
        $user->fecha_finaliza = $request->fecha_finaliza;
        $user->notificacion_correo = null;
        
        if ($request->filled('contrasena')) {
            $user->update([
                'password' => bcrypt($request->contrasena)
            ]);
        }

        $user->save();

        return Redirect::route('usuarios.index')->with('success', 'Perfil actualizado exitosamente');
    }

    public function store(Request $request)
    {
        try {
            $user = User::where('usuario', $request->user)->first();

            if($request->is_edit) {
                $persona = Persona::findOrFail($user->persona->id);
                $persona->nombre = $request->first_name;
                $persona->apellido = $request->last_name;
                $persona->tipo_documento = $request->document_type;
                $persona->numero_documento = $request->id_number;
                $persona->save();
            } else {
                $persona = new Persona();
                $persona->nombre = $request->first_name;
                $persona->apellido = $request->last_name;
                $persona->tipo_documento = $request->document_type;
                $persona->numero_documento = $request->id_number;
                $persona->save();
            }

            // validar si el usuario existe
            if(!$request->is_edit && !empty($user)) {
                return response()->json(['status' => 422, 'message' => 'El nombre de usuario ya existe!'],422);
            }
            if(!$request->is_edit) {
                $user = User::create( [
                    'usuario' => $request->user,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'estado' => 1,
                    'observaciones' => $request->observations,
                    'id_persona' => $persona->id,
                    'is_contractor' => $request->is_contractor,
                    'boss_mail' => ($request->boss_mail ? $request->boss_mail : Null),
                    'notification' => ($request->notification ? $request->notification : Null),
                ]);
            }

            $user->dependency_id = $request['id_dependency'];
            $user->regional_id = $request['regional_id'];
            $user->charge_id = $request['id_charge'];
            $user->save();

            if (!empty($request['file']) && !empty($request['filename'])) {

                $file = $request->only(['file', 'filename']);
                $file['filename'] = sanitizeFilename($file['filename']);
                $path = "user/" . $user->id . "/" . $file['filename'];
                $fileData = substr($file['file'], strpos($file['file'], ',') + 1);

                Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

                $user->signature = $path;
                $user->save();
            }
            if (!empty($request->signature)) {
                Storage::disk('local')->delete("public/" . $user->physical_signature);
                $image = str_replace('data:image/png;base64,', '', $request->signature);
                $image = str_replace(' ', '+', $image);
                $fileName = $user->id . '_' . date('H_i_s') . '.png';
                $path = "user/" . $user->id . "/" . $fileName;

                Storage::disk('local')->put("public/" . $path, base64_decode($image));
                $user->physical_signature = $path;
                $user->save();
                
            } else {
                $user->physical_signature = null;
                $user->save();
            }

            // Validar rol
            $rol = Rol::select('name')->
                whereIn('id', $request->id_role)
                ->get()
                ->pluck('name');

            if($request->is_edit) {
                $user->email = $request->email;
                if (isset($request->password)) {
                    $user->password = Hash::make($request->password);
                }

                $user->observaciones = $request->observations;
                $user->save();
            }

            $user->roles()->detach();
            $user->assignRole($rol);

        } catch (\Exception $e) {
            throw $e;
        }
    }

    function edit(string $id)
    {
        $user = $this->usuarioRepository->find($id);
        $id_person = $user->id_persona;
        $userRoles = ModelHasRol::where('model_id', $user->id)->where('model_type', 'App\Models\User')->pluck('role_id')->toArray();
        $isAdmin = Auth::user()->super_administrador == '1' or Auth::user()->hasRole('Administrador');
        $allRoles = Rol::where('status', 1)->orderBy('name')->get(['id', 'name']); // Todos los roles disponibles
        $persona = Persona::findOrFail($id_person);

        // dd($allRoles->all(), $userRoles);
        return Inertia::render("Usuarios/Edit", [ 
            'id' => $id,
            'usuario' => $user,
            'persona' => $persona,
            'userRoles' => $userRoles, // Roles asignados (array de IDs)
            'isAdmin' => $isAdmin,
            'allRoles' => $allRoles, // Todos los roles disponibles
            'userDependecy' => $user->dependency_id, // Dependencia asignada
            'userRegional' => $user->regional_id, // Sede asignada
            'signatureURL' => $user->physical_signature, // firma asignada
        ]);
    }

    function editUserLogin(string $id)
    {
        $user = $this->usuarioRepository->find($id);
        $id_person = $user->id_persona;
        $userRoles = ModelHasRol::where('model_id', $user->id)->where('model_type', 'App\Models\User')->get()->pluck('role_id');
        // dd($userRoles,$id_person,$user);
        return Inertia::render("Usuarios/EditProfile", [
            'id' => $id,
            'id_person' => $id_person,
            'userRoles' => $userRoles, // Roles asignados
            'userDependecy' => $user->dependency_id, // Dependencia asignada
            'userRegional' => $user->regional_id, // Sede asignada
            'signatureURL' => $user->physical_signature, // Dependencia asignada
        ]);
    }

    function show(string $id)
    {
        $object = $this->usuarioRepository->find($id);
        return response()->json($object);
    }
    
    public function cambioEstado(Request $request)
    {
        if (!$request->ajax())
            return redirect('/');

        try {
            $user = AplicativoUsuario::where('id_usuario', $request->id)->where('id_aplicativo', tenant()->id)->first();
            $user->estado = $request->estado;
            $user->save();

            $user = User::findOrFail($request->id);
            $user->estado = $request->estado;
            $user->save();
            return response()->json(['status' => 200]);
        } catch (\Exception $e) {
            return response()->json(['status' => 403, 'mensaje' => 'Ocurrió un error!',]);
        }
    }

    public function getPersonasCentralizado(Request $request)
    {
        if (!$request->ajax()) {
            return redirect('/');
        }

        $consultaPerson = Persona::query()
            ->join('tipos_documentos', 'personas.tipo_documento', '=', 'tipos_documentos.id')
            ->leftJoin('usuarios', 'personas.id', '=', 'usuarios.id_persona')
            ->select(
                'personas.id',
                'personas.nombre',
                'personas.apellido',
                'personas.numero_documento',
                'personas.tipo_documento',
                'tipos_documentos.nombre as nom_tipo',
                'usuarios.signature',
                'usuarios.usuario',
                'usuarios.email',
                'usuarios.observaciones'
            )
            ->get();

        $personas = [];

        foreach ($consultaPerson as $person) {
            $personas[] = [
                'id' => $person->id,
                'nombre' => $person->nombre . ' ' . $person->apellido . ' - ' . $person->numero_documento,
                'nombres' => $person->nombre,
                'apellidos' => $person->apellido,
                'numero_documento' => $person->numero_documento,
                'tipo_documento' => $person->tipo_documento,
                'url_signature' => $person->signature,
                'nombre_tipo_doc' => $person->nom_tipo,
                'validar_user' => $person->usuario ? 1 : 0,
                'nombre_user' => $person->usuario ?? '',
                'email_user' => $person->email ?? '',
                'observaciones' => $person->observaciones ?? '',
            ];
        }

        return $personas;
    }

    function getUsers(Request $request)
    {
        $query = User::query();
        if (!empty($request['by_dependency'])) {
            $query->where('dependency_id', $request['by_dependency']);
        }
        $query->with(['persona']);

        if (empty($request['all'])) {
            $query->whereNull('notificacion_correo');
        }
        return $query->get();
    }

    function create(Request $request)
    {
        $roles = Role::orderBy('id', 'asc')->where('status', true)->get();
        return Inertia::render("Usuarios/Create", ['roles' => $roles]);
    }

    function updateProfile(Request $request)
    {
        try {
            $isAdmin = Auth::user()->super_administrador == '1' || Auth::user()->hasRole('Administrador');
            $person = Persona::find($request->person);
            $person->nombre = $request->first_name;
            $person->apellido = $request->last_name;
            $person->save();
            $user = User::find($request->id_user);
            
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found', ], 404);
            };

            if ($isAdmin) {
                $user->email = $request->email;
                $user->dependency_id = $request->id_dependency;
                $user->regional_id = $request->regional_id;
                $user->charge_id = $request->id_charge;
                $user->save();
            }

            if ($request->filled('password')) {
                // Verificar la contraseña actual
                if (!Hash::check($request->input('current_password'), $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password is incorrect',
                    ], 400);
                }

                // Actualizar la contraseña
                $user->password = Hash::make($request->input('password'));
                $user->save();
            }

            if (!empty($request['file']) && !empty($request['filename'])) {

                $file = $request->only(['file', 'filename']);
                $file['filename'] = sanitizeFilename($file['filename']);
                $path = "user/" . $user->id . "/" . $file['filename'];
                $fileData = substr($file['file'], strpos($file['file'], ',') + 1);

                Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

                $user->signature = $path;
                $user->save();
            }
            if (!empty($request->signature)) {
                Storage::disk('local')->delete("public/" . $user->physical_signature);
                $image = str_replace('data:image/png;base64,', '', $request->signature);
                $image = str_replace(' ', '+', $image);
                $fileName = $user->id . '_' . date('H_i_s') . '.png';
                $path = "user/" . $user->id . "/" . $fileName;

                Storage::disk('local')->put("public/" . $path, base64_decode($image));
                $user->physical_signature = $path;
                $user->save();
            } else {
                $user->physical_signature = null;
                $user->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user,
            ], 200);
        } catch (\Throwable $th) {
            throw $th;
        }

    }

    function destroy(String $id)
    {
        $object = User::withTrashed()->findOrFail($id);

        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }

        return response()->json($object);
    }

    public function asignarPermisos(Request $request)
    {
        $user = User::findOrFail($request->id);
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
        $user->syncPermissions($permissionsToAssign);
    }

    public function getPermissions(Request $request)
    {
        $childPermissions = Permission::join('menus', 'menus.id', '=', 'permissions.id_menu')
            ->select('permissions.*', 'menus.title')
            ->get();
        // $fatherPermissions = Permission::select('name_module')->distinct()->get();

        $user = User::find($request->id);
        $assignedPermissions = $user->getAllPermissions()->pluck('id');

        $permissions = collect([]);

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

    function detail(String $id){
        return Inertia::render("Usuarios/Detail", compact('id'));
    }

    public function searchUsers(Request $request)
    {
        $search = $request->input('search');
        
        if (!$search || strlen($search) < 2) {
            return response()->json(['results' => []]);
        }

        $users = $this->usuarioRepository->searchActiveUsers($search);

        $results = $users->map(fn($user) => [
            'id'            => $user->id,
            'name'          => $user->persona?->nombre ?? '',
            'numeroDocu'    => $user->persona?->numero_documento ?? '',
            'persona'       => ['name' => $user->persona?->nombre ?? '', 'apellido' => $user->persona?->apellido ?? '' ],
            'email'         => $user->email,
            'dependency_id' => $user->dependency_id,
            'dependency'    => [
                'id'   => $user->dependency?->id,
                'name' => $user->dependency?->name,
            ],
            'regional_id'   => $user->regional_id,
            'regional'      => [
                'id'   => $user->regional?->id,
                'name' => $user->regional?->name,
            ],
            'charge_id'     => $user->charge_id,
            'charge'        => [
                'id'   => $user->charge?->id,
                'name' => $user->charge?->cargo,
            ],
        ]);
    
        return response()->json(['results' => $results]);
    }

    public function searchThir(Request $request)
    {   
        $document = $request->search;
        
        if (!$document || strlen($document) < 2) {
            return response()->json(['results' => []]);
        }

        $thirds = $this->thirdsRepository->searchActiveThir($document);
        $thirds->load('tipoDocumento');

        $results = $thirds->map(fn($third) => [
            'id'                                    => $third->id,
            'document_nit_sender'                   => $third->document_nit_sender,
            'document_nit'                          => $third->document_nit_sender,
            'name_social_reason_sender'             => $third->name_social_reason_sender,
            'first_surname_legal_representative_sender' => $third->first_surname_legal_representative_sender ?? '',
            'type_document_id'                      => $third->type_document_id ?? '',
            'type_document_name'                    => $third->tipoDocumento?->nombre ?? '',
            'email_sender'                          => $third->email_sender ?? '',
            'phone_sender'                          => $third->phone_sender ?? '',
            'address_sender'                        => $third->address_sender ?? '',
            'country_id'                            => $third->country_id ?? '',
            'department_id'                         => $third->department_id ?? '',
            'city_id'                               => $third->city_id ?? '',
        ])->toArray();

        return response()->json(['results' => $results]);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->usuarioRepository->list(array_merge($filters, ['typeData' => 'todos']), ['dependency','persona', 'regional', 'charge']);
        $dataObtained = [];
        foreach ($data as $value) {
            $item = [
                'usuario' => $value->usuario,
                'email' => $value->email,
                'persona' => $value->persona?->nombre . ' ' . $value->persona?->apellido,
                'dependency' => $value->dependency?->name,
                'regional' => $value->regional?->name,
                'charge' => $value->charge?->cargo,
            ];
            $dataObtained[] = $item;
        }
        return $this->usuarioRepository->export($type, $dataObtained, 'Excel.Export.generalExport', 'usuarios.table', 'Usuarios');
    }

}
