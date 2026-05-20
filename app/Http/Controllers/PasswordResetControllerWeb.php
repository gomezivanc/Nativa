<?php

namespace App\Http\Controllers;

use App\Notifications\PasswordResetRequestWeb;
use App\Notifications\PasswordResetSuccess;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\PasswordReset;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PasswordResetControllerWeb extends Controller
{
    public function create(Request $request)
    { 
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:usuarios,email',
        ],
        [
            'email.required' => 'El campo correo electrónico es requerido',
            'email.email'    => 'El campo correo electrónico debe ser de tipo email.',
            'email.exists'   => 'Este correo electrónico no esta registrado'
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
    
        $user = User::where('email', $request->email)->first();
        $passwordReset = PasswordReset::where('email',$user->email)->first();
        $token = Str::random(60);

        if(is_object($passwordReset)){
            $passwordReset = PasswordReset::where('email', $user->email) ->update(['email' => $user->email, 'token' => $token, 'created_at' => now() ]);
        }
        else{
            $passwordReset =  DB::table('password_resets')->insert(['email' => $user->email,'token' => $token]);  
        }

    	if ($user && $passwordReset){
            $user->notify(new PasswordResetRequestWeb($token));
            return redirect()->route('showlogin')->with('message', 'Se ha enviado un correo para recuperar tu contraseña');            
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
        $passwordReset = DB::table('password_resets')
            ->where('token', $token)
            ->first();

        if (!$passwordReset) {
            abort(404, 'El token es inválido');
        }

        if (Carbon::parse($passwordReset->created_at)->addMinutes(720)->isPast()) {
            DB::table('password_resets')->where('email', $passwordReset->email)->delete();
            abort(419, 'El token ha expirado');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $passwordReset->email,
            'token' => $token,
        ]);
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
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'contrasena' => 'required|confirmed|min:6',
        ]);

        $passwordReset = DB::table('password_resets')->where('email', $request->email)->where('token', $request->token)->first();

        if (!$passwordReset) {
            return back()->with('error', 'Token inválido');
        }

        User::where('email', $request->email)->update([
            'password' => bcrypt($request->contrasena)
        ]);

        DB::table('password_resets')->where('email', $request->email)->delete();

        return redirect()->route('showlogin')->with('message', 'Contraseña actualizada correctamente');
    }
}
