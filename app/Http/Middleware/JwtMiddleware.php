<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Illuminate\Support\Facades\Redirect;
use App\Helpers\Equivalencias;

class JwtMiddleware extends BaseMiddleware
{

    public function __construct(){
        $this->rutaProduccion = Equivalencias::urlProduccion();
    }

    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            // dd($e);
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return Redirect::to($this->rutaProduccion.'token/Token de seguridad Invalido');

            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return Redirect::to($this->rutaProduccion.'token/token ha expirado');

            }else{
                return Redirect::to($this->rutaProduccion.'token/Token de seguridad no encontrado!');
                return response()->json(['status' => 'Authorization Token not found']);
            }
            // dd($e);
        }
        return $next($request);
    }
}