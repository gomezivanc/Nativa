<?php

namespace Database\Seeders;

use App\Models\PdaExistResource;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaExistResourceSeeder extends Seeder
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
            [
                'id' => 4,
                'nombre' => 'SILENCIO ADMINISTRATIVO'
            ],
            [
                'id' => 5,
                'nombre' => 'NO SE TIENE INFORMACION'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaExistResource();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
