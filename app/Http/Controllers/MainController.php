<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Events\MyEvent;
use App\Models\MenuOld;
use FontLib\Table\Type\name;
use Illuminate\Support\Facades\Artisan;
use App\Models\RutasVue;
use App\Helpers\Equivalencias;
use App\Models\Cita;
use App\Models\Rol;
use App\Repositories\CompanyRepository;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Filing;
use App\Models\Answer;
use App\Models\User;

class MainController extends Controller
{
    protected  $tipo      = 'administrador';
    protected  $rolAdmin   = '';

    public function __construct( private CompanyRepository $companyRepository ){
        $this->middleware('auth');
        $this->nameDbCent = config('database.connections.centralizado.schema');
    }

    public function RolActual(){

        $rolActual = '';

        if(Auth::user()->super_administrador == '1' or Auth::user()->hasRole($this->rolAdmin)){
            $rolActual = 'Administrador';
        }
        return [
            'roles' => $rolActual,
        ];
    }

    /**
     * Obtener roles disponibles del usuario ordenados por id
     */
    public function getUserRoles()
    {
        $user = Auth::user();
        
        // Obtener todos los roles del usuario, ordenados por id
        $roles = DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_type', User::class)
            ->where('model_has_roles.model_id', $user->id)
            ->orderBy('roles.id', 'asc')
            ->select('roles.id', 'roles.name')
            ->get();

        // Obtener el rol actual de la sesion, si no existe, usar el primero
        $currentRoleId = session('current_role_id');
        if (!$currentRoleId && $roles->count() > 0) {
            $currentRoleId = $roles->first()->id;
        }

        return response()->json([
            'roles' => $roles,
            'current_role_id' => $currentRoleId,
        ]);
    }

    /**
     * Cambiar el rol actual del usuario
     */
    public function switchRole(Request $request)
    {
        $roleId = (int) $request->input('role_id');
        $user = Auth::user();
        // Validar que el usuario tenga este rol
        $roleExists = DB::table('model_has_roles')
            ->where('model_type', User::class)
            ->where('model_id', $user->id)
            ->where('role_id', $roleId)
            ->exists();

        if (!$roleExists) {
            return response()->json([
                'message' => 'No tienes permiso para usar este rol',
            ], 403);
        }

        // Obtener el nombre del rol
        $role = DB::table('roles')->where('id', $roleId)->first();

        if (!$role) {
            return response()->json([
                'message' => 'Rol no encontrado',
            ], 404);
        }

        // Guardar el rol actual en la sesion
        session(['current_role_id' => $roleId]);
        session(['current_role_name' => $role->name]);

        // Redirigir a /main para que todo se refresque con el nuevo rol
        return redirect()->route('main');
    }


    public function index()
    {
        // $extraerMenus  = $this->extraerMenus();
        // $menuSuperior  = $extraerMenus['menu_superior'];
        // $menuInferior  = $extraerMenus['menu_inferior'];
        // $data_depto    = Session('data_depto');
    	// return view('principal', compact('menuSuperior','menuInferior','data_depto'));
        return Inertia::render('Dashboard');
    }

    public function extraerMenus()
    {
        $menus = [
                    'menu_superior' => '',
                    'menu_inferior' => ''
                 ];

        $conexion = (Session('conexion') == 'centralizado') ? true : false;

        $itemPadres = MenuOld::leftJoin($this->nameDbCent.'.rutas_vue as tc','tc.id','menus.component')
                            ->where('ubicacion', '!=',null)
                            ->where('status', 1)
                            ->select('menus.id as id','menus.icon','menus.name as name','menus.ubicacion','tc.name as component','tc.path')
                            ->orderBy('menus.id','ASC')
                            ->get()
                            ->toArray();
    	foreach ($itemPadres as $padre)
        {
            if($padre['ubicacion'] == 1)
            {
                $menus['menu_superior'] .= $this->armaMenuSuperior($padre, 'superior',$conexion);
            }else{
                $menus['menu_inferior'] .= $this->armaMenuInferior($padre, 'inferior',$conexion);
            }
    	}
        return $menus;
    }

