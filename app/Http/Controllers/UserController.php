<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Equivalencias;
use App\Models\Persona;
use App\Models\UserDepto;
use App\Models\User;
use App\Models\Rol;
use App\Models\PersonaCentralizado;
use App\Models\AplicativoUsuario;
use App\Models\AplicativosCentralizado;
use App\Models\ModelHasRol;
use App\Models\UserDeclarante;
use App\Models\Declarante;
use App\Models\TipoDocumento;
use App\Models\Password;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Divipol;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Hash;

class UserController extends Controller
{

    protected $nameDbCent;

    public function __construct()
    {
        $this->middleware(function ($request, $next){
            if(Session('conexion') == 'centralizado'){
                $this->middleware('permission:view_usuarios', ['only' => ['index','show']]);
                $this->middleware('permission:add_usuarios', ['only' => ['create','store']]);
                $this->middleware('permission:edit_usuarios', ['only' => ['edit','update']]);
                $this->middleware('permission:delete_usuarios', ['only' => ['destroy']]);
            }
            return $next($request);
        });
        $this->nameDbCent = config('database.connections.centralizado.schema');
        // $this->nameDbCent = Equivalencias::nameDbCentralizado();
    }

    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $buscar = $request->buscar;
        $criterio = $request->criterio;

        if(Session('conexion') == 'centralizado')
        {
            $usuarios = User::join('personas','usuarios.id_persona','=', 'personas.id')
                ->join('tipos_documentos','personas.tipo_documento','=','tipos_documentos.id')
                ->leftJoin('abogados', function($query){
                    return $query->on('abogados.id_persona', 'personas.id');
                })
                ->select('usuarios.id',
                    'usuarios.email as email',
                    'usuarios.estado as estado',
                    'usuarios.usuario as usuario',
                    'usuarios.id_persona as persona_id',
                    'usuarios.super_administrador as super_administrador',
                    'usuarios.observaciones as observaciones',
                    'tipos_documentos.id AS tipo_documento',
                    'tipos_documentos.nombre AS n_tipo_documento',
                    'personas.numero_documento as numero_documento',
                    'personas.nombre as nombre',
                    'personas.apellido as apellidos'
                )
                ->orderBy('usuarios.id', 'desc');

        }else{
            $usuarios = ModelHasRol::join($this->nameDbCent.'.usuarios as users','model_has_roles.model_id','=','users.id')
                ->join($this->nameDbCent.'.aplicativos_usuario as depto_user','depto_user.id_usuario','=','users.id')
                ->join('roles','roles.id','=','model_has_roles.role_id')
                ->join($this->nameDbCent.'.personas as pers','users.id_persona','=', 'pers.id')
                ->join($this->nameDbCent.'.tipos_documentos as tip_doc','pers.tipo_documento','=','tip_doc.id')
                ->select('users.id',
                    'roles.id as idrol',
                    'roles.name as rol_nom',
                    'users.email as email',
                    'depto_user.estado as estado',
                    'users.usuario as usuario',
                    'users.id_persona as persona_id',
                    'users.observaciones as observaciones',
                    'tip_doc.id AS tipo_documento',
                    'tip_doc.nombre AS n_tipo_documento',
                    'pers.numero_documento as numero_documento',
                    'pers.nombre as nombre',
                    'pers.apellido as apellidos'
                )
                ->orderBy('users.id', 'desc')
                ->where('depto_user.id_aplicativo',session('conexion'));

                if ($buscar!='')
                {
                    $usuarios->where('pers.'.$criterio, 'ilike', '%'.$buscar.'%');
                }
        }

