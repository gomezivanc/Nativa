<?php

namespace Database\Seeders;

use App\Models\PdaExhaustion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaExhaustionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arrayData = [
            [
                'id' => 1,
                'nombre' => 'SI'
            ],
            [
                'id' => 2,
                'nombre' => 'NO'
            ],
            [
                'id' => 3,
                'nombre' => 'NO REQUIERE'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaExhaustion();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
