<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TypeAnnexesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('type_annexes')->delete();
        
        \DB::table('type_annexes')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name_es' => 'CD',
                'name_en' => 'CD',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'name_es' => 'DVD',
                'name_en' => 'DVD',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'name_es' => 'USB',
                'name_en' => 'USB',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            3 => 
            array (
                'id' => 4,
                'name_es' => 'Disco duro',
                'name_en' => 'Hard disk',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            4 => 
            array (
                'id' => 5,
                'name_es' => 'Plano',
                'name_en' => 'Plain',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
            5 => 
            array (
                'id' => 6,
                'name_es' => 'Otro',
                'name_en' => 'Other',
                'created_at' => NULL,
                'updated_at' => NULL,
            ),
        ));
        
        
    }
}