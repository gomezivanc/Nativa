<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class RouteController extends Controller
{
    function index(Request $request){
        $routes = Route::getRoutes();
        $q = $request->input('q');
        $v = $request->input('v');
        $routeList = [];
        foreach($routes as $route){
            $rn = explode('.',$route->getName());
            $action = $rn[0];
            if(isset($rn[1]))
                $action = $rn[1];
            if(!empty($route->getName()) && (stripos($route->getName(),$q)!==false || $route->getName()==$v) && !in_array($action,['store','show','update','all']) && !in_array($route->getName(),['login','register'])) {
                $routeList[] = [
                    'name' => $route->getName(),
                    'id' => $route->getName(),
                ];
            }
        }
        return response()->json($routeList);
    }
}
