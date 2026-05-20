<?php

namespace Database\Seeders;

use App\Models\PdaComiteRepetition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaComiteRepetitionSeeder extends Seeder
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
                'nombre' => 'CON REPETICION'
            ],
            [
                'id' => 2,
                'nombre' => 'NO REPETICION'
            ]
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaComiteRepetition();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
