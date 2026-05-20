<?php

namespace Database\Seeders;

use App\Models\Priority;
use App\Models\ReceptionMedium;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReceptionMediumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ReceptionMedium::delete();

        $receptionMedia = [
            [
                'id' => 1,
                'name_en' => 'Physical Window',
                'name_es' => 'Ventanilla física',
            ],
            [
                'id' => 2,
                'name_en' => 'Physical Mail',
                'name_es' => 'Correo físico',
            ],
            [
                'id' => 3,
                'name_en' => 'Virtual Window',
                'name_es' => 'Ventanilla virtual',
            ],
            [
                'id' => 4,
                'name_en' => 'Web Portal',
                'name_es' => 'Portal Web',
            ],
            [
                'id' => 5,
                'name_en' => 'Website',
                'name_es' => 'Sitio Web',
            ],
            [
                'id' => 6,
                'name_en' => 'Email',
                'name_es' => 'Correos electrónico',
            ],
            [
                'id' => 7,
                'name_en' => 'Phone',
                'name_es' => 'Telefónico',
            ],
            [
                'id' => 8,
                'name_en' => 'System Assignment',
                'name_es' => 'Asignación por sistema',
            ],
        ];
    
        foreach ($receptionMedia as $receptionMedium) {
            ReceptionMedium::create([
                'id' => $receptionMedium['id'],
                'name_en' => $receptionMedium['name_en'],
                'name_es' => $receptionMedium['name_es'],
            ]);
        }
    }
}