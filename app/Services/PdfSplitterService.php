<?php

namespace App\Services;

use App\Exceptions\PdfSegmentationException;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;
use Smalot\PdfParser\Parser;

class PdfSplitterService
{
    /**
     * Divide un PDF físico en múltiples archivos PDF independientes.
     *
     * @param string $sourcePath Ruta relativa dentro de storage/app/public/
     * @param array $segments Array de segmentos: [['page_start' => 1, 'page_end' => 5, 'type_doc_id' => 2], ...]
     * @param string $baseDirectory Directorio base donde guardar los segmentos (ej: 'exp_file/123/')
     * @param string $baseFilename Nombre base del archivo para generar nombres únicos
     * @return array Array de rutas generadas, en el mismo orden de los segmentos
     * @throws PdfSegmentationException
     */
    public function split(string $sourcePath, array $segments, string $baseDirectory, string $baseFilename): array
    {
        $fullSourcePath = storage_path('app/public/' . $sourcePath);

        if (!file_exists($fullSourcePath)) {
            throw new PdfSegmentationException('El archivo fuente no existe: ' . $sourcePath);
        }

        $pdfReader = new Fpdi();

        try {
            $pageCount = $pdfReader->setSourceFile($fullSourcePath);
        } catch (\Exception $e) {
            throw new PdfSegmentationException(
                'El PDF no es compatible con la segmentación: ' . $e->getMessage(),
                0,
                $e
            );
        }

        $generatedPaths = [];
        $nameWithoutExt = pathinfo($baseFilename, PATHINFO_FILENAME);

        foreach ($segments as $index => $segment) {
            $start = (int) ($segment['page_start'] ?? 1);
            $end   = (int) ($segment['page_end'] ?? $start);

            if ($start < 1 || $end > $pageCount || $start > $end) {
                throw new PdfSegmentationException(
                    "Rango de páginas inválido para el segmento #{$index}: {$start}-{$end}"
                );
            }

            $pdf = new Fpdi();

            try {
                $pdf->setSourceFile($fullSourcePath);

                for ($page = $start; $page <= $end; $page++) {
                    $template = $pdf->importPage($page);
                    $size = $pdf->getTemplateSize($template);
                    $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                    $pdf->useTemplate($template);
                }

                $segmentFilename = $nameWithoutExt . '_segmento_' . ($index + 1) . '.pdf';
                $relativePath = rtrim($baseDirectory, '/') . '/' . $segmentFilename;
                $fullOutputPath = storage_path('app/public/' . $relativePath);

                $outputDir = dirname($fullOutputPath);
                if (!is_dir($outputDir)) {
                    mkdir($outputDir, 0755, true);
                }

                $pdf->Output('F', $fullOutputPath);

                $generatedPaths[] = $relativePath;
            } catch (\Exception $e) {
                // Limpiar archivos generados parcialmente en caso de fallo
                foreach ($generatedPaths as $generatedPath) {
                    $fullPath = storage_path('app/public/' . $generatedPath);
                    if (file_exists($fullPath)) {
                        unlink($fullPath);
                    }
                }

                throw new PdfSegmentationException(
                    'Error al generar el segmento #' . ($index + 1) . ': ' . $e->getMessage(),
                    0,
                    $e
                );
            }
        }

        // Eliminar el archivo original si todos los segmentos se generaron correctamente
        if (file_exists($fullSourcePath)) {
            unlink($fullSourcePath);
        }

        return $generatedPaths;
    }

    /**
     * Valida que los segmentos no se crucen, estén dentro del total de páginas,
     * y que cada rango sea lógico (start <= end, start >= 1).
     *
     * @param array $segments Array de segmentos: [['page_start' => 1, 'page_end' => 5], ...]
     * @param int $totalPages Total de páginas del PDF
     * @throws PdfSegmentationException
     */
    /**
     * Obtiene el número total de páginas de un PDF.
     *
     * @param string $relativePath Ruta relativa dentro de storage/app/public/
     * @return int
     */
    public function getTotalPages(string $relativePath): int
    {
        $parser = new Parser();
        $pdf = $parser->parseFile(storage_path('app/public/' . $relativePath));
        return count($pdf->getPages());
    }

    public function validateSegments(array $segments, int $totalPages): void
    {
        $usedPages = [];

        foreach ($segments as $index => $segment) {
            $start = (int) ($segment['page_start'] ?? 1);
            $end   = (int) ($segment['page_end'] ?? $start);

            if ($start > $end) {
                throw new PdfSegmentationException(
                    "segment_page_end_less_start|Segmento #{$index}: {$start} > {$end}"
                );
            }

            if ($start < 1) {
                throw new PdfSegmentationException(
                    "segment_page_start_less_one|Segmento #{$index}: start={$start}"
                );
            }

            if ($end > $totalPages) {
                throw new PdfSegmentationException(
                    "segment_page_end_exceeds_total|Segmento #{$index}: end={$end}, total={$totalPages}"
                );
            }

            for ($i = $start; $i <= $end; $i++) {
                if (in_array($i, $usedPages)) {
                    throw new PdfSegmentationException(
                        "segment_pages_overlap|Segmento #{$index}: página {$i} ya usada"
                    );
                }
                $usedPages[] = $i;
            }
        }
    }
}
