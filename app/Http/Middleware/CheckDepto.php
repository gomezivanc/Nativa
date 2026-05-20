<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckDepto
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $conexion = $request->session()->get('conexion');
        $deptos   = $request->session()->get('aplicativos');
        $response = false;

        if($deptos != null)
        {
            foreach($deptos as $key){
                if($key->id == $conexion){
                    $response = true;
                }
            }
        }else{
            return redirect('/centralizado')->with('sin_permisos','No tiene Autorizado este Aplicativo!');
        }

        if(Auth::user()->super_administrador == '0'){
            if(!$response){
                return redirect('/centralizado')->with('sin_permisos','No tiene Autorizado este Aplicativo!');
            }
        }

        return $next($request);
    }
}
