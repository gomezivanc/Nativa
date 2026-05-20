<?php

namespace Database\Seeders;

use App\Models\PdaAcceptRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaAcceptRequestSeeder extends Seeder
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
                'nombre' => 'SI - (REGISTRAR ETAPA 4 - FALLO)'
            ],
            [
                'id' => 2,
                'nombre' => 'NO - (REGISTRAR ETAPA 3 - JUDICIAL)'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaAcceptRequest();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
