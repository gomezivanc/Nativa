<?php

namespace Database\Seeders;

use App\Models\TypesFilings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeFilingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        //TypesFilings::truncate();

        $data = [
            ['id' => 1, 'name' => 'Salida', 'code' => '004','description' => 'prueba','creado_por_id' => 1],
            ['id' => 2, 'name' => 'Entrada', 'code' => '003','description' => 'prueba','creado_por_id' => 1],
            ['id' => 3, 'name' => 'Memorando', 'code' => '002','description' => 'prueba','creado_por_id' => 1],
            ['id' => 4, 'name' => 'PQRS', 'code' => '001','description' => 'prueba','creado_por_id' => 1],
        ];
    
        foreach ($data as $field) {
            TypesFilings::create([
                'id' => $field['id'],
                'name' => $field['name'],
                'code' => $field['code'],
                'description' => $field['description'],
                'creado_por_id' => $field['creado_por_id'],
            ]);
        }
    }
}
