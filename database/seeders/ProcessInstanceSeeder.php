<?php

namespace Database\Seeders;

use App\Models\ProcessInstance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProcessInstanceSeeder extends Seeder
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
                'nombre' => 'PRIMERA INSTANCIA'
            ],
            [
                'id' => 2,
                'nombre' => 'SEGUNDA INSTANCIA'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new ProcessInstance();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
