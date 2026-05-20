<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Rol;
use App\Models\RolePermission;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles_array = Rol::rolesDefault();

        foreach(Rol::rolesDefault() as $key => $roles) {
            foreach($roles as $rol) {
                Rol::firstOrCreate(['id' => $key, 'name' => $rol, 'guard_name' => 'web']);
            }
            $permisos = DB::table('permissions')->get();
            foreach($permisos as $permiso){
                RolePermission::firstOrCreate(['permission_id' => $permiso->id,'role_id' => '1']);
            }
        }
        // $this->command->info('Permisos agregados a rol Administrador');             
    }
}
