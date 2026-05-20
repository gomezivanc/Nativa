<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Services\ExcelService;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProcessContableExport implements FromView, WithStyles
{
    private $data;
    private $oExcelService;

    public function __construct($data)
    {
        $this->data = $data;
        // ExcelService - valores por defecto
        $this->oExcelService = new ExcelService();
        $this->oExcelService->sPathImageDefault = '';
    }

    public function view(): View
    {
        return view('Excel.Export.ProcessContableExcel', $this->data);
    }

    public function styles(Worksheet $oSheet)
    {

        // Establecer la alineación centrada
        $oSheet->getStyle('C')->getAlignment()->setHorizontal('center');

        $nRow = 1;
        $nColumna = 1;
        $sColumnaS = '';
        $sColumnaE = '';
        $this->oExcelService->oSheetActive = $oSheet;

        $aDfColumnsStyle = [];
        // Tipo
        $sColumnaS = $this->oExcelService->getStrintColumna($nColumna);
        $nColumna += 13;
        $sColumnaE = $this->oExcelService->getStrintColumna($nColumna);
        $aDfColumnsStyle[] = ['type' => 'text', 'typeStyle' => 'subTitle', 'merge' => FALSE, 'cell' => $sColumnaS . $nRow . ':' . $sColumnaE . $nRow];

        $aDfColumnsStyle[] = ['type' => 'text', 'typeStyle' => 'title', 'merge' => FALSE, 'cell' => 'A1:' . $sColumnaE . '1'];

        // Aplicar styles
        $this->oExcelService->applyStyles($aDfColumnsStyle);
        return [];
    }
}