    public function armaMenuSuperior($raiz, $lugar, $centralizado){
        if(!$centralizado)
        {
            $permisoRaiz = MenuOld::join('permissions', 'permissions.id_componente', 'menus.id')
                                ->select('permissions.name as permiso')
                                ->where('menus.status', 1)
                                ->where('menus.id', $raiz['id'])
                                ->where('permissions.name', 'LIKE','view_'.'%' )
                                ->first();
        }

        if(Session('conexion') != 'centralizado' && Auth::user()->super_administrador == 1 or $centralizado)
        {
            $condicion = true;
        }else{
            $condicion = Auth::user()->can($permisoRaiz['permiso']);
        }

        $html = '';
        // Si tiene los permisos muestra la raiz
        if($condicion){
            $html .= '<li class="nav-item">';
            $html .= $this->getEtiquetaA($raiz['component'], $raiz['name'], $raiz['icon'], $lugar);
            $html .= '</li">';
            $html .= $this->buscarHijos($raiz['id'], $centralizado,'superior');
        }
        return $html;
    }
    public function armaMenuInferior($raiz, $lugar, $centralizado){
        // dd($raiz);
        if(!$centralizado)
        {
            $permisoRaiz = MenuOld::join('permissions', 'permissions.id_componente', 'menus.id')
                                ->select('permissions.name as permiso')
                                ->where('menus.status', 1)
                                ->where('menus.id', $raiz['id'])
                                ->where('permissions.name', 'LIKE','view_'.'%' )
                                ->first();
        }

        if(Session('conexion') != 'centralizado' && Auth::user()->super_administrador == 1 or $centralizado)
        {
            $condicion = true;
        }else{
            $condicion = Auth::user()->can($permisoRaiz['permiso']);
        }

        $html = '';
        // Si tiene los permisos muestra la raiz
        if($condicion){

            if($raiz['component'] == null){
                $raiz['component'] = 'br'.$raiz['id'];
            }

            $html .= '<li class="nav-item">';
            $html .= $this->getEtiquetaA($raiz['component'], $raiz['name'], $raiz['icon'], $lugar,$raiz['id'],$centralizado);
            $html .= '<div class="submenu" id="'.$raiz['component'].'">';
            $html .= $this->buscarHijos($raiz['id'], $centralizado,'inferior');
            $html .= '</div>';
            $html .= '</li>';
        }
        // dd($html);
        return $html;
    }

    public function buscarHijos($id, $centralizado,$lugar){

        if($lugar == 'superior'){
            $class_ul = 'submenu-item';
            $class_li = 'nav-item';
        }else{
            $class_ul = 'submenu-item';
            $class_li = 'nav-item';
        }
        $html = '';
        // busca si el padre tiene hijos
        $tieneHijos = $this->consultaItemsNivel($id, $centralizado);
        if(count($tieneHijos) > 0){
            $html .= '<ul class="'.$class_ul.'">';
            foreach($tieneHijos as $hijo){
                if(Session('conexion') != 'centralizado' && Auth::user()->super_administrador == 1 or $centralizado)
                {
                    $condicion = true;
                }else{
                    $condicion = Auth::user()->can($hijo['permiso']);
                }

                if($condicion){
                    // pregunta si tiene hijos en el siguiente nivel
                    $tieneNietos = $this->consultaItemsNivel($hijo['id'], $centralizado);
                    if(count($tieneNietos) > 0){
                        $html .= '<li class="'.$class_li.'">'.$this->getRuta($hijo['component'], $hijo['name'], true,$lugar,true).'</li>';
                        if($lugar != 'superior'){
                            $html .= '<div class="submenu" id="'.$hijo['component'].'">';
                        }
                        $html .= $this->buscarHijos($hijo['id'], $centralizado,$lugar);
                        if($lugar != 'superior'){
                            $html .= '</div>';
                        }
                    }
                    else{
                        $html .= '<li class="'.$class_li.'">'.$this->getRuta($hijo['component'], $hijo['name'], false,$lugar,false).'</li>';
                    }
                }
            }
            $html .= '</ul>';
        }
        // dd($html);
        return $html;
    }

