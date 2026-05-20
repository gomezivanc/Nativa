<?php

namespace Database\Seeders;

use App\Models\GDDependency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DependencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dependencies = [
            [
                'id' => 1,
                'code' => '999',
                'creado_por_id' => 1,
                'regional_id' => 1,
                'name' => 'Prueba dependencia',
            ]
        ];

        foreach ($dependencies as $dependency) {
            GDDependency::create([
                'id' => $dependency['id'],
                'code' => $dependency['code'],
                'creado_por_id' => $dependency['creado_por_id'],
                'regional_id' => $dependency['regional_id'],
                'name' => $dependency['name'],
            ]);
        }
    }
}
