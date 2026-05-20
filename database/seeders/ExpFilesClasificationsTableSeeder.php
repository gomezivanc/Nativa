<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ExpFilesClasificationsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('exp_files_clasifications')->delete();
        
        \DB::table('exp_files_clasifications')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name_es' => 'Publico',
                'name_en' => 'Public',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'name_es' => 'Clasificada',
                'name_en' => 'Classified',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'name_es' => 'Reservada',
                'name_en' => 'Reserved',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}