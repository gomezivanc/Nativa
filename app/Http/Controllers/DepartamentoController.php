<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departamento;
use Illuminate\Support\Facades\Session;


class DepartamentoController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $buscar = $request->buscar;
        $criterio = $request->criterio;
        
        if ($buscar==''){
            $departamentos = Departamento::orderBy('id', 'desc')->paginate(10);
        }
        else{
            $departamentos = Departamento::where($criterio, 'like', '%'. $buscar . '%')
                                            ->orderBy('id', 'desc')->paginate(10);
        }
        
        return [
            'pagination' => [
                'total'        => $departamentos->total(),
                'current_page' => $departamentos->currentPage(),
                'per_page'     => $departamentos->perPage(),
                'last_page'    => $departamentos->lastPage(),
                'from'         => $departamentos->firstItem(),
                'to'           => $departamentos->lastItem(),
            ],
            'departamentos' => $departamentos
        ];
    }

    public function selectDepartamento(Request $request){
        if (!$request->ajax()) return redirect('/');
        $departamentos = Departamento::select('id','nombre as nom_departamento')
                        ->where('nombre',Session::get('conexion'))
                        ->orderBy('nombre', 'asc');
        if(!empty($request['country_id'])) {
            $departamentos->where('country_id',$request['country_id']);
        }
        return ['departamentos' => $departamentos->get()->toArray()];
    }
    
    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $departamento = new Departamento();
        $departamento->nombre = $request->nombre;
        $departamento->estado = '1';
        $departamento->save();
    }
    public function update(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $departamento = Departamento::findOrFail($request->id);
        $departamento->nombre = $request->nombre;
        $departamento->estado = '1';
        $departamento->save();
    }

    public function seleccioneDepartamento( Request $request){
        if (!$request->ajax()) return redirect('/');

            $departamentos = Departamento::where('estado','=','1')->where('country_id',$request->country_id)
            ->select('id','nombre')->orderBy('nombre', 'asc')->get();

        return ['departamentos' => $departamentos];

    }

    public function inactivar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $departamento = Departamento::findOrFail($request->id);
        $departamento->estado = '0';
        $departamento->save();
    }

    public function activar(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $departamento = Departamento::findOrFail($request->id);
        $departamento->estado = '1';
        $departamento->save();
    }
}
