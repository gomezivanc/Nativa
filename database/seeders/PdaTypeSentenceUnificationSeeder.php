<?php

namespace Database\Seeders;

use App\Models\PdaTypeSentenceUnification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PdaTypeSentenceUnificationSeeder extends Seeder
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
                'nombre' => 'SU'
            ],
            [
                'id' => 2,
                'nombre' => 'C'
            ],
            [
                'id' => 3,
                'nombre' => 'T'
            ],
        ];

        foreach ($arrayData as $key => $value) {
            $data = new PdaTypeSentenceUnification();
            $data['id'] = $value['id'];
            $data['nombre'] = $value['nombre'];
            $data->save();
        }
    }
}
