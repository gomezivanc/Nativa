<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ExpFilesTypeDocsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('exp_files_type_docs')->delete();
        
        \DB::table('exp_files_type_docs')->insert(array (
            0 => 
            array (
                'created_at' => NULL,
                'id' => 1,
                'name_en' => 'Official communications',
                'name_es' => 'Comunicaciones oficiales',
                'updated_at' => NULL,
            ),
            1 => 
            array (
                'created_at' => NULL,
                'id' => 2,
                'name_en' => 'Annexes',
                'name_es' => 'Anexos',
                'updated_at' => NULL,
            ),
            2 => 
            array (
                'created_at' => NULL,
                'id' => 3,
                'name_en' => 'Cross reference',
                'name_es' => 'Referencia crusada',
                'updated_at' => NULL,
            ),
        ));
    }
}