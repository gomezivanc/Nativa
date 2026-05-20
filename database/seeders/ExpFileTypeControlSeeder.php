<?php

namespace Database\Seeders;

use App\Models\ExpFileTypeControl;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpFileTypeControlSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ExpFileTypeControl::truncate();

        $data = [
            ['id' => 1, 'name_en' => 'Consult', 'name_es' => 'Consultar'],
            ['id' => 2, 'name_en' => 'Copy', 'name_es' => 'Copiar'],
            ['id' => 3, 'name_en' => 'Disclose', 'name_es' => 'Divulgar'],
        ];

        foreach ($data as $registry) {
            ExpFileTypeControl::create([
                'id' => $registry['id'],
                'name_en' => $registry['name_en'],
                'name_es' => $registry['name_es'],
            ]);
        }
    }
}
