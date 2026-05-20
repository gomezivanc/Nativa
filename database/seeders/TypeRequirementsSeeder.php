<?php

namespace Database\Seeders;

use App\Models\TypeRequirements;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeRequirementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['id' => 1, 'name_es' => 'Carpeta', 'name_en' => 'folder'],
            ['id' => 2, 'name_es' => 'Documento', 'name_en' => 'Document'],
        ];

        foreach ($data as $registry) {
            TypeRequirements::create([
                'id' => $registry['id'],
                'name_en' => $registry['name_en'],
                'name_es' => $registry['name_es'],
            ]);
        }
    }
}
