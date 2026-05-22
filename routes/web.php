<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\PermisosController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\CentralizadoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ManualUsuariosController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\PasswordResetControllerWeb;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\TenantAssetsController;
use App\Http\Controllers\TranslateProcessController;
use App\Http\Controllers\UsuarioController;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

Route::get('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'es'])) {
        session(['locale' => $locale]);
    }
    return redirect()->back();
});

Route::get('/', [LoginController::class, 'showLoginForm'])->name('showlogin')->middleware('validateSesion')->middleware('CheckSesion');
// Route::get('/env', function () { return response()->json([ 'REACT_APP_SITE_KEY' => env('REACT_APP_SITE_KEY'), ]);});
Route::get('/env', function () {return response()->json(['REACT_APP_SITE_KEY' => env('REACT_APP_SITE_KEY'),]);})->name('env');
Route::post('/login2', [LoginController::class, 'login'])->name('login2');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::get('/recovery', [LoginController::class, 'recovery'])->name('recovery');
Route::middleware([
    'web',
    // InitializeTenancyBySubdomain::class,
    // PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/modal', function () {
        return Inertia::render('Modal/Index');
    })->middleware(['auth', 'verified'])->name('modal');

    Route::get('/tenant-asset', TenantAssetsController::class)->name('tenant_asset');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/token/{error}', [LoginController::class, 'showLoginFormRedirect']);
    Route::get('autoLoginRedirect/{conexion}', [CentralizadoController::class, 'loginRedirect'])->name('autoLoginRedirect');

    Route::post('web/create', [PasswordResetControllerWeb::class, 'create'])->name('password.create');
    Route::get('web/password/find/{token}', [PasswordResetControllerWeb::class, 'find']);
    Route::post('web/reset', [PasswordResetControllerWeb::class, 'reset'])->name('password.reset');

    Route::group(['middleware' => ['jwt.verify']], function () {
        Route::get('autologin/{userId}/{conexion}/{token}', [CentralizadoController::class, 'change']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('codeVerify', [CentralizadoController::class, 'getViewValidateCode'])->name('codeVerify')->middleware('validateSesion');
        Route::post('/validacionCodigos', [LoginController::class, 'validateCodes'])->name('validarCodigo');

        Route::get('centralizado', [CentralizadoController::class, 'index'])->name('centralizado')->middleware('validateSesion');
        Route::get('centralizado/{conexion}', [CentralizadoController::class, 'change'])->name('changeDb');
        Route::get('centralizadoRedirect', [CentralizadoController::class, 'getViewCentralizado'])->middleware('validateSesion');
        Route::get('administracion', [CentralizadoController::class, 'redirectAdmin'])->name('administracion');
        Route::get('getfile', [CentralizadoController::class, 'getFile'])->name('file');

        Route::get('/menus/all', [MenuController::class, 'allMenus'])->name('menus.all'); //devuelve los menús jerarquicamente para un treeselect
        Route::get('/routes/all', [RouteController::class, 'index'])->name('routes.index'); //devuelve el select de las rutas

        Route::resource('menus', MenuController::class)->except(['update']); //crud de menús
        Route::post('menus/{menu}/update', [MenuController::class, 'update'])->name('menus.update');
        Route::get('menus-list', [MenuController::class, 'list'])->name('menus.list');
        Route::put('/menuscambios/cambioEstado', [MenuController::class, 'cambioEstado'])->name('menu.cambioEstado'); //crud de menús


        Route::group([], function () {

            Route::get('/main', [DashboardController::class, 'index'])->name('main');
            Route::get('/main/roles', [MainController::class, 'RolActual'])->name('main.rol');
            Route::get('/main/get-user-roles', [MainController::class, 'getUserRoles'])->name('main.get-user-roles');
            Route::post('/main/switch-role', [MainController::class, 'switchRole'])->name('main.switch-role');
            Route::get('/main/company', [MainController::class, 'company'])->name('main.company');
            Route::post('/main/company-store', [MainController::class, 'companyStore'])->name('main.company.store');

            // dashboard
            Route::get('dashboard/sometido-comite', [DashboardController::class, 'sComite'])->name('sometido-comite');
            Route::get('dashboard/comite', [DashboardController::class, 'comite'])->name('comite');
            Route::get('dashboard/repetitionStudy', [DashboardController::class, 'repetitionStudy'])->name('repetitionStudy');
            Route::get('dashboard/avisos', [DashboardController::class, 'avisos'])->name('avisos');

            Route::get('/tipoDocumento', [TipoDocumentoController::class, 'index'])->name('tipoDocumento.index');
            Route::post('/tipoDocumento/create', [TipoDocumentoController::class, 'store']);
            Route::put('/tipoDocumento/update', [TipoDocumentoController::class, 'update']);
            Route::put('/tipoDocumento/inactivar', [TipoDocumentoController::class, 'inactivar']);
            Route::put('/tipoDocumento/activar', [TipoDocumentoController::class, 'activar']);

            Route::get('/ciudad', [CiudadController::class, 'index']);
            Route::post('/ciudad/store', [CiudadController::class, 'store']);
            Route::put('/ciudad/update', [CiudadController::class, 'update']);
            Route::put('/ciudad/inactivar', [CiudadController::class, 'inactivar']);
            Route::put('/ciudad/activar', [CiudadController::class, 'activar']);
            Route::post('/ciudad/ciudades', [CiudadController::class, 'ciudades'])->name('ciudad.ciudades');
            Route::get('/ciudad/selectCiudad', [CiudadController::class, 'selectCiudad'])->name('ciudad.selectCiudad');

            Route::get('/departamento', [DepartamentoController::class, 'index']);
            Route::post('/departamento/store', [DepartamentoController::class, 'store']);
            Route::put('/departamento/update', [DepartamentoController::class, 'update']);
            Route::put('/departamento/inactivar', [DepartamentoController::class, 'inactivar']);
            Route::put('/departamento/activar', [DepartamentoController::class, 'activar']);
            Route::get('/departamento/selectDepartamento', [DepartamentoController::class, 'seleccioneDepartamento'])->name('departamento.selectDepartamento');

            Route::get('/roles', [RolController::class, 'index'])->name('roles.index');
            Route::post('/roles/guardar', [RolController::class, 'store'])->name('roles.store');
            Route::post('/roles/update', [RolController::class, 'update'])->name('roles.update');
            Route::put('/roles/inactivar', [RolController::class, 'inactivar'])->name('roles.inactivar');
            Route::put('/roles/activar', [RolController::class, 'activar'])->name('roles.activar');
            Route::put('/roles/asignarPermisos', [RolController::class, 'asignarPermisos'])->name('roles.asignarPermisos');
            Route::post('/roles/obtenerRolPermisos', [RolController::class, 'obtenerRolPermisos'])->name('roles.obtenerRolPermisos');
            Route::get('/rol/getrol', [RolController::class, 'getRoles'])->name('roles.all');
            Route::get('/routes/consulta', [RolController::class, 'consulta'])->name('roles.consulta');

            // manual de usuario
            Route::resource('utilities/manual-usuario',ManualUsuariosController::class);
            Route::get('utilities/manual-usuario-list',[ManualUsuariosController::class,'list'])->name('manual-usuario.list');

            Route::resource('/roles', RolController::class)->except(['index', 'store', 'update']);
            Route::get('rol-list', [RolController::class, 'list'])->name('roles.list');
            Route::get('rol-detail/{id}', [RolController::class, 'detail'])->name('roles.detail');
            Route::get('/rol/getPermissions', [RolController::class, 'getPermissions'])->name('roles.getPermissions');
            Route::get('roles-export', [RolController::class, 'export'])->name('roles.export');

            Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
            Route::get('/usuarios/edit/{user}', [UsuarioController::class, 'edit'])->name('usuarios.edit');
            Route::post('/usuarios/ActualizarPerfil', [UsuarioController::class, 'actualizarPerfil'])->name('usuarios.actualizarPerfil');
            Route::post('/usuarios/guardar', [UsuarioController::class, 'store'])->name('usuarios.store');
            Route::post('/usuarios/update', [UsuarioController::class, 'update'])->name('usuarios.update');
            Route::put('/usuarios/cambiarEstado', [UsuarioController::class, 'cambioEstado'])->name('usuarios.cambiarEstado');
            Route::get('/usuarios/getUsers', [UsuarioController::class, 'getUsers'])->name('usuarios.getUsers');
            Route::get('usuarios/search-users', [UsuarioController::class, 'searchUsers'])->name('usuarios.search-users');  
            Route::get('usuarios/search-thir', [UsuarioController::class, 'searchThir'])->name('usuarios.search-thir');  
            Route::get('/usuarios/personas', [UsuarioController::class, 'getPersonasCentralizado'])->name('usuarios.personas');
            Route::get('usuarios.list', [UsuarioController::class, 'list'])->name('usuarios.list');
            Route::resource('usuarios', UsuarioController::class)->except([
                'index', 'store', 'edit', 'update'
            ]);

            Route::get('usuarios-detail/{id}', [UsuarioController::class, 'detail'])->name('usuarios.detail');
            Route::put('/usuarios/asignarPermisos', [UsuarioController::class, 'asignarPermisos'])->name('usuarios.asignarPermisos');
            Route::get('usuario/get-permissions', [UsuarioController::class, 'getPermissions'])->name('usuarios.getPermissions');
            Route::middleware('ownUser')->get('/usuarios/usuarios.edit-user-login/{user}', [UsuarioController::class, 'editUserLogin'])
            ->name('usuarios.edit-user-login');
            Route::post('/usuarios/update-profile', [UsuarioController::class, 'updateProfile'])->name('usuarios.update-profile');
            Route::get('usuarios-export', [UsuarioController::class, 'export'])->name('usuarios.export');

            Route::resource('/permisos', PermisosController::class);
            Route::get('permisos-list', [PermisosController::class, 'list'])->name('permisos.list');
            Route::get('permisos-export', [PermisosController::class, 'export'])->name('permisos.export');
            Route::post('permisos/clean-storage/{folder}', [PermisosController::class, 'cleanStorage'])->name('permisos.clean-storage');
            Route::post('permisos/clean-storage_v/{folder}', [PermisosController::class, 'cleanStorage_v'])->name('permisos.clean-cleanStorage_v');
        });
    });
});