        return [
            'pagination' => [
                'total'        => $usuarios->paginate(10)->total(),
                'current_page' => $usuarios->paginate(10)->currentPage(),
                'per_page'     => $usuarios->paginate(10)->perPage(),
                'last_page'    => $usuarios->paginate(10)->lastPage(),
                'from'         => $usuarios->paginate(10)->firstItem(),
                'to'           => $usuarios->paginate(10)->lastItem(),
            ],
            'usuarios' => $usuarios->paginate(10),
            'super_administrador' => (Session('conexion') == 'centralizado' and Auth::user()->super_administrador == '1') ? true : false,
            'showSelectUser' => (Auth::user()->super_administrador == '1' or Auth::user()->hasRole('Administrador')) ? true : false,
        ];

    }

    public function store(Request $request)
    {

        if (!$request->ajax()) return redirect('/');

        $request->confirmado = filter_var($request->confirmado, FILTER_VALIDATE_BOOLEAN);
        $request->super_administrador = filter_var($request->super_administrador, FILTER_VALIDATE_BOOLEAN);
        $request->formCentralizado = filter_var($request->formCentralizado, FILTER_VALIDATE_BOOLEAN);

        if($request->IdUserCentralizado != null and $request->IdUserCentralizado != 'undefined')
        {
            $id_depto = AplicativosCentralizado::where('id',$request->session()->get('conexion'))->first();

            $validateUserDepto =  AplicativoUsuario::where('id_usuario', $request->IdUserCentralizado)->where('id_aplicativo',$id_depto->id)->first();

            if(!is_object($validateUserDepto))
            {
                try{
                    DB::beginTransaction();

                        $depto = new AplicativoUsuario();
                        $depto->id_aplicativo = $id_depto->id;
                        $depto->id_usuario      = $request->IdUserCentralizado;
                        $depto->save();

                        $user = User::findOrFail($request->IdUserCentralizado);
                        $user->assignRole($request->idRol);

                    DB::commit();
                    return ['status'  => 200];

                } catch (\Exception $e){
                    DB::rollBack();
                }

            }
        }

        if(!$request->confirmado)
        {
            $validacion = $this->validarUserCentralizado($request->usuario,$request->numero_documento,$request->session()->get('conexion'),$request->email,$request->super_administrador);

            if(!$validacion->status)
            {
                switch($validacion->code)
                {
                    case '400':
                        return [
                                'status'  => $validacion->code,
                                'message' => $validacion->message
                        ];
                    break;
                    default:
                        return ['status'  => $validacion->code];
                    break;
                }
            }
        }

        if($request->existente or $validacion->code == 201){

            $user = PersonaCentralizado::where('numero_documento',$request->numero_documento)->first();

            $id_depto = AplicativosCentralizado::where('id',$request->session()->get('conexion'))->first();

            $depto = new AplicativoUsuario();
            $depto->id_aplicativo = $id_depto->id;
            $depto->id_usuario      = $user->user->id;
            $depto->save();

            $user->user->assignRole($request->idRol);

        }else{
            try{
                DB::beginTransaction();

                $person = new PersonaCentralizado();
                $person->nombre           = $request->nombre;
                $person->apellido         = $request->apellidos;
                $person->tipo_documento   = $request->tipo_documento;
                $person->numero_documento = $request->numero_documento;
                $person->save();

                $user = new User();
                $user->id_persona           = $person->id;
                $user->usuario              = $request->usuario;
                $user->email                = $request->email;
                $user->password             = bcrypt( $request->password);
                $user->remember_token       = Str::random(64);
                $user->observaciones        = $request->observaciones;
                if($request->super_administrador and $request->idRol == 1){
                    $user->super_administrador  = 1;
                }
                $user->estado               = '1';
                $user->save();

                $password = new Password();
                $password->usuario_id   = $user->id;
                $password->password     = $user->password;
                $password->estado       = 1;
                $password->save();

                DB::commit();
            } catch (\Exception $e){
                DB::rollBack();
            }

            try{
                DB::beginTransaction();

                if($request->super_administrador)
                {
                    if($request->formCentralizado and $request->idRol == 2)
                    {
                        foreach($request->deptos_user as $key => $depto){

                            $dataDepto = AplicativosCentralizado::where('id', $depto)->first();
                            //se cambia la conexin dinamicamente
                            $this->changeDbDinamica(false,$dataDepto->nombre_db);

                            $validateUser =  ModelHasRol::where('model_id',$user->id)->first();

                            if(is_object($validateUser))
                            {
                                ModelHasRol::where('model_id', $user->id)
                                        ->update(['role_id' => 1]);

                            }else{
                                $new = new ModelHasRol();
                                $new->role_id    = '1';
                                $new->model_type = 'App\Models\User';
                                $new->model_id   = $user->id;
                                $new->save();

                                $validateUserDepto =  AplicativoUsuario::where('id_usuario',$user->id)->where('id_aplicativo',$dataDepto->id)->first();
                                if(!is_object($validateUserDepto))
                                {
                                    $newUserDepto = new AplicativoUsuario();
                                    $newUserDepto->id_aplicativo = $depto;
                                    $newUserDepto->id_usuario      = $user->id;
                                    $newUserDepto->save();
                                }
                            }
                        }


                    }else{
                        $deptos = AplicativosCentralizado::where('estado', 1)->get();

                        foreach($deptos as $depto)
                        {
                            $newUserDepto = new AplicativoUsuario();
                            $newUserDepto->id_aplicativo = $depto['id'];
                            $newUserDepto->id_usuario      = $user->id;
                            $newUserDepto->save();
                        }
                    }
                }else{
                    $id_depto = AplicativosCentralizado::where('id',$request->session()->get('conexion'))->first();

                    $depto = new AplicativoUsuario();
                    $depto->id_aplicativo = $id_depto->id;
                    $depto->id_usuario      = $user->id;
                    $depto->save();

                    $user->assignRole($request->idRol);
                }

                // $this->changeDbDinamica(true);

                DB::commit();
            } catch (\Exception $e){
                DB::rollBack();
            }
        }

        return ['status'  => 200];
    }

    public function update(Request $request)
    {

        $request->formCentralizado = filter_var($request->formCentralizado, FILTER_VALIDATE_BOOLEAN);
        $request->check_rol = filter_var($request->check_rol, FILTER_VALIDATE_BOOLEAN);

        // dd($request->all());
        if (!$request->ajax()) return redirect('/');

        $messages = [
            'numero_documento.required' => 'Número de documento es requerido.',
            'numero_documento.unique' =>'El Número de documento debe ser unico.',
            'email.required' => 'El Email es requerido.',
            'email.unique' => 'El Email debe ser único',
        ];

        $validated = $request->validate([
            'numero_documento' => 'required|unique:centralizado.personas,numero_documento,'.$request->persona_id,
            'email' => 'required|unique:centralizado.usuarios,email,'.$request->id,
        ],$messages);

        try{
            DB::beginTransaction();

            $persona = PersonaCentralizado::findOrFail($request->persona_id);
            $persona->nombre = $request->nombre;
            $persona->apellido = $request->apellidos;
            $persona->tipo_documento = $request->tipo_documento;
            $persona->numero_documento = $request->numero_documento;
            $persona->save();

            $user = User::findOrFail($request->id);
            $user->email = $request->email;
            $user->estado = '1';

            if(isset($request->password) && $request->password != null)
            {
                $user->password = bcrypt($request->password);
            }

            if(!$request->check_rol)
            {
                if($request->idRol != null and $request->idRol == 1 and $request->formCentralizado)
                {
                    $user->super_administrador = 1;

                    $deptos = AplicativosCentralizado::where('estado', 1)->get();

                    foreach($deptos as $depto)
                    {
                        $comprobarDepto = AplicativoUsuario::where('id_usuario','=',$user->id)
                                                            ->where('id_aplicativo',$depto['id'])
                                                            ->first();
                        if(!is_object($comprobarDepto))
                        {
                            $newUserDepto = new AplicativoUsuario();
                            $newUserDepto->id_aplicativo = $depto['id'];
                            $newUserDepto->id_usuario      = $user->id;
                            $newUserDepto->save();
                        }
                    }
                }
            }else{
                $user->super_administrador = 0;
            }

            $user->observaciones = $request->observaciones;
            $user->save();

            if(isset($request->password) && $request->password != null)
            {

                $inactiva = Password::where('usuario_id', $user->id)->where('estado','1')->first();
                if($inactiva){
                    $inactiva->estado = 0;
                    $inactiva->save();
                }

                $password = new Password();
                $password->usuario_id   = $request->id;
                $password->password     = $user->password;
                $password->estado       = 1;
                $password->save();

                $dataUser = [
                    'usuario'  => $user->usuario,
                    'password' => $request->password
                ];

                $dataUser = array('dataUser' => $dataUser);

                try{
                    Mail::send('correo.change_password', $dataUser, function($message) use ($user) {
                        $message->to($user->email);
                        $message->subject('Cambio de contraseña');
                    });

                }catch(\Exception $e){
                    return response()->json(['status' => false, 'email' => false]);
                    dd($e->getMessage());
                }

            }


            if(!$request->formCentralizado and ($request->idRol != null and $request->idRol))
            {
                $user->roles()->detach();
                $user->assignRole($request->idRol);
            }

            if($request->formCentralizado and $request->idRol == 2)
            {
                foreach($request->deptos_user as $key => $depto){

                    $dataDepto = AplicativosCentralizado::where('id', $depto)->first();
                    //se cambia la conexin dinamicamente
                    $this->changeDbDinamica(false,$dataDepto->nombre_db);

                    $validateUser =  ModelHasRol::where('model_id',$request->id)->first();

                    if(is_object($validateUser))
                    {
                        ModelHasRol::where('model_id', $request->id)
                                   ->update(['role_id' => 1]);

                    }else{
                        $validateUserDepto =  AplicativoUsuario::where('id_usuario',$request->id)->where('id_aplicativo',$dataDepto->id)->first();

                        if(!is_object($validateUserDepto))
                        {
                            $newUserDepto = new AplicativoUsuario();
                            $newUserDepto->id_aplicativo = $dataDepto->id;
                            $newUserDepto->id_usuario      = $request->id;
                            $newUserDepto->save();
                        }

                        $new = new ModelHasRol();
                        $new->role_id    = '1';
                        $new->model_type = 'App\Models\User';
                        $new->model_id   = $request->id;
                        $new->save();
                    }
                }

                $this->changeDbDinamica(true);
            }

            DB::commit();
            return response()->json(['status' => true]);
        } catch (\Exception $e){
            DB::rollBack();
        }
    }

    // termina funcion update
    public function inactivar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        if($request->tipo == '1'){

            $user = User::findOrFail($request->id);
            $user->estado = '0';
            $user->save();

            $user = AplicativoUsuario::where('id_usuario',$request->id)
                                        ->where('id_aplicativo',$request->session()->get('conexion'))
                                        ->first();
            $user->estado = '0';
            $user->save();
        }else if($request->tipo == '2'){

            $user = User::findOrFail($request->id);
            $user->estado = '0';
            $user->save();

            $deptos = AplicativoUsuario::where('id_usuario',$request->id)
                                        ->get();

            foreach($deptos as $depto){
                $user = AplicativoUsuario::where('id_usuario',$request->id)
                                            ->where('id_aplicativo',$depto->id_aplicativo)
                                            ->first();
                $user->estado = '0';
                $user->save();

            }
        }
    }

    public function activar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        if($request->tipo == '1'){

            $user = User::findOrFail($request->id);
            $user->estado = '1';
            $user->save();

            $user = AplicativoUsuario::where('id_usuario',$request->id)
                                        ->where('id_aplicativo',$request->session()->get('conexion'))
                                        ->first();
            $user->estado = '1';
            $user->save();
        }else if($request->tipo == '2'){

            $user = User::findOrFail($request->id);
            $user->estado = '1';
            $user->save();

            $deptos = AplicativoUsuario::where('id_usuario',$request->id)
                                        ->get();

            foreach($deptos as $depto){
                $user = AplicativoUsuario::where('id_usuario',$request->id)
                                            ->where('id_aplicativo',$depto->id_aplicativo)
                                            ->first();
                $user->estado = '1';
                $user->save();

            }
        }
    }

    public function getTipoDoc()
    {
        $tipos_doc = TipoDocumento::where('estado', 1)->get();
        return ['tipos_doc' => $tipos_doc];
    }

    public function getUsuarioActivo()
    {
        $usuarioActivo = Auth::user();
        return ['usuarioActivo' => $usuarioActivo];
    }

    public function cambiarContraseña(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $respuesta = [ 'exito' => false, 'errores' => [], 'valor' => [] ];
        $user = Auth::user();
        // valida la contraseña actual con la que hay en el sistema
        $validaIgual = Hash::check($request->contrasenaActual, $user->password);
        if(!$validaIgual){
            $respuesta['errores'][] = 'La contraseña actual no corresponde!';
            $respuesta['valor'][] = 1;
            return $respuesta;
        }

        // valida las 10 ultimas contraseñas
        $ultimosPass = Password::where('usuario_id', $user->id)->orderBy('id','desc')->limit(10)->get();
        foreach ($ultimosPass as $pass) {
            $validaAnteriores = Hash::check($request->contrasenaNueva, $pass->password);
            if($validaAnteriores == 1){
                $respuesta['errores'][] = 'La contraseña Nueva fue utilizada anteriormente!';
                $respuesta['valor'][] = 2;
                return $respuesta;
            }
        }

        // cambia la contraseña y la agrega al password_log
        try {
            DB::beginTransaction();
                $usuario = User::where('id', $user->id)->first();
                $usuario->password = bcrypt( $request->contrasenaNueva );
                $usuario->estado   = 1;
                $usuario->save();

                $inactiva = Password::where('usuario_id', $user->id)->where('estado','1')->first();
                if($inactiva){
                    $inactiva->estado = 0;
                    $inactiva->save();
                }

                $password = new Password();
                $password->usuario_id   = $user->id;
                $password->password     = $usuario->password;
                $password->estado       = 1;
                $password->save();

                $dataUser = [
                    'usuario'  => $user->usuario,
                    'password' => $request->contrasenaNueva
                ];

                $dataUser = array('dataUser' => $dataUser);
                try{
                    Mail::send('correo.change_password', $dataUser, function($message) use ($user) {
                        $message->to($user->email);
                        $message->subject('Cambio de contraseña');
                    });

                }catch(\Exception $e){
                    $respuesta['errores'][] = 'Por favor verifique los campos y/o su conexión e intentélo de nuevo.';
                    return $respuesta;
                }

                $respuesta['exito'] = true;
            DB::commit();
        } catch (\Exception $e){
            DB::rollBack();
            $respuesta['errores'][] = 'Por favor verifique los campos y/o su conexión e intentélo de nuevo.';
        }
        return $respuesta;

    }

    public function validarUserCentralizado($usuario,$documento,$depto,$email,$super_administrador){

        $response = (object)[
            'status'  => false,
            'code'    => 400,
            'message' => ''
        ];

        $validarSql = (object)[
            'status' => false,
            'type'   => ''
        ];

        //se busca al usuario por campo usuario
        $validacion = User::where('usuario',$usuario)->first();

        if(is_object($validacion)){
            $validarSql->status = true;
            $validarSql->type   = 'usuario';
        }else{
             //se busca al usuario por campo email
            $validacion = User::where('email',$email)->first();
            if(is_object($validacion)){
                $validarSql->status = true;
                $validarSql->type   = 'email';
            }
        }

         //en caso de que el usuario ya exista
        if($validarSql->status)
        {
            if($super_administrador){
                //se le retorna diciendo que usuario ya existe en el centralizado
                $response->code = 405;
                return $response;
            }
            // se valida que el documento sea igual que el ingresado
            if($validacion->persona->numero_documento == $documento)
            {

                //se trae el id del departamento actual
                $id_depto = AplicativosCentralizado::where('id',$depto)->first();
                $responseDepto = false;


                foreach($validacion->aplicativos as $deptos){
                    if($deptos->id_aplicativo == $id_depto->id)
                    {
                        //en caso de que el usuario ya este asociado a ese depto
                        $responseDepto = true;
                    }
                }

                if($responseDepto)
                {
                    //se retorna y se le dice que ya se encuentra registrado
                    $response->status  = false;
                    $response->code    = 402;
                }else{
                    //se retorna y se le agrega este departamento
                    $response->status  = true;
                    $response->code    = 201;
                }

            }else{
                //en caso de que no exista se retorna
                if($validarSql->type == 'usuario'){
                    //se le dice que el usaurio ya existe
                    $response->code    = 401;
                }else if($validarSql->type == 'email'){
                    //se le dice que el email ya existe
                    $response->code    = 407;
                }
            }

            $response->message = $validacion->aplicativos;

        }else{
            //se valida si existe por numero de documento
            $validacion = PersonaCentralizado::where('numero_documento',$documento)->first();

            //si existe ese numero de documento
            if(is_object($validacion))
            {
                if($super_administrador){
                    //se le dice que Número de documento ya registrado en el Centralizado.
                    $response->code = 406;
                    return $response;
                }

                $id_depto = AplicativosCentralizado::where('id',$depto)->first();
                $responseDepto = false;

                foreach($validacion->user->aplicativos as $deptos){
                    if($deptos->id_aplicativo == $id_depto->id)
                    {
                        //se valida si ya existe en ese departamento
                        $responseDepto = true;
                    }
                }

                if($responseDepto)
                {
                    // se le dice que documento registrado ya
                    $response->code    = 403;
                }else{
                    // se le vuelve a preguntar que ya existe un usuario con ese documento pero difernete usuario
                    // que si desea agregarle este departamento a ese usuario
                    $response->code    = 400;
                }

            }else{
                //si no existe se procede a guardarlo
                $response->status  = true;
                $response->code    = 200;
            }
        }
        return $response;

    }

    public function changeDbDinamica($estado, $nameDb = ''){

        if($estado){
            \Config::set('database.default','centralizado');
            DB::purge('dinamico');
            DB::reconnect('dinamico');
        }else{
            DB::purge('dinamico');
            \Config::set('database.connections.dinamico.database',$nameDb);
            \Config::set('database.default','dinamico');
            DB::purge('centralizado');
            DB::reconnect('centralizado');
        }

    }

    public function getDeptoUser(Request $request){
        $deptos_user = AplicativoUsuario::where('id_usuario',$request->id)->get();
        if(is_object($deptos_user))
        {
            foreach($deptos_user as $depto){

                $dataDepto = AplicativosCentralizado::where('id', $depto->id_aplicativo)->where('estado','1')->first();
                //se cambia la conexin dinamicamente
                if(is_object($dataDepto))
                {
                    $this->changeDbDinamica(false,$dataDepto->nombre_db);
                }

                $validateUser =  ModelHasRol::where('model_id',$request->id)->first();
                if(is_object($validateUser))
                {
                    $depto['id_rol'] = $validateUser->role_id;
                }
            }
        }
        return $deptos_user;
    }

    public function getUserCentralizado(Request $request){

        $user = User::join('aplicativos_usuario','aplicativos_usuario.id_usuario','usuarios.id')
                    ->leftJoin('aplicativos_usuario as departamento_actual',function($query) use($request){
                        return $query->on('departamento_actual.id_usuario','usuarios.id')
                                     ->where('departamento_actual.id_aplicativo',$request->session()->get('conexion'));
                    })
                    ->join('personas','personas.id','usuarios.id_persona')
                    ->join('tipos_documentos','tipos_documentos.id','personas.tipo_documento')
                    ->select('usuarios.id','personas.nombre as npersona','personas.apellido','tipos_documentos.nombre','personas.numero_documento',
                            'usuarios.usuario','usuarios.email',
                            DB::raw("CONCAT(personas.nombre,' ( ',tipos_documentos.nombre,' - ',personas.numero_documento,')') as dato_com")
                            )
                    ->where('usuarios.super_administrador','!=',1)
                    ->whereNull('departamento_actual.id')
                    ->groupBy('aplicativos_usuario.id_usuario','usuarios.id','tipos_documentos.nombre','personas.nombre','personas.numero_documento','dato_com','personas.apellido',
                            'usuarios.usuario','usuarios.email')
                    ->get();

        return $user;
    }

    public function cargueArchivo(Request $request)
    {
        $respuesta = [
            'estado'   => 0,
            'mensajes' => []
        ];

        $ruta = 'excelUsuarios/' . $request->archivo->getClientOriginalName();
        $nombre = $request->archivo->getClientOriginalName();

        $extension  = substr($nombre, strripos($nombre, "."), 10);
        if ($extension != '.xlsx' and $extension != '.xls') {
            $respuesta['mensajes'][] = 'El archivo NO puede ser diferente a excel (.xlsx, .xls)';
        }

        if (file_exists(public_path('excelUsuarios/' . $nombre))) {
            $x = true;
            $i = 1;
            $buscarCaracter = strripos($nombre, ".");
            $extension = substr($nombre, $buscarCaracter, 10);
            $nombrefile = substr($nombre, 0, $buscarCaracter);

            while ($x == true) {
                if (!file_exists(public_path('excelUsuarios/' . $nombrefile . "($i)" . $extension))) {
                    $nombre = $nombrefile . "($i)" . $extension;
                    $ruta = 'excelUsuarios/' . $nombre;
                    $x = false;
                }
                $i++;
            }
        }

        $request->archivo->move(public_path('excelUsuarios'), $nombre);

        $campos = ['Nombre', 'Apellidos', 'Tipo Documento',  'N Documento', 'Nombre usuario',  'Email' ,  'Observaciones'];

        try {
            $dato = Excel::toArray([], $ruta); //nos toca cambiar esto :)
        } catch (\Exception $e) {
            $respuesta['mensajes'][] = 'Error al procesar Excel, no se han podido leer los datos';
        }

        # Se tome la primera hoja
        $dato = $dato[0];
        # Se borra la fila de nombres
        unset($dato[0]);

        $arrayUsuario = [];

        foreach ($dato as $indice => $renglon)
        {
            if(!isset($renglon[0]) || trim($renglon[0]) == '')
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[0].' es requerido';
            if(!isset($renglon[1]) || trim($renglon[1]) == '')
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[1].' es requerido';
            if(!isset($renglon[2]) || trim($renglon[2]) == '')
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[2].' es requerido';
            if(!isset($renglon[3]) || trim($renglon[3]) == '')
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[3].' es requerido';
            if(!isset($renglon[4]) || trim($renglon[4]) == '')
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[4].' es requerido';

            //hacemos las validaciones
            if(!isset($renglon[5]) || trim($renglon[5]) == '')
            {
                $respuesta['mensajes'][] = 'El archivo en la linea: '.$indice.' el campo '.$campos[5].' es requerido';
            }
            else
            {
                $user = User::where('usuario',$renglon[5])->first();

                if($user)
                {
                    $respuesta['mensajes'][] = 'El usuario '.$renglon[5].' ya se encuentra registrado en el sistema';
                }
            }

            if(!isset($renglon[6]) || trim($renglon[6]) == '')
            {
                $respuesta['mensajes'][] = 'El archivo en el campo '.$campos[$renglon[6]].' es requerido';
            }
            else
            {
                $user = User::where('email',$renglon[6])->first();

                if($user)
                {
                    $respuesta['mensajes'][] = 'El email '.$renglon[6].' ya se encuentra registrado en el sistema';
                }
            }

            if(isset($renglon[0]) && isset($renglon[1]) && isset($renglon[2]) && isset($renglon[3]))
            {
                //buscamos si ya existe el usuario
                $person = PersonaCentralizado::where('numero_documento', $renglon[3])
                ->first();

                if(!$person)
                {
                    $person = new PersonaCentralizado();
                    $person->nombre           = strtoupper($renglon[0]);
                    $person->apellido         = strtoupper($renglon[1]);
                    $person->tipo_documento   = $renglon[2];
                    $person->numero_documento = $renglon[3];
                    $person->save();
                }
            }

            if(isset($renglon[5]) && isset($renglon[6]) && isset($renglon[4]) && isset($renglon[7]))
            {
                $arrayUsuario[] = [
                    'id_persona'    => $person->id,
                    'usuario'       => $renglon[5],
                    'email'         => $renglon[6],
                    'planta'        => $renglon[4],
                    'password'      => bcrypt('123456789'),
                    'observaciones' => $renglon[7],
                    'estado'        => '1',
                ];
            }
        }

        if(count($respuesta['mensajes']) == 0)
        {
            $countUser = 0;
            foreach ($arrayUsuario as $arr)
            {
                $user = User::create($arr);

                $deptos = AplicativosCentralizado::where('estado', 1)->get();

                foreach ($deptos as $depto) {

                    $comprobarDepto = AplicativoUsuario::where('id_usuario', '=', $user->id)
                        ->where('id_aplicativo', $depto['id'])
                        ->first();

                    if (!is_object($comprobarDepto)) {
                        $newUserDepto = new AplicativoUsuario();
                        $newUserDepto->id_aplicativo = $depto['id'];
                        $newUserDepto->id_usuario      = $user->id;
                        $newUserDepto->save();
                    }
                }

                $user->roles()->detach();
                $user->assignRole('supervisor_impresion');

                $password = new Password();
                $password->usuario_id   = $user->id;
                $password->password     = $user->password;
                $password->estado       = 1;
                $password->save();

                $countUser++;
            }

            $respuesta['estado'] = 1;
            $respuesta['mensajes'][] = 'Se registraron exitosamente '.$countUser. ' Usuarios';

            File::delete('excelUsuarios/' . $nombre);
        }

        return $respuesta;
    }
}
