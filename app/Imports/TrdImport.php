<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;

class TrdImport implements OnEachRow
{
    public $cells = [];

    public function onRow(Row $row)
    {
        // Índice de fila (comienza en 1)
        $rowIndex = $row->getIndex();

        // Datos de la fila como un array asociativo
        $rowData = $row->toArray();

        // Iterar por las columnas de la fila
        $columnIndex = 0; // Índice de la columna (A=0, B=1, etc.)
        foreach ($rowData as $key => $value) {
            if (!is_null($value)) {
                // Convertir índice de columna a letra (A, B, C, ...)
                $columnLetter = chr(65 + $columnIndex); 
                
                // Obtener celda completa (ejemplo: A2, B3, etc.)
                $cell = $columnLetter . $rowIndex;

                // Registrar o manejar el dato y su celda
                logger("Dato: {$value}, Celda: {$cell}");

                $this->cells[] = [
                    'cell' => $cell,
                    'value' => $value
                ];
            }
            $columnIndex++;
        }
    }
}
