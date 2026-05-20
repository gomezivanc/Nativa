<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
// use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;


class CheckSesion 
{
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::check()){
            Auth::logout();
            $request->session()->invalidate();
            return redirect('/')->with('sesion_finalizada','Sesion Finalizada Correctamente!');
        }

        return $next($request);
    }

}
