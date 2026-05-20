<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ClasificationDependecyExport implements WithMultipleSheets
{
    protected $data;
    protected $rowsPerPage;

    public function __construct(Collection $data, int $rowsPerPage = 3)
    {
        $this->data = $data;
        $this->rowsPerPage = $rowsPerPage;
    }

    /**
     * Generar hojas múltiples basadas en los datos y el número de filas por página.
     */
    public function sheets(): array
    {
        $sheets = [];
        $chunks = $this->data->chunk($this->rowsPerPage); // Dividir los datos en grupos
        foreach ($chunks as $index => $chunk) {
            $sheets[] = new ClasificationDependecySheet($chunk, $index + 1);
        }

        return $sheets;
    }
}
