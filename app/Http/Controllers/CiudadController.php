<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ciudad;

class CiudadController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $buscar = $request->buscar;
        $criterio = $request->criterio;

        if ($buscar==''){
            $ciudades = Ciudad::join('departamentos','ciudades.id_departamento','=','departamentos.id')
            ->select('ciudades.id','ciudades.id_departamento','ciudades.nombre','departamentos.nombre as departamento','ciudades.estado')
            ->orderBy('ciudades.id', 'desc')->paginate(10);
        }
        else{
            $ciudades = Ciudad::join('departamentos','ciudades.id_departamento','=','departamentos.id')
            ->select('ciudades.id','ciudades.id_departamento','ciudades.nombre','departamentos.nombre as departamento','ciudades.estado')
            ->where('ciudades.'.$criterio, 'like', '%'. $buscar . '%')
            ->orderBy('ciudades.id', 'desc')->paginate(10);
        }

        return [
            'pagination' => [
                'total'        => $ciudades->total(),
                'current_page' => $ciudades->currentPage(),
                'per_page'     => $ciudades->perPage(),
                'last_page'    => $ciudades->lastPage(),
                'from'         => $ciudades->firstItem(),
                'to'           => $ciudades->lastItem(),
            ],
            'ciudades' => $ciudades
        ];
    }
    
    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $ciudad = new Ciudad();
        $ciudad->id_departamento = $request->iddepartamento;
        $ciudad->nombre = $request->nombre;
        $ciudad->estado = '1';
        $ciudad->save();
    }

    public function update(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $ciudad = Ciudad::findOrFail($request->id);
        $ciudad->id_departamento = $request->iddepartamento;
        $ciudad->nombre = $request->nombre;
        $ciudad->estado = '1';
        $ciudad->save();
    }

    public function selectCiudad( Request $request){
        if (!$request->ajax()) return redirect('/');
        $data = Ciudad::where('id_departamento','=',$request->id_departamento)->where('estado', 1)
        ->select('id as id_ciudad','nombre as nom_ciudad')->orderBy('nombre', 'asc')->get()->toArray();

        return ['ciudades' => $data];
    }

    public function inactivar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $ciudad = Ciudad::findOrFail($request->id);
        $ciudad->estado = '0';
        $ciudad->save();
    }

    public function activar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $ciudad = Ciudad::findOrFail($request->id);
        $ciudad->estado = '1';
        $ciudad->save();
    }

    public function ciudades(Request $request)
    {
        $id_departamento = $request->id_departamento;
        $ciudades = Ciudad::where('id_departamento', $id_departamento)->where('estado', 1)->get();
        return $ciudades;
    }
}
