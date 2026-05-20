<?php

namespace Database\Seeders;

use App\Models\PdaProbabilities;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaProbabilitiesSeeder extends Seeder
{
    /**
     * Run the database seeds. 2024_04_17_135040 2024_04_17_115956
     *
     * @return void
     */
    public function run()
    {
        $arrayData = [
            [
                'id' => 1,
                'nombre' => 'PROBABLE'
            ],
            [
                'id' => 2,
                'nombre' => 'EVENTUAL'
            ],
            [
                'id' => 3,
                'nombre' => 'REMOTO'
            ]
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaProbabilities();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
