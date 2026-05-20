<?php

namespace Database\Seeders;

use App\Models\TypeLoan;
use App\Models\TypeRequirements;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeLoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['id' => 1, 'name_en' => 'In-room consultation', 'name_es' => 'Consulta en sala'],
            ['id' => 2, 'name_en' => 'Physical loan', 'name_es' => 'Préstamo fisico'],
            ['id' => 3, 'name_en' => 'Digital loan', 'name_es' => 'Préstamo digital'],
        ];

        foreach ($data as $registry) {
            TypeLoan::create([
                'id' => $registry['id'],
                'name_en' => $registry['name_en'],
                'name_es' => $registry['name_es'],
            ]);
        }
    }
}
