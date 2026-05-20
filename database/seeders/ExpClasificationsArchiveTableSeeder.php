<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpClasificationsArchiveTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        \DB::table('exp_clasification_archive')->delete();
        
        \DB::table('exp_clasification_archive')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name_es' => 'Gestión',
                'name_en' => 'Management',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'name_es' => 'Histórico',
                'name_en' => 'Historical',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'name_es' => 'Central',
                'name_en' => 'Central',
                'created_at' => NULL,
                'updated_at' => NULL,
                'deleted_at' => NULL,
            ),
        ));
    }
}
