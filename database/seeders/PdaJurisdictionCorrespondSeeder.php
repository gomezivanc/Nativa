<?php

namespace Database\Seeders;

use App\Models\PdaJurisdictionCorrespond;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaJurisdictionCorrespondSeeder extends Seeder
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
                'nombre' => 'CONTENCIOSA'
            ],
            [
                'id' => 2,
                'nombre' => 'CONSTITUCIONAL'
            ],
            [
                'id' => 3,
                'nombre' => 'CIVIL'
            ],
            [
                'id' => 4,
                'nombre' => 'LABORAL'
            ],
            [
                'id' => 5,
                'nombre' => 'PENAL'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaJurisdictionCorrespond();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
