<?php

namespace Database\Seeders;

use App\Models\PdaReclamation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaReclamationSeeder extends Seeder
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
                'nombre' => 'NO SE TIENE INFORMACIÓN'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaReclamation();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
