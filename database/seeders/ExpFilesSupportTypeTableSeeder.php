<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ExpFilesSupportTypeTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('exp_files_support_types')->delete();

        \DB::table('exp_files_support_types')->insert([
            [
                'id' => 1,
                'name_en' => 'Physical',
                'name_es' => 'Físico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name_en' => 'Digitized',
                'name_es' => 'Digitalizado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name_en' => 'Electronic',
                'name_es' => 'Electrónico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
