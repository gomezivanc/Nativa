<?php

namespace Database\Seeders;

use App\Models\FilingStructure;
use Illuminate\Database\Seeder;

class FilingStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('filing_structures')->truncate();
        //FilingStructure::truncate();
        $combinations = [
            ['id' => 1, 'filing_structure' => 'crt-merecepion_tiporad_yy-consecutivo'],
        ];

        // Iteramos sobre las combinaciones y las insertamos en la base de datos
        foreach ($combinations as $combination) {
            FilingStructure::create([
                'id' => $combination['id'], // Asignamos el id manualmente
                'filing_structure' => $combination['filing_structure'], // Este es el campo que almacena las combinaciones
            ]);
        }
    }
}