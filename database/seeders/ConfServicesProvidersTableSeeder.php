<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ConfServicesProvidersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('conf_services_providers')->delete();
        
        \DB::table('conf_services_providers')->insert(array (
            0 => 
            array (
                'created_at' => NULL,
                'deleted_at' => NULL,
                'id' => 1,
                'name' => 'Al día',
                'updated_at' => NULL,
            ),
            1 => 
            array (
                'created_at' => NULL,
                'deleted_at' => NULL,
                'id' => 2,
                'name' => 'Correo Certificado',
                'updated_at' => NULL,
            ),
            2 => 
            array (
                'created_at' => NULL,
                'deleted_at' => NULL,
                'id' => 3,
                'name' => 'Correo Certificado Unitario',
                'updated_at' => NULL,
            ),
            3 => 
            array (
                'created_at' => NULL,
                'deleted_at' => NULL,
                'id' => 4,
                'name' => 'Correspondencia no Prioritaria',
                'updated_at' => NULL,
            ),
        ));
        
        
    }
}