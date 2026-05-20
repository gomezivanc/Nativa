<?php

namespace Database\Seeders;

use App\Models\ComitteeDecition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ComitteeDecitionSeeder extends Seeder
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
                'nombre' => 'Iniciar'
            ],
            [
                'id' => 2,
                'nombre' => 'No Iniciar'
            ],
            [
                'id' => 3,
                'nombre' => 'Aplazamiento'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new ComitteeDecition();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
