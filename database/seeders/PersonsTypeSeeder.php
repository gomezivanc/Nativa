<?php

namespace Database\Seeders;

use App\Models\PersonsType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PersonsTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'name' => 'Persona juridica',
            ],
            [
                'id' => 2,
                'name' => 'Persona natural',
            ],
        ];

        foreach ($data as $key => $value) {
            $model = new PersonsType();
            $model->id = $value['id'];
            $model->name = $value['name'];
            $model->save();
        }
    }
}
