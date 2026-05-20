<?php

namespace Database\Seeders;

use App\Models\ProcessInstance;
use App\Models\ProcessResults;
use Illuminate\Database\Seeder;

class ProcessResultsSeeder extends Seeder
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
                'nombre' => 'FAVORABLE'
            ],
            [
                'id' => 2,
                'nombre' => 'DESFAVORABLE'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new ProcessResults();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
