<?php

namespace Database\Seeders;

use App\Models\TypeAmount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeAmountSeeder extends Seeder
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
                'nombre' => 'Determinada'
            ],
            [
                'id' => 2,
                'nombre' => 'Indeterminada'
            ],
            [
                'id' => 3,
                'nombre' => 'Sin Cuantia'
            ]
        ];

        foreach ($arrayData as $key => $value) {
            $data = new TypeAmount();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
