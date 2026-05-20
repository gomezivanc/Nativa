<?php

namespace App\Exports;

use App\Models\ConfTrd;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class TrdExport implements WithMultipleSheets
{
    use Exportable;
    protected $data;

    function __construct($data)
    {
        return $this->data = $data;
    }

    public function sheets(): array
    {
        $sheet = [];
        $conf = ConfTrd::whereNull('deleted_at')->first();
        foreach ($this->data as $key => $value) {
            $sheet[] = new TrdSheet($value,$conf);
        }


        return $sheet;
    }
}
