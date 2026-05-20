<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AplicativosCentralizado;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\AplicativoUsuario;

class AplicativosCentralizadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

    	if (!$request->ajax()) return redirect('/');

        $buscar   = $request->buscar;
        $criterio = $request->criterio;

        $aplicativos = AplicativosCentralizado::orderBy('id', 'desc')
                                        ->select('aplicativos.*');

        if (!$buscar=='')
        {
            $aplicativos->where('menus.'.$criterio, 'like', '%'. $buscar . '%');
        }

        return [
            'pagination' => [
                'total'        => $aplicativos->paginate(10)->total(),
                'current_page' => $aplicativos->paginate(10)->currentPage(),
                'per_page'     => $aplicativos->paginate(10)->perPage(),
                'last_page'    => $aplicativos->paginate(10)->lastPage(),
                'from'         => $aplicativos->paginate(10)->firstItem(),
                'to'           => $aplicativos->paginate(10)->lastItem(),
            ],
            'aplicativos' => $aplicativos->paginate(10)
        ];
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $response = [
            'status'  => true,
            'mensaje' => ''
        ];


        if($request->nombre != '' and $request->nombre_db != '')
        {
            try{
                DB::beginTransaction();

                $image = $request->file('imagen');

                $depto = new AplicativosCentralizado();
                $depto->nombre = $request->nombre;
                $depto->nombre_db = $request->nombre_db;
                $depto->url_produccion = $request->url_produccion;
                $depto->nit         = $request->nit;
                $depto->direccion   = $request->direccion;

                if($request->hasFile('imagen'))
                {
                    $filename = time() . '.' . $image->getClientOriginalExtension();
                    request()->imagen->move(public_path('/images/aplicativos/'), $filename);
                    $depto->url_logo = 'images/aplicativos/'. $filename;
                }
                $depto->save();

                $administradores = User::where('super_administrador','=','1')->get();
                foreach($administradores as $admin){
                    $newUserDepto = new AplicativoUsuario();
                    $newUserDepto->id_aplicativo = $depto->id;
                    $newUserDepto->id_usuario      = $admin->id;
                    $newUserDepto->save();
                }

                DB::commit();
            }catch(\Exception $e){
                DB::rollBack();
            }

        }else{
            $response['mensaje'] = 'Faltan campos por completar.';
            $response['status']  = false;
        }

        return response()->json($response);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function cambiarEstado(Request $request)
    {
    	if (!$request->ajax()) return redirect('/');

        try
        {
            DB::beginTransaction();

            $pedido = AplicativosCentralizado::where('id', $request->id)->first();
            $pedido->estado = $request->estado;
            $pedido->save();

            DB::commit();

            echo json_encode('ok');

        }
        catch (Exception $e)
        {
            DB::rollBack();
            echo json_encode('no');

        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {

        $depto = AplicativosCentralizado::where('id', $request->id)->first();
        $depto->nombre = $request->nombre;
        $depto->nombre_db = $request->nombre_db;
        $depto->url_produccion = $request->url_produccion;
        $image = $request->file('imagen');

        if($request->hasFile('imagen'))
        {
            $filename = time() . '.' . $image->getClientOriginalExtension();
            request()->imagen->move(public_path('/images/aplicativos/'), $filename);
            $depto->url_logo = 'images/aplicativos/'. $filename;
        }
        $depto->save();

    	return response()->json(['status' => true]);
    }

    public function getAplicativos(Request $request){
        $deptos = AplicativosCentralizado::where('estado','1')->get();
        return $deptos;
    }


}
