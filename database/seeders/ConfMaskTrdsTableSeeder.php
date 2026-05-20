<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ConfMaskTrdsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('conf_mask_trds')->delete();
        
        \DB::table('conf_mask_trds')->insert(array (
            0 => 
            array (
                'created_at' => '2024-11-29 14:38:29',
                'deleted_at' => NULL,
                'id' => 1,
                'name' => 'Columnas separadas',
                'updated_at' => '2024-11-29 14:38:29',
            ),
            1 => 
            array (
                'created_at' => '2024-11-29 14:38:29',
                'deleted_at' => NULL,
                'id' => 2,
                'name' => 'dp-ss-sb',
                'updated_at' => '2024-11-29 14:38:29',
            ),
            2 => 
            array (
                'created_at' => '2024-11-29 14:38:29',
                'deleted_at' => NULL,
                'id' => 3,
                'name' => 'dp.ss.sb',
                'updated_at' => '2024-11-29 14:38:29',
            ),
            3 => 
            array (
                'created_at' => '2024-11-29 14:38:29',
                'deleted_at' => NULL,
                'id' => 4,
                'name' => 'dpsss.sb',
                'updated_at' => '2024-11-29 14:38:29',
            ),
        ));
        
        
    }
}