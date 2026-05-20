<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $routesWeb = [
            base_path('routes/web.php'),
            base_path('routes/configuration.php'),
            base_path('routes/documental_gestion.php'),
            base_path('routes/correspondence_management.php'),
            base_path('routes/archive_gestion.php'),
            base_path('routes/filing.php'),
            base_path('routes/documentary_loans.php'),
            base_path('routes/dispo_final.php'),
            base_path('routes/workflow.php'),
            base_path('routes/reports.php'),
            base_path('routes/special_actions.php'),
        ];

        $this->routes(function () use($routesWeb) {
            Route::middleware([
                'web',
                // InitializeTenancyBySubdomain::class,
                // PreventAccessFromCentralDomains::class,
            ])->group(function () use($routesWeb) {
                Route::prefix('api')
                    ->middleware('api')
                    ->namespace($this->namespace)
                    ->group(base_path('routes/api.php'));

                Route::middleware(['web'])
                    ->namespace($this->namespace)
                    ->group($routesWeb);
            });

        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60);
        });
    }
}
