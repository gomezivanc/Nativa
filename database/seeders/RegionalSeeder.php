<?php

namespace Database\Seeders;

use App\Models\Regional;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegionalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        //Regional::truncate();

        $regionales = [
            ['id' => 1,'creado_por_id'=>1, 'city_id' => 1001, 'country_id' => 48, 'departament_id' => 10, 'name' => 'Prueba regional', 'sigla' => "PRB"]
        ];

        foreach ($regionales as $regional) {
            Regional::create([
                'id' => $regional['id'],
                'city_id' => $regional['city_id'],
                'country_id' => $regional['country_id'],
                'departament_id' => $regional['departament_id'],
                'name' => $regional['name'],
                'creado_por_id' => $regional['creado_por_id'],
                'sigla' => $regional['sigla']
            ]);
        }
    }
}
