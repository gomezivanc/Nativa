<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FilingStructure;
use App\Models\TypeOfProcedure;

class LimpiarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tramites = [
            ['id' => 1, 'name' => 'Pericion',   'response_time' => 15],
            ['id' => 2, 'name' => 'Queja',      'response_time' => 10],
            ['id' => 3, 'name' => 'Reclamo',    'response_time' => 10],
            ['id' => 4, 'name' => 'Sugerencia', 'response_time' => 30],
            ['id' => 5, 'name' => 'Derecho de peticion', 'response_time' => 15],
            ['id' => 6, 'name' => 'Denuncias',  'response_time' => 5],
            ['id' => 7, 'name' => 'Recursos (Reposicion / Apelacion)', 'response_time' => 10],
            ['id' => 8, 'name' => 'Solicitud entidades oficiales', 'response_time' => 10],
            ['id' => 9, 'name' => 'Solicitud de informacion', 'response_time' => 8],
            ['id' => 10,'name' => 'Facturas',   'response_time' => 30],
        ];

        foreach ($tramites as $tramite) {
            TypeOfProcedure::create([
                'id' => $tramite['id'], 
                'name' => $tramite['name'], 
                'response_time' => $tramite['response_time'],
            ]);
        }

        $combinations = [
            ['id' => 25, 'filing_structure' => 'crt-merecepion_tiporad_yy-consecutivo']
        ];

        foreach ($combinations as $combination) {
            FilingStructure::create([
                'id' => $combination['id'], // Asignamos el id manualmente
                'filing_structure' => $combination['filing_structure'], // Este es el campo que almacena las combinaciones
            ]);
        }
    }
}