    public function getEtiquetaA($componente, $nombre, $icono, $lugar, $id_hijo = '',$centralizado = ''){

        $estilo = '';
        $tamano = 'fa-lg';
        $clase = '';
        $extra = '';
        $id_dinamico = '';
        $extra_inferior = '';
        $class_inferior = '';
        $class_superior= '';
        $arrow = '';
        $clase_title = "";

        if($lugar== "superior"){
            $estilo = 'style=""';
            $tamano = 'fa-2x';
            $extra = 'data-toggle="dropdown"';
            $class_superior = 'color_blanco_li';
            $clase_title = "MenuOld-title";
        }else{
            $clase = $icono.' MenuOld-icon';
            $id_dinamico = 'href="'.$nombre.'"';
            $extra_inferior = 'id="color_icocno" data-toggle="collapse" aria-expanded="false" aria-controls="'.$componente.'"';
            $class_inferior = 'collapse color_fondo_nav';
            $clase_title = "MenuOld-title";

            if($this->consultarCantidadHijos($id_hijo,$centralizado)){
                $arrow = '<i class="MenuOld-arrow"></i>';
            }
        }

        $icono = ($icono == null) ? 'fa fa-circle-o-notch' : $icono;

        return '<router-link style="white-space: nowrap; text-overflow: ellipsis;"  data-target="#'.$componente.'" :to="{ name: \''.$componente.'\'}" class="nav-link">
                    <i class="'.$clase.'"></i>
                    <span class="'.$clase_title.'">'.$nombre.'</span>
                    '.$arrow.'
                </router-link>';
    }


    public function getRuta($componente, $nombre, $despliegue,$lugar,$arrow){
        if($lugar == 'superior')
        {
            ($despliegue)? $dropdownToggle = 'dropdown-toggle' : $dropdownToggle = '';
            return '<router-link style="white-space: nowrap; text-overflow: ellipsis;" data-target="#'.$componente.'" :to="{ name: \''.$componente.'\'}" class="nav-link">
                            '.$nombre.'
                    </router-link>';
        }else{
            $arrow2 = '';

            if($arrow){
                $arrow2 = '<i class="MenuOld-arrow"></i>';
            }

            return '<router-link style="white-space: nowrap; text-overflow: ellipsis;" id="'.$componente.'"  data-target="#'.$componente.'" :to="{ name: \''.$componente.'\'}" class=" nav-link" aria-controls="'.$componente.'">
                        '.$nombre.'
                        '.$arrow2.'
                    </router-link>';
        }
    }


    public function consultaItemsNivel($id, $centralizado){
        if($centralizado)
        {
            $hijos = MenuOld::leftJoin($this->nameDbCent.'.rutas_vue as tc','tc.id','menus.component')
                            ->where('menus.menu_id','=', $id)
                            ->where('menus.status', 1)
                            ->select('menus.id','menus.name','tc.name as component','menus.menu_id')
                            ->get()
                            ->toArray();
        }else{
            $hijos = MenuOld::join($this->nameDbCent.'.rutas_vue as tc','tc.id','menus.component')
                            ->where('menus.menu_id','=', $id)
                            ->where('menus.status', 1)
                            ->join('permissions', 'permissions.id_componente', 'menus.id')
                            ->select('menus.id','menus.name','tc.name as component','permissions.name as permiso', 'menus.menu_id')
                            ->where('permissions.name', 'LIKE','view_'.'%' )
                            // ->groupBy('permissions.name','menus.id','tc.name')
                            ->orderBy('menus.id','ASC')
                            ->get()
                            ->toArray();
        }

        return $hijos;
    }

    public function consultarCantidadHijos($id, $centralizado){
        $response = false;
        $tieneHijos = $this->consultaItemsNivel($id, $centralizado);
        if(count($tieneHijos) > 0){
           $response = true;
        }
        return $response;
    }

    function company() {

        $company = $this->companyRepository->getModel()->first();

        $usuariosActivos = User::count();
        $usuariosEliminados = User::onlyTrashed()->count();

        $entrada = Filing::where('filing_number', 'like', '%E%')->count();

        $count1 = Filing::where('filing_number', 'like', '%S%')->count();
        $count2 = Answer::where('departure_filing', 'like', '%S%')->count();

        $salida = $count1 + $count2;

        return Inertia::render(
            'Company/Company',
            compact(
                'company',
                'entrada',
                'salida',
                'usuariosActivos',
                'usuariosEliminados'
            )
        );
    }

    function companyStore(Request $request) {
        $request['id'] = $this->companyRepository->getModel()->first()?->id;
        $data = $this->companyRepository->storeGeneral($request->all());

        if($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->storePublicly('logos', 'public'); // Guarda el archivo en storage/app/logos
            $data->logo = $logoPath;
            $data->save();
        }
        return response()->json($data);
    }

}