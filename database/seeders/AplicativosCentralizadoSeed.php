<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Helpers\Equivalencias;

class AplicativosCentralizadoSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::connection('centralizado')->table('aplicativos')->insert([
        // 	[
	    //     	'id'		     => '1',
	    //     	'nombre' 	     => 'Plantilla Dinamico',
	    //     	'nombre_db'      => 'dinamico',
	    //     	'url_logo' 	     => 'images/impresion.png',
        //         'url_produccion' => Equivalencias::urlDinamico(),
	    //     	'estado' 	     => '1'
	    //     ]
        // ]);
    }
}
