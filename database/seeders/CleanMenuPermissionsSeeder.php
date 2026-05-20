<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CleanMenuPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $modelType = 'App\\Models\\Menu';

        $deleted = DB::table('model_has_permissions')
            ->where('model_type', $modelType)
            ->delete();

        $update = DB::table('menus')
            ->where('title', 'workflow')
            ->update([
                'title' => 'workflow.workflow'
            ]);

        $this->command->info("Registros eliminados de model_has_permissions: {$deleted}");
        $this->command->info("Registros actualizados de menus: {$update}");
    }
}
