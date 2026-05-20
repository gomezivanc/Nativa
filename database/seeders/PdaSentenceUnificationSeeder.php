<?php

namespace Database\Seeders;

use App\Models\PdaSentenceUnification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaSentenceUnificationSeeder extends Seeder
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
                'nombre' => 'CONCEJO DE ESTADO'
            ],
            [
                'id' => 2,
                'nombre' => 'CORTE SUPREMA DE JUSTICIA'
            ],
            [
                'id' => 3,
                'nombre' => 'CORTE CONSTITUCIONAL'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaSentenceUnification();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
