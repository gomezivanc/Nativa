<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		//Menú Centralizado
		DB::table('departamentos')->insert([
        	[
	        	'nombre'            =>  'Antioquia',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '5',
	        	'codigo_divipole'   =>  '1',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Atlántico',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '8',
	        	'codigo_divipole'   =>  '3',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Bolívar',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '13',
	        	'codigo_divipole'   =>  '5',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Boyacá',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '15',
	        	'codigo_divipole'   =>  '7',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Caldas',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '17',
	        	'codigo_divipole'   =>  '9',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Cauca',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '19',
	        	'codigo_divipole'   =>  '11',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Cesar',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '20',
	        	'codigo_divipole'   =>  '12',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Córdoba',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '23',
	        	'codigo_divipole'   =>  '13',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Cundinamarca',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '25',
	        	'codigo_divipole'   =>  '15',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Bogotá D.C',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '11',
	        	'codigo_divipole'   =>  '16',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Chocó',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '27',
	        	'codigo_divipole'   =>  '17',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Huila',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '41',
	        	'codigo_divipole'   =>  '19',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Magdalena',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '47',
	        	'codigo_divipole'   =>  '21',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Nariño',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '52',
	        	'codigo_divipole'   =>  '23',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Risaralda',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '66',
	        	'codigo_divipole'   =>  '24',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Norte de Santander',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '54',
	        	'codigo_divipole'   =>  '25',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Quindío',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '63',
	        	'codigo_divipole'   =>  '26',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Santander',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '68',
	        	'codigo_divipole'   =>  '27',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Sucre',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '70',
	        	'codigo_divipole'   =>  '28',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Tolima',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '73',
	        	'codigo_divipole'   =>  '29',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Valle del Cauca',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '76',
	        	'codigo_divipole'   =>  '31',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Arauca',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '81',
	        	'codigo_divipole'   =>  '40',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Caquetá',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '18',
	        	'codigo_divipole'   =>  '44',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Casanare',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '85',
	        	'codigo_divipole'   =>  '46',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'La Guajira',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '44',
	        	'codigo_divipole'   =>  '48',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Guainía',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '94',
	        	'codigo_divipole'   =>  '50',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Meta',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '50',
	        	'codigo_divipole'   =>  '52',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Guaviare',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '95',
	        	'codigo_divipole'   =>  '54',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Archipiélago de San Andrés, Providencia y Santa Catalina',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '88',
	        	'codigo_divipole'   =>  '56',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Amazonas',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '91',
	        	'codigo_divipole'   =>  '60',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Putumayo',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '86',
	        	'codigo_divipole'   =>  '64',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Vaupés',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '97',
	        	'codigo_divipole'   =>  '68',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Vichada',
	        	'country_id'       =>  48,
	        	'codigo_dane'       =>  '99',
	        	'codigo_divipole'   =>  '72',
				'estado'            =>  '1',
            ],
            [
                'nombre'            =>  'Consulados',
	        	'country_id' =>         48,
	        	'codigo_dane'       =>  null,
	        	'codigo_divipole'   =>  '88',
				'estado'            =>  '1',
            ],
        ]);
    }
}
