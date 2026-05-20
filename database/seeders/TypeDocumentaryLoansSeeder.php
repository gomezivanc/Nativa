<?php

namespace Database\Seeders;

use App\Models\TypeDocumentaryLoans;
use App\Models\TypePerson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeDocumentaryLoansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['id' => 1, 'name_en' => 'Archived', 'name_es' => 'Archivado'],
            ['id' => 2, 'name_en' => 'Loan application', 'name_es' => 'Solicitud préstamo'],
            ['id' => 3, 'name_en' => 'Loan approved', 'name_es' => 'Préstamo aprobado'],
            ['id' => 4, 'name_en' => 'Loan cancelled', 'name_es' => 'Préstamo cancelado'],
            ['id' => 5, 'name_en' => 'Loan repaid', 'name_es' => 'Préstamo devuelto'],
            ['id' => 6, 'name_en' => 'Archived - loan application', 'name_es' => 'Archivado - solicitud de prestamo'],
        ];

        foreach ($data as $registry) {
            TypeDocumentaryLoans::create([
                'id' => $registry['id'],
                'name_en' => $registry['name_en'],
                'name_es' => $registry['name_es'],
            ]);
        }
    }
}
