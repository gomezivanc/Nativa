<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\AplicativoUsuario;
use App\Models\AplicativosCentralizado;
use App\Helpers\Equivalencias;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use JWTAuth;
use JWTFactory;
use Inertia\Inertia;

class CentralizadoController extends Controller
{
    protected $rutaProduccion;

    public function __construct()
    {
        $this->rutaProduccion = Equivalencias::urlProduccion();
    }

    public function index()
    {
        return Redirect::to($this->rutaProduccion . 'centralizadoRedirect');
    }

    public function getDeptos($id)
    {
        $deptos = AplicativoUsuario::join('tenants', 'tenants.id', '=', 'aplicativos_usuario.id_aplicativo')
            ->where('aplicativos_usuario.id_usuario', $id)
            ->where('tenants.estado', '1')
            ->where('aplicativos_usuario.estado', '1')
            ->select('tenants.id', 'tenants.url_logo', 'tenants.data', 'aplicativos_usuario.id_aplicativo')
            ->orderBy('tenants.id', 'asc')
            ->get();

        session(['aplicativos' => json_decode(json: $deptos)]);
        return json_decode($deptos);
    }

    function getFile(Request $request) {
        $path = $request->path;  // Obtener el path del archivo desde el request
        $filePath = storage_path('app/public/' . $path);  // Obtener la ruta completa del archivo

        if (!file_exists($filePath)) {
            abort(404);
        }

        if ($request->has('preview')) {
            return response()->file($filePath);
        }

        return response()->download($filePath,basename($path));  // Descargar el archivo con su nombre original
    }


    public function change(Request $request, $userId, $conexion, $token)
    {
        if (!$this->validateSesion($token, $userId)) {
            Auth::logout();
            $request->session()->invalidate();
            return Redirect::to($this->rutaProduccion . '?token=true')->with('sin_permisos_token', 'Error en el token para Acceder!');
        }
        Auth::loginUsingId($userId, true);

        $depto = AplicativosCentralizado::where('id', operator: $conexion)->first();
        $activeDepto = AplicativoUsuario::join('usuarios', 'usuarios.id', '=', 'aplicativos_usuario.id_usuario')
            ->where('aplicativos_usuario.id_usuario', Auth::id())
            ->where('aplicativos_usuario.id_aplicativo', $depto->id)
            ->select('aplicativos_usuario.estado')
            ->first();

        // if ($activeDepto->estado == '0') {
        //     $error = 'Usuario Inactivo en el Aplicativo <b>(' . $depto->nombre . ')</b>';
        //     return back()->with('activeDepto', $error);
        // }

        session([
            'conexion'      => $conexion,
            'nombre_db'     => tenant()->database()->tenant->tenancy_db_name,
            'url_produccion' => tenant()->database()->tenant->domain . tenant()->database()->tenant->domain_true
        ]);
        return redirect("/main");
    }


    public function loginRedirect($conexion)
    {

        $depto = AplicativosCentralizado::where('id', $conexion)->first();
        $userId = Auth::user()->id;
        $token = session('token_user');
        return redirect($depto->url_produccion . 'autologin/' . $userId . '/' . $conexion . '/' . $token, 302, [
            'Authorization' => "Bearer {$token}"
        ]);
    }

    private function validateSesion($token, $userId)
    {
        $response = (object)[
            'status' => false
        ];

        $tokenParts = explode(".", $token);
        $tokenHeader = base64_decode($tokenParts[0]);
        $tokenPayload = base64_decode($tokenParts[1]);
        $jwtHeader = json_decode($tokenHeader);
        $jwtPayload = json_decode($tokenPayload);
        $data = $jwtPayload->myCustomObject;
        if ($data->id != $userId) {
            return $response->status = false;
        }

        $user = User::where('id', $userId)->first();

        if (!is_object($user)) {
            return $response->status = false;
        }

        return $response;
    }

    public function getViewCentralizado()
    {
        $payload = JWTFactory::sub(Auth::user()->id)
            ->myCustomObject(Auth::user())
            ->make();

        $token = JWTAuth::encode($payload);
        session(['token_user' => $token]);

        $data =  $this->getDeptos(Auth::id());
        return view('lobby/index', ['data' => $data]);
    }

    public function redirectCentralizado(Request $request)
    {
        //Auth::logout();
        $request->session()->invalidate();
        return Redirect::to($this->rutaProduccion . 'centralizado');
    }
    
    public function getViewValidateCode()
    {
        return Inertia::render('ValidateCode');
    }
}
