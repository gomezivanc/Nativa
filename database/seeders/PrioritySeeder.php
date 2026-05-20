<?php

namespace Database\Seeders;

use App\Models\Priority;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Priority::truncate();

        $priorities = [
            ['id' => 1, 'name_en' => 'High', 'name_es' => 'Alto'],
            ['id' => 2, 'name_en' => 'Medium', 'name_es' => 'Medio'],
            ['id' => 3, 'name_en' => 'Low', 'name_es' => 'Bajo'],
        ];
    
        foreach ($priorities as $priority) {
            Priority::create([
                'id' => $priority['id'],
                'name_en' => $priority['name_en'],
                'name_es' => $priority['name_es'],
            ]);
        }
    }
}