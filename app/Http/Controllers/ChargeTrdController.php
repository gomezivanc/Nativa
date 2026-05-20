<?php

namespace App\Http\Controllers;

use App\Imports\TrdImport;
use App\Repositories\DependencyHistoricRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ChargeTrdController extends Controller
{
    public function __construct(private TrdRepository $trdRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/chargeTrd/Index", []);
    }

    // store - update
    function store(Request $request)
    {
        if (!$request->file) {
            return response()->json(['error' => 'No file provided.'], 400);
        }
        // Extraer los datos codificados en base64 después de la coma
        $fileData = substr($request->file, strpos($request->file, ',') + 1);

        // Decodificar los datos de base64
        $decodedData = base64_decode($fileData);

        if ($decodedData === false) {
            return response()->json(['error' => 'Failed to decode the file.'], 400);
        }

        // Definir la ruta para el archivo temporal
        $temporaryDirectory = storage_path('app');
        $temporaryFilePath = $temporaryDirectory . '/temp_import_file.xlsx';

        // Asegurarse de que el directorio exista
        if (!is_dir($temporaryDirectory)) {
            mkdir($temporaryDirectory, 0755, true);
        }

        // Guardar el archivo en el sistema de archivos
        file_put_contents($temporaryFilePath, $decodedData);

        DB::beginTransaction();
        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($temporaryFilePath);

            $processedData = [];

            foreach ($spreadsheet->getWorksheetIterator() as $sheet) {

                $sheetName = $sheet->getTitle();
                $dependencyRaw = $sheet->getCell('E8')->getValue();
                $dependencyName = preg_replace('/^NOMBRE DEPENDENCIA:\s*/i', '', $dependencyRaw);
                $dependencyName = trim($dependencyName);
                $highestRow = $sheet->getHighestRow();

                $seriesConSubseries = [];
                $datosSerie = [];
                $datosSubSerie = [];
                $retencion = [];
                $error = false;
                $cantidadErrores = 0;
                $nombreError = [];

                for ($row = 13; $row <= $highestRow; $row++) {

                    $dependencyCode = trim($sheet->getCell("B$row")->getValue());
                    $serieCodigo    = trim($sheet->getCell("C$row")->getValue());
                    $subserieCodigo = trim($sheet->getCell("D$row")->getValue());
                    $nombre         = trim($sheet->getCell("E$row")->getValue());

                    $papel               = $sheet->getCell("F$row")->getValue();
                    $electronico         = $sheet->getCell("G$row")->getValue();
                    $archivoGestion      = $sheet->getCell("H$row")->getValue();
                    $archivoCentral      = $sheet->getCell("I$row")->getValue();
                    $eliminacion         = $sheet->getCell("J$row")->getValue();
                    $seleccion           = $sheet->getCell("K$row")->getValue();
                    $conservacionTotal   = $sheet->getCell("L$row")->getValue();
                    $digitalizacionMicro = $sheet->getCell("M$row")->getValue();
                    $procedimiento       = $sheet->getCell("N$row")->getValue();

                    if($dependencyCode !== $sheetName && $dependencyCode != null) {
                        $error = true;
                        $cantidadErrores++;
                        $nombreError[]= 'Error en la hoja: '.$sheetName.' - Código de dependencia no coincide en la fila '.$row;
                        continue;
                    }

                    if(!$dependencyCode && $serieCodigo && !$subserieCodigo) {
                        $error = true;
                        $cantidadErrores++;
                        $nombreError[]= 'Error en la hoja: '.$sheetName.' - Sin Código de dependencia En la Serie '.$serieCodigo . ' Fila '.$row;
                        continue;
                    }

                    if(!$serieCodigo && $subserieCodigo) {
                        $error = true;
                        $cantidadErrores++;
                        $nombreError[]= 'Error en la hoja: '.$sheetName.' - Sin Código de Serie En la SubSerie '.$subserieCodigo . ' Fila '.$row;
                        continue;
                    }

                    if($dependencyCode && $serieCodigo && $subserieCodigo) {
                        $error = true;
                        $cantidadErrores++;
                        $nombreError[]= 'Error en la hoja: '.$sheetName.' - El Codigo de la Dependencian no se Registra en la subSerie Fila '.$row;
                        continue;
                    }
                   

                    if (!$serieCodigo && !$subserieCodigo && !$nombre) {
                        continue;
                    }

                    //SUBSERIE
                    if ($subserieCodigo) {

                        $seriesConSubseries[$serieCodigo] = true;

                        $datosSubSerie[] = [
                            'row' => $row,
                            'serie' => $serieCodigo,
                            'subserie' => $subserieCodigo,
                            'nombre' => $nombre,
                        ];

                        $retencion[] = [
                            'nivel' => 'subserie',
                            'serie' => $serieCodigo,
                            'subserie' => $subserieCodigo,
                            'papel' => $papel? 1 : null,
                            'electronico' => $electronico? 1 : null,
                            'archivoGestion' => $archivoGestion,
                            'archivoCentral' => $archivoCentral,
                            'eliminacion' => $eliminacion? 1 : null,
                            'seleccion' => $seleccion? 1 : null,
                            'conservacionTotal' => $conservacionTotal? 1 : null,
                            'digitalizacionMicro' => $digitalizacionMicro? 1 : null,
                            'procedimiento' => $procedimiento,
                        ];

                    } 
                    //  SERIE
                    else {

                        $datosSerie[] = [
                            'row' => $row,
                            'serie' => $serieCodigo,
                            'nombre' => $nombre,
                        ];

                        $retencion[] = [
                            'nivel' => 'serie',
                            'serie' => $serieCodigo,
                            'subserie' => null,
                            'papel' => $papel ? 1 : null,
                            'electronico' => $electronico? 1 : null,
                            'archivoGestion' => $archivoGestion,
                            'archivoCentral' => $archivoCentral,
                            'eliminacion' => $eliminacion? 1 : null,
                            'seleccion' => $seleccion? 1 : null,
                            'conservacionTotal' => $conservacionTotal? 1 : null,
                            'digitalizacionMicro' => $digitalizacionMicro? 1 : null,
                            'procedimiento' => $procedimiento,
                        ];
                    }
                }

                // Filtrar retenciones
                $retencionFiltrada = [];

                foreach ($retencion as $item) {

                    if (
                        $item['nivel'] === 'serie' &&
                        isset($seriesConSubseries[$item['serie']])
                    ) {
                        continue;
                    }

                    $retencionFiltrada[] = $item;
                }

                if($error) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'errors' => $nombreError,
                    ], 400);
                }
                $processedData[$sheetName] = [
                    'dependency_code' => $sheetName,
                    'dependency_name' => $dependencyName,
                    'series' => $datosSerie,
                    'subseries' => $datosSubSerie,
                    'retencion' => $retencionFiltrada,
                ];
            }

            $this->trdRepository->import($processedData);
            DB::commit();
            return response()->json([
                'success' => true,
                'processed' => array_keys($processedData),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        } finally {
            unlink($temporaryFilePath);
        }
    }
}
