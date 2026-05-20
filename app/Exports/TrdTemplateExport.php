<?php

namespace App\Exports;

use App\Models\ConfTrd;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class TrdTemplateExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        $conf = ConfTrd::whereNull('deleted_at')->first();

        return [
            new TrdSheet(null, $conf, true) // le pasamos flag de plantilla
        ];
    }
}
