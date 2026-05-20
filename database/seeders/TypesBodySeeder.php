<?php

namespace Database\Seeders;

use App\Models\TypesBody;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypesBodySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('types_bodies')->delete();

        $data = [
            [
                'id' => 1,
                'name' => 'A',
            ],
            [
                'id' => 2,
                'name' => 'B',
            ],
        ];

        foreach ($data as $key => $value) {
            TypesBody::create($value);
        }
    }
}
