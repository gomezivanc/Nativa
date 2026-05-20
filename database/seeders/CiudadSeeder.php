<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CiudadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ruta = database_path('json/ciudadesDoc.json');
        $ciudades = file_get_contents($ruta);

        foreach(json_decode($ciudades) as $ciudad)
        {
            DB::table('ciudades')
            ->insert(
                array(
					'id_departamento'	=> $ciudad->id_departamento,
                    'nombre'			=> $ciudad->nombre,
                    'codigo_dane'		=> $ciudad->codigo_dane,
                    'codigo_divipole'	=> $ciudad->codigo_divipole,
                    'estado'			=> $ciudad->estado
                )
            );
        }
    }
}
