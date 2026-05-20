<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DestinatariesImport implements ToArray, WithHeadingRow
{
    protected $data = [];

     /**
     * Convierte el archivo Excel en un array.
     */
    public function array(array $rows)
    {

        foreach ($rows as $key => $row) {
            if(empty($row['documento_o_nit'])) {
                continue;
            }
            $item = [
                'name_social_reason_sender' => $row['nombre_o_razon_social'],
                'first_surname_legal_representative_sender' => $row['apellido_representante_legal'],
                'document_nit_sender' => $row['documento_o_nit'],
                'address_sender' => $row['direccion'],
                'email_sender' => $row['correo_electronico'],
                'phone_sender' => $row['telefono'],
                'country_id' => $row['pais'],
                'department_id' => $row['departamento'],
                'city_id' => $row['ciudad'],
                'type_person_id_sender' => $row['tipos_de_persona'],
            ];
    
            $this->data[] = $item;
        }

    }

    public function getData() {
        return $this->data;
    }
}
