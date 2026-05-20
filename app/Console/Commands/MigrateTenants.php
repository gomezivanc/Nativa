<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;

class MigrateTenants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:tenant {--all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrar tablas a un tenant';

    /**
     * Execute the console command.
     *
     * @return int
     */    public function handle()
    {
        $all = $this->option('all');

        if(!empty($all)) {
            $this->migrateAllTenant();
        } else {
            $this->migrateOneTenant();
        }
    }


    private function migrateOneTenant() {
        $databaseName = Config::get("database.connections.tenant_config.database");

        if (empty($databaseName)) {
            $this->error("❌ La base de datos para la conexión 'tenant_config' no está configurada.");
            return;
        }
        $this->info("✅ Ejecutando migraciones en la conexión 'tenant_config' con la base de datos 'databaseName'...");
        Artisan::call('migrate', [
            '--database' => 'tenant_config',
            '--force' => true // Opcional, fuerza la ejecución en producción
        ]);
        $this->info(Artisan::output());
    }
    private function migrateAllTenant() {
        // $databaseName = Config::get("database.connections.tenant_config.database");

        // if (empty($databaseName)) {
        //     $this->error("❌ La base de datos para la conexión 'tenant_config' no está configurada.");
        //     return;
        // }
        // $this->info("✅ Ejecutando migraciones en la conexión 'tenant_config' con la base de datos 'databaseName'...");
        // Artisan::call('migrate', [
        //     '--database' => 'tenant_config',
        //     '--force' => true // Opcional, fuerza la ejecución en producción
        // ]);

        // // Mostrar salida de Artisan
        // $this->info(Artisan::output());
    }
}
