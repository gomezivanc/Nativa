<?php

namespace Database\Seeders;

use App\Models\TypeConciliation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeConciliationSeeder extends Seeder
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
                'nombre' => "EN EL PROCESO"
            ],
            [
                'id' => 2,
                'nombre' => "EXTRAPROCESAL"
            ]
        ];

        foreach ($arrayData as $key => $value) {
            $data = new TypeConciliation();
            $data->id = $value['id'];
            $data->nombre = $value['nombre'];
            $data->save();
        }
    }
}
