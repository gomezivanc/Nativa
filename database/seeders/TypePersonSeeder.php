<?php

namespace Database\Seeders;

use App\Models\TypePerson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypePersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //TypePerson::truncate();

        $data = [
            ['id' => 1, 'name_en' => 'Legal Entity', 'name_es' => 'Persona Jurídica'],
            ['id' => 2, 'name_en' => 'Natural Person', 'name_es' => 'Persona Natural'],
        ];

        foreach ($data as $registry) {
            TypePerson::create([
                'id' => $registry['id'],
                'name_en' => $registry['name_en'],
                'name_es' => $registry['name_es'],
            ]);
        }
    }
}
