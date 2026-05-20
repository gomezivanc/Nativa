<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Protection;

class TrdSheet implements WithTitle, WithEvents
{
    protected $dependency;
    protected $conf;
    protected $isTemplate = false;

    function __construct($dependency, $conf, $isTemplate = false)
    {
        $this->dependency = $dependency;
        $this->conf = $conf;
        $this->isTemplate = $isTemplate;
    }

    public function title(): string
    {
        if ($this->isTemplate) {
            return 'PLANTILLA_TRD';
        }
        return $this->dependency?->code ?? 'TRD';
    }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function(BeforeSheet $event) {
                $sheet = $event->sheet;

                // $sheet->setCellValue($this->conf->unity_admin, $this->dependency->gdDependency?->name);
                $sheet->setCellValue($this->conf->unity_admin, 'CORPORACIÓN: CORTOLIMA');
               
                $sheet->getColumnDimension(preg_replace("/[^a-zA-Z]/", "", $this->conf->unity_admin))->setWidth(60);

                // $sheet->setCellValue($this->conf->dependency_name, $this->dependency->name);
                $sheet->setCellValue(
                    $this->conf->dependency_name,
                    $this->isTemplate
                        ? 'NOMBRE DEPENDENCIA:'
                        : 'NOMBRE DEPENDENCIA: ' . ($this->dependency->name ?? '')
                );
                $sheet->getColumnDimension(preg_replace("/[^a-zA-Z]/", "", $this->conf->dependency_name))->setWidth(60);

                $sheet->getStyle($this->conf->unity_admin.':'.$this->conf->dependency_name)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN, // Tipo de borde
                            'color' => ['argb' => 'FF000000'], // Color negro
                        ],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                $sheet->getStyle('A1:Z100')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);
                $sheet->getStyle('A1:Z100')->getProtection()->setLocked(Protection::PROTECTION_PROTECTED);

                // inicio de datos
                $initDataLetter = preg_replace("/[^a-zA-Z]/", "", $this->conf->init_data);
                $initDataNumber = preg_replace("/[^0-9]/", "", $this->conf->init_data);
                    
                $currentRow = $initDataNumber;
                $headerCode = $initDataNumber - 1;

                // Cabeceras del excel
                $sheet->setCellValue($initDataLetter.($headerCode - 1), __('documental_gestion.dependency.exportTrd.clasification.code'));
                $sheet->setCellValue($initDataLetter.$headerCode, 'D');
                $sheet->setCellValue($this->conf->serie.$headerCode, 'S');
                $sheet->setCellValue($this->conf->subserie.$headerCode, 'SB');
                $sheet->setCellValue($this->conf->series_sub_series_t_doc.$headerCode,  __('Series, subseries'));
                $sheet->setCellValue($this->conf->item_support_p.$headerCode, 'P');
                $sheet->setCellValue($this->conf->item_support_e.$headerCode, 'E');
                $sheet->setCellValue($this->conf->items_year_gestion.$headerCode, 'AG');
                $sheet->setCellValue($this->conf->items_year_central.$headerCode, 'AC');
                $sheet->setCellValue($this->conf->items_dispo_final_e.$headerCode, 'E');
                $sheet->setCellValue($this->conf->items_dispo_final_s.$headerCode, 'S');
                $sheet->setCellValue($this->conf->items_dispo_final_ct.$headerCode, 'CT');
                $sheet->setCellValue($this->conf->items_dispo_final_md.$headerCode, 'D/M');
                $sheet->setCellValue($this->conf->items_pro_subseries.$headerCode, __('documental_gestion.dependency.exportTrd.clasification.items_pro_subseries'));


                // Rango de "Retención"
                $startCell = $this->conf->items_year_gestion . ($headerCode - 1);
                $endColumn = $this->getNextColumn($this->conf->items_year_gestion);
                $endCell = $endColumn . ($headerCode - 1);
                $sheet->setCellValue($startCell, 'Retención');
                $sheet->mergeCells("$startCell:$endCell");

                // Aplicar borde negro al rango de "Retención"
                $sheet->getStyle("$startCell:$endCell")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('000000'));

                // Rango de "Disposición"
                $startCell = $this->conf->items_dispo_final_ct . ($headerCode - 1);
                $endColumn = $this->getNextColumn($this->conf->items_dispo_final_ct);
                $endCell = $endColumn . ($headerCode - 1);
                $sheet->setCellValue($startCell, 'Disposición');
                $sheet->mergeCells("$startCell:$endCell");

                // Aplicar borde negro al rango de "Disposición"
                $sheet->getStyle("$startCell:$endCell")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('000000'));
                // Fin Cabeceras del excel


                $sheet->getColumnDimension($this->conf->items_pro_subseries)->setWidth(120);

                // if ($this->dependency->current_version) {
                //     $data = json_decode($this->dependency->current_version->data_json);
                //     foreach ($data as $value) {
                //         // ===== SERIE =====
                //         $sheet->setCellValue($initDataLetter.$currentRow, $this->dependency->code);
                //         $sheet->setCellValue($this->conf->serie.$currentRow, $value->serie->code ?? '');
                //         $sheet->setCellValue($this->conf->series_sub_series_t_doc.$currentRow, $value->serie->name ?? '');
                //         $currentRow++;
                //         // ===== SUBSERIE (VALIDAR) =====
                //         if (!empty($value->subseries) && is_object($value->subseries)) {

                //             $sheet->setCellValue($initDataLetter.$currentRow, $this->dependency->code);
                //             $sheet->setCellValue($this->conf->serie.$currentRow, $value->serie->code ?? '');
                //             $sheet->setCellValue($this->conf->subserie.$currentRow, $value->subseries->code ?? '');
                //             $sheet->setCellValue($this->conf->series_sub_series_t_doc.$currentRow, $value->subseries->name ?? '');
                //             $sheet->setCellValue($this->conf->item_support_p.$currentRow, $value->subseries->item_support_p ?? '');
                //             $sheet->setCellValue($this->conf->item_support_e.$currentRow, $value->subseries->item_support_e ?? '');
                //             $sheet->setCellValue($this->conf->items_year_gestion.$currentRow, $value->subseries->items_year_gestion ?? '');
                //             $sheet->setCellValue($this->conf->items_year_central.$currentRow, $value->subseries->items_year_central ?? '');
                //             $sheet->setCellValue($this->conf->items_dispo_final_e.$currentRow, $value->subseries->items_dispo_final_e ?? '');
                //             $sheet->setCellValue($this->conf->items_dispo_final_s.$currentRow, $value->subseries->items_dispo_final_s ?? '');
                //             $sheet->setCellValue($this->conf->items_dispo_final_ct.$currentRow, $value->subseries->items_dispo_final_ct ?? '');
                //             $sheet->setCellValue($this->conf->items_dispo_final_md.$currentRow, $value->subseries->items_dispo_final_md ?? '');
                //             $sheet->setCellValue($this->conf->items_pro_subseries.$currentRow, $value->subseries->items_pro_subseries ?? '');

                //             $currentRow++;
                //         }

                //         if (!empty($value->types)) {
                //             foreach ($value->types as $type) {
                //                 $sheet->setCellValue($initDataLetter.$currentRow, '');
                //                 $sheet->setCellValue($this->conf->series_sub_series_t_doc.$currentRow, $type->name ?? '');
                //                 $currentRow++;
                //             }
                //         }
                //     }
                // }

                // Estilo común para todas las celdas
                $commonStyle = [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN, // Tipo de borde
                            'color' => ['argb' => 'FF000000'],   // Color negro
                        ],
                    ],
                    'alignment' => [
                        // 'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ];

                // Lista de columnas para aplicar los estilos
                $columns = [
                    $initDataLetter.($initDataNumber - 2) . ':' . $initDataLetter . $currentRow,
                    $this->conf->serie . ($initDataNumber - 1) . ':' . $this->conf->serie . $currentRow,
                    $this->conf->subserie . ($initDataNumber - 1) . ':' . $this->conf->subserie . $currentRow,
                    $this->conf->series_sub_series_t_doc . ($initDataNumber - 1) . ':' . $this->conf->series_sub_series_t_doc . $currentRow,
                    $this->conf->item_support_p . ($initDataNumber - 1) . ':' . $this->conf->item_support_p . $currentRow,
                    $this->conf->item_support_e . ($initDataNumber - 1) . ':' . $this->conf->item_support_e . $currentRow,
                    $this->conf->items_year_gestion . ($initDataNumber - 1) . ':' . $this->conf->items_year_gestion . $currentRow,
                    $this->conf->items_year_central . ($initDataNumber - 1) . ':' . $this->conf->items_year_central . $currentRow,
                    $this->conf->items_dispo_final_e . ($initDataNumber - 1) . ':' . $this->conf->items_dispo_final_e . $currentRow,
                    $this->conf->items_dispo_final_s . ($initDataNumber - 1) . ':' . $this->conf->items_dispo_final_s . $currentRow,
                    $this->conf->items_dispo_final_ct . ($initDataNumber - 1) . ':' . $this->conf->items_dispo_final_ct . $currentRow,
                    $this->conf->items_dispo_final_md . ($initDataNumber - 1) . ':' . $this->conf->items_dispo_final_md . $currentRow,
                    $this->conf->items_pro_subseries . ($initDataNumber - 1) . ':' . $this->conf->items_pro_subseries . $currentRow,
                ];
                $headerCode2 = $headerCode - 1;

                $sheet->getStyle("A$headerCode2:Z$headerCode2")->applyFromArray([
                    'font' => [
                        'bold' => true, // Aplicar negrilla
                    ],
                ]);
                $sheet->getStyle("A$headerCode:Z$headerCode")->applyFromArray([
                    'font' => [
                        'bold' => true, // Aplicar negrilla
                    ],
                ]);
                $sheet->getStyle($this->conf->items_pro_subseries)->getAlignment()->setWrapText(true);
                // Aplicar estilos a todas las columnas
                foreach ($columns as $range) {
                    $sheet->getStyle($range)->applyFromArray($commonStyle);
                }
                $sheet->setShowGridlines(false);
            },
        ];
    }

    private function getNextColumn(string $currentColumn, int $offset = 1): string {
        $currentColumn = strtoupper($currentColumn); // Asegurarse de que esté en mayúsculas
        $currentIndex = array_reduce(str_split($currentColumn), function ($carry, $char) {
            return $carry * 26 + (ord($char) - 64); // Convertir letras a índice (A=1, B=2, ..., Z=26)
        }, 0);
        $nextIndex = $currentIndex + $offset; // Desplazamiento de columnas
        $nextColumn = '';
        while ($nextIndex > 0) {
            $remainder = ($nextIndex - 1) % 26;
            $nextColumn = chr(65 + $remainder) . $nextColumn; // Convertir índice a letras
            $nextIndex = intval(($nextIndex - $remainder) / 26);
        }
        return $nextColumn;
    }
}
