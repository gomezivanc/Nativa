<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;

class SeedTenant extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:tenant {--all} {--class=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ejecutar seeders en un tenant';

    /**
     * Execute the console command.
     */
    public function handle()
    {   
        $all = $this->option('all');
        $class = $this->option('class') ?? 'DatabaseSeederTenant'; // Si no se pasa --class, usa DatabaseSeeder por defecto

        if (!empty($all)) {
            $this->seedAllTenants($class);
        } else {
            $this->seedOneTenant($class);
        }
    }

    private function seedOneTenant(string $class)
    {
        $databaseName = Config::get("database.connections.tenant_config.database");

        if (empty($databaseName)) {
            $this->error("❌ La base de datos para la conexión 'tenant_config' no está configurada.");
            return;
        }

        $this->info("🌱 Ejecutando seeder '$class' en la conexión 'tenant_config' con la base de datos '$databaseName'...");

        Artisan::call('db:seed', [
            '--database' => 'tenant_config',
            '--class' => $class,
            '--force' => true // Para evitar confirmaciones en producción
        ]);

        $this->info(Artisan::output());
    }

    private function seedAllTenants(string $class)
    {
        // Aquí puedes iterar sobre múltiples bases de datos de tenants si es necesario
        $this->info("🌱 Ejecutando seeder '$class' en todos los tenants...");
        
        // Ejemplo: Si tienes múltiples conexiones o tenants, iterar sobre ellos
        // foreach ($tenants as $tenant) {
        //     Config::set('database.connections.tenant_config.database', $tenant->database_name);
        //     $this->seedOneTenant($class);
        // }

        // Por ahora, solo llamamos al seeder del tenant principal
        $this->seedOneTenant($class);
    }
}
