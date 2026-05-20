<?php
namespace App\Http\Controllers;

use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\PasswordResetApp;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function create(Request $request)
    { 
        $login  = request()->getContent();
        $request = new Request(['email' => $login]);

    	$validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users_app,email',
        ],
        [
            'email.required' => 'El campo email es requerido',
            'email.email'    => 'El campo email es debe ser de tipo email',
            'email.exists'   => 'Este email no esta registrado'
        ]);
 
        if ($validator->fails()) 
        {
        	return response()->json([
	            'status'  => false,
                'message' => $validator->messages()
            ]);
        }

        $user = UserApp::where('email', $request->email)->first();


        $passwordReset = PasswordResetApp::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Str::random(60)
            ]
        );
        dd($passwordReset);
    	if ($user && $passwordReset)
    	{
            $user->notify(
                new PasswordResetRequest($passwordReset->token)
            );

	        return response()->json([
	            'status' => true,
                'message'=> ['email' => ['Se ha enviado un correo.']],
	            'email'  => $login,
	            'token'  => $passwordReset->token
	        ]);
    	}
    }

    /**
     * Find token password reset
     *
     * @param  [string] $token
     * @return [string] message
     * @return [json] passwordReset object
     */
    public function find($token)
    {
        $passwordReset = PasswordResetApp::where('token', $token)
            ->first();

        if (!$passwordReset)
        {
            dd('El token es invalido!');
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) 
        {
            $passwordReset->delete();
            dd('El token ha expirado, por favor reestablezca su contraseña de nuevo');
        }

        $email = $passwordReset->email;
        $ruta  = 'password.resetapp';

        return view('auth.change_password', compact(['email', 'token', 'ruta']));
    }

     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reset(Request $request)
    {
        $passwordReset = PasswordResetApp::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();

        if (!$passwordReset)
        {
            dd('El token es invalido!');
        }

        $user = UserApp::where('email', $passwordReset->email)->first();

        if (!$user){
            dd('No hemos podido encontrar la dirección de correo, verifique nuevamente!');
        }
        
        $user->password = bcrypt($request->password1);
        $user->save();
        $passwordReset->delete();
        //$user->notify(new PasswordResetSuccess($passwordReset));
        return redirect()->route('recovery')->with('exito', 'Se ha cambiado la contraseña con exito!');
    }
}