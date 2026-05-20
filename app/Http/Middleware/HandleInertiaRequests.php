<?php

namespace App\Http\Middleware;

use App\Models\AplicativoUsuario;
use App\Models\Defendants;
use App\Models\ModelHasRol;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if (!$user) {
            return array_merge(parent::share($request), [
                'auth' => [
                    // 'user' => $request->user(),
                    // 'user' => $request->user()->only('usuario','email','roles'),
                    // 'user' => $request->user()?$request->user()->only(['id','email','persona','roles']):null,
                    'user' => $request->user() ? $request->user()->only(['id', 'email', 'super_administrador', 'persona', 'usuario']) : null,
                    [],

                ],
                'ziggy' => function () use ($request) {
                    return array_merge((new Ziggy)->toArray(), [
                        'location' => $request->url(),
                    ]);
                },
                'flash' => [
                    'message' => fn() => $request->session()->get('message'),
                    'error' => fn() => $request->session()->get('error'),
                ],
                'current_language' => session('locale', 'es'),
                'translations' => function () {
                    $locale = app()->getLocale();
                    $path = resource_path("lang/{$locale}");

                    $translations = collect(File::allFiles($path))
                        ->mapWithKeys(function ($file) {
                            $filename = pathinfo($file, PATHINFO_FILENAME);
                            return [$filename => require $file];
                        });
                    return $translations->toArray();
                },
            ]);
        }
        $empresa = $user ? $user->empresa : null;
        $user->roles = ModelHasRol::join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_type', User::class)
            ->where('model_id', $user->id)
            ->orderBy('roles.id', 'asc')
            ->get();
        $signatures = null;

        // Obtener el rol actual de la sesion, si no existe, usar el primero
        $currentRoleId = session('current_role_id');
        $currentRoleName = session('current_role_name');
        if (!$currentRoleId && $user->roles->count() > 0) {
            $currentRoleId = $user->roles->first()->id;
            $currentRoleName = $user->roles->first()->name;
            session(['current_role_id'   => $currentRoleId]);
            session(['current_role_name' => $currentRoleName]);
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? $user->only(['id', 'email', 'super_administrador', 'persona', 'usuario', 'roles']) : null,
                'empresa' => $empresa ? $empresa->toArray() : null,
                'signatures' => $user->only(['signature', 'physical_signature']),
                'current_role_id' => $currentRoleId,
                'current_role_name' => $currentRoleName,
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'current_language' => session('locale', 'es'),
            'translations' => function () {

                $locale = app()->getLocale();
                $path = resource_path("lang/{$locale}");

                $translations = collect(File::allFiles($path))
                    ->mapWithKeys(function ($file) {
                        $filename = pathinfo($file, PATHINFO_FILENAME);
                        return [$filename => require $file];
                    });
                // dd($translations->toArray());
                return $translations->toArray();
            },
        ]);
    }
}