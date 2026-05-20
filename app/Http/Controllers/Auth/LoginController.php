<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\LogUserLogin;
use App\Models\User;
use JWTAuth;
use JWTFactory;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Redirect;
use App\Helpers\Equivalencias;
use App\Mail\NotificacionValidateCode;
use App\Models\ValidateCode;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class LoginController extends Controller
{

    protected $rutaProduccion;

    public function __construct()
    {
        $this->rutaProduccion = Equivalencias::urlProduccion();
        $this->middleware('translates');
    }

    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    public function showLoginFormRedirect(Request $request, $error)
    {
        Auth::logout();
        $request->session()->invalidate();
        return redirect("/")->with('error_token', $error);
    }

    public function login(Request $request)
    {
        $this->validateLogin($request);

        // $g_response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
        //     'secret' => env('RECAPTCHAV3_SECRET'),
        //     'response' => $request->input('g_recaptcha_response'),
        //     'remoteip' => $request->ip()
        // ]);
        // $responseData = $g_response->json();
        // if (!$responseData['success'] || $responseData['score'] < 0.5) {
        //     return back()->withErrors(['error' => 'Usted Parece Un Bot.']);
        if (false) {
            return back()->withErrors(['error' => 'Usted Parece Un Bot.']);
        } else {
            $user = User::where('usuario', $request->usuario)->first();

            if (isset($user)) {

                if ($user->intentos_login == 10) {
                    return back()->withErrors(['error' => 'Usuario bloqueado']);
                }

            } else {
                return back()->withErrors(['error' => 'El usuario no existe']);
            }

            if (Auth::attempt(['usuario' => $request->usuario, 'password' => $request->password])) {
                
                // if (Auth::user()->estado == 1) {
                //     $fecha_actual = date('Y-m-d H:i:s');
                //     $fecha_final = date('Y-m-d H:i:s', strtotime($fecha_actual . ' +3 minutes'));

                //     $validar_estado = ValidateCode::where('id_usuario', Auth::user()->id)->first();
                //     $codigo_enviar = rand(9999999, 99999999);
                //     //dd($validar_estado, $codigo_enviar);
                //     if ($validar_estado === null) {
                //         $agregar_codigo = new ValidateCode();
                //         $agregar_codigo->codigo_validate = Hash::make($codigo_enviar);
                //         $agregar_codigo->id_usuario      = Auth::user()->id;
                //         $agregar_codigo->fecha_inicio    = $fecha_actual;
                //         $agregar_codigo->fecha_fin       = $fecha_final;
                //         $agregar_codigo->estado          = 1;
                //         $agregar_codigo->save();
                //     } else {
                //         $validar_estado->update([
                //             'codigo_validate' => Hash::make($codigo_enviar),
                //             'estado'          => 1,
                //             'fecha_inicio'    => $fecha_actual,
                //             'fecha_fin'       => $fecha_final,
                //         ]);
                //         $validar_estado->save();
                //     }

                //     $data = [
                //         'usuario' => Auth::user()->usuario,
                //         'codigo'  => $codigo_enviar,
                //         'aplicacion' => env('APP_NAME'),
                //     ];

                //     try {
                //         Mail::to(Auth::user()->email)->send(new NotificacionValidateCode($data));
                //     } catch (\Exception $e) {
                //         throw $e;
                //         Auth::logout();
                //         return back()->withErrors(['error' => 'Por favor verifique los campos y/o su conexión e intentélo de nuevo.']);
                //     }


                //     $new = User::findOrFail(Auth::user()->id);
                //     $new->ultimo_login = Carbon::now()->toDateTimeString();
                //     $new->ultimo_login_ip = $request->getClientIp();
                //     $new->save();
                //     $this->logUserLogin($request);


                //     $code_validation = ValidateCode::where('id_usuario', Auth::user()->id)
                //         ->where('estado', true)
                //         ->first();
                //     if ($code_validation->estado === 1) {
                //         return redirect()->route('codeVerify');
                //     }
                // }
                return Redirect::to('/main');

                Auth::logout();
                return back()->withErrors(['error' => 'Usuario inactivo']);
            } else {
                return back()->withErrors(['error' => 'Credenciales incorrectas']);
            }
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer'
        ])->withCookie(cookie('access_token', $token));
    }

    protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            'usuario'   => 'required|string',
            'password'  => 'required|string',
            // 'g_recaptcha_response' => 'required'
        ]);
    }

    public function logout(Request $request)
    { //cerrar sesion
        Auth::logout();
        $request->session()->invalidate();
        $url = $this->rutaProduccion . '';
        return Redirect::to($url);
        // return redirect('/');
    }

    public function recovery()
    { //carga el color del boton y el escudo a la vista recovery(necesaria?)       
        return Inertia::render('Auth/Recovery', [
            'status' => session('status'),
        ]);
    }

    public function logUserLogin(Request $request)
    {

        $new = new LogUserLogin();
        $new->id_usuario    = Auth::user()->id;
        $new->fecha_login   = Carbon::now()->toDateTimeString();
        $new->ip_login      = $request->getClientIp();
        $new->save();
    }

    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        return response()->json(compact('user'));
    }

    public function ResendCode(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $fecha_actual = date('Y-m-d H:i:s');
        $idser = Auth::user()->id;
        $newUser = User::where('id', $idser)->first();
        $fecha_final = date('Y-m-d H:i:s', strtotime($fecha_actual . ' +3 minutes'));
        $codes = ValidateCode::where('id_usuario', Auth::user()->id)
            ->where('fecha_inicio', '<=', $fecha_actual)
            ->where('fecha_fin', '>=', $fecha_actual)->where('estado', 0)
            ->first();

        if (Auth::user()->id) {
            if ($codes) {
                if ($codes->fecha_fin < $fecha_actual) {
                    ValidateCode::where('id_usuario', Auth::user()->id)->where('estado', 0)->update(['estado' => 1]);
                }
            }
        }

        $validar_estado = ValidateCode::where('id_usuario', Auth::user()->id)->first();
        $codigo_enviar = rand(9999999, 99999999);

        if ($validar_estado === null) {
            $agregar_codigo = new ValidateCode();
            $agregar_codigo->codigo_validate = bcrypt($codigo_enviar);
            $agregar_codigo->id_usuario      = Auth::user()->id;
            $agregar_codigo->fecha_inicio    = $fecha_actual;
            $agregar_codigo->fecha_fin       = $fecha_final;
            $agregar_codigo->estado          = 1;
            $agregar_codigo->save();
        } else {
            ValidateCode::where('id_usuario', Auth::user()->id)->where('estado', 1)->update(['codigo_validate' => bcrypt($codigo_enviar)]);
        }

        $dataSendCode = [
            'usuario' => $newUser->usuario,
            'codigo'  => $codigo_enviar,
            'aplicacion'  =>  env('APP_NAME'),
        ];

        $dataSendCode = array('data' => $dataSendCode);

        try {
            Mail::send('Email.notificacionValidateCode', $dataSendCode, function ($message) use ($newUser) {
                $message->to($newUser->email);
                $message->subject('Código Verificación');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Por favor verifique los campos y/o su conexión e intentélo de nuevo.']);
        }

        return back()->with('success', 'El Código Fue Enviado Exitosamente.');
    }

    public function validateCodes(Request $request)
    {
        try {
            // Concatenar el código de validación desde los inputs
            $validation_code = collect(range(1, 8))
                ->map(function ($i) use ($request) {
                    $field_name = 'codigoVerificacion' . $i;
                    return $request->input($field_name, '');
                })
                ->implode('');

            // Verificar si el código tiene la longitud esperada
            if (strlen($validation_code) !== 8) {
                return back()->withErrors(['error' => 'El código de validación debe tener 8 dígitos.']);
            }

            // Buscar el código de validación activo
            $savedkey = ValidateCode::where('id_usuario', Auth::user()->id)
                ->where('estado', 1)
                ->first();

            // dd($savedkey);
            if (!$savedkey) {
                return back()->withErrors(['error' => 'No se encontró un código de validación activo para este usuario.']);
            }
            // Verificar si el código ingresado coincide con el almacenado
            if (!Hash::check($validation_code, $savedkey->codigo_validate)) {
                return back()->withErrors(['error' => 'El código ingresado no es válido.']);
            }

            // Marcar el código como usado
            $savedkey->update(['estado' => false]);
            //dd($this->rutaProduccion);
            // Redirigir al usuario
            return Redirect::to('/main');
        } catch (\Exception $e) {
            // Registrar el error en los logs
            \Log::error('Error en la validación del código: ' . $e->getMessage());

            return back()->withErrors(['error' => 'Ocurrió un error durante la validación del código. Por favor, inténtelo de nuevo.']);
        }
    }
}
