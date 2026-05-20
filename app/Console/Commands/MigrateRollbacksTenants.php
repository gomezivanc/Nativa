<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;

class MigrateRollbacksTenants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rollback:tenant {--all} {--step=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hacer rollback de migraciones en un tenant';

    /**
     * Execute the console command.
     */
    public function handle()
    {   
        $all = $this->option('all');
        $step = (int) $this->option('step'); // Convertimos a entero para evitar problemas

        if (!empty($all)) {
            $this->rollbackAllTenants($step);
        } else {
            $this->rollbackOneTenant($step);
        }
    }

    private function rollbackOneTenant(int $step)
    {
        $databaseName = Config::get("database.connections.tenant_config.database");

        if (empty($databaseName)) {
            $this->error("❌ La base de datos para la conexión 'tenant_config' no está configurada.");
            return;
        }

        $this->info("⏪ Haciendo rollback en la conexión 'tenant_config' con la base de datos '$databaseName'...");

        Artisan::call('migrate:rollback', [
            '--database' => 'tenant_config',
            '--step' => $step,
            '--force' => true // Para evitar confirmaciones en producción
        ]);

        $this->info(Artisan::output());
    }

    private function rollbackAllTenants(int $step)
    {
        // Aquí puedes iterar sobre múltiples bases de datos de tenants si es necesario
        $this->info("⏪ Haciendo rollback en todos los tenants...");
        
        // Ejemplo: Si tienes múltiples conexiones o tenants, iterar sobre ellos
        // foreach ($tenants as $tenant) {
        //     Config::set('database.connections.tenant_config.database', $tenant->database_name);
        //     $this->rollbackOneTenant($step);
        // }

        // Por ahora, solo llamamos al rollback del tenant principal
        $this->rollbackOneTenant($step);
    }
}
