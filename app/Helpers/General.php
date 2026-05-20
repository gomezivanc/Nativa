<?php

use App\Models\Filing;
use App\Models\Answer;
use App\Models\FilingSetting;
use App\Models\GDDependency;
use App\Models\TypesFilings;
use App\Models\ReceivedEmail;

function sanitizeFilename($filename)
{
    // Reemplazar espacios múltiples con un solo guion bajo
    $filename = preg_replace('/\s+/', '_', $filename);

    // Eliminar caracteres especiales excepto letras, números, guiones y guiones bajos
    $filename = preg_replace('/[^a-zA-Z0-9-_\.]/', '', $filename);

    // Retornar el nombre limpio
    return $filename;
}

function readLastPage($filePath)
{
    // Crea una instancia del analizador de PDF
    $parser = new Smalot\PdfParser\Parser();

    // Carga el archivo PDF
    $pdf = $parser->parseFile($filePath);

    // Obtén todas las páginas del PDF
    $pages = $pdf->getPages();

    // Cuenta el número de páginas
    $pageCount = count($pages);
    return $pageCount;
}

function generateFilingNumber($filingType , $answer)
{
    try {
        // Obtener la configuración de radicado (FilingSetting)
        $filingSetting = FilingSetting::with('filingStructure')->orderBy('id', 'desc')->first();
        if (!$filingSetting) {
            return ['error' => 'Configuración de radicado no encontrada'];
        }

        // Obtener la dependencia y el tipo de radicado
        // $dependency = $dependency ? GDDependency::where('id', $dependency)->first() : null;
        $filingType = $filingType ? TypesFilings::where('id', $filingType)->first() : null;
        $lastFiling = Filing::orderBy('id', 'desc')->first();

        $filingTypeCode = $filingType?->code;
        if($answer){
            $filingTypeCode = "S";
        }

        
        if($filingTypeCode == 'E'){
            $count1 = Filing::withTrashed()->where('filing_number', 'like', '%E%')->count();
            $count2 = ReceivedEmail::withTrashed()->where('filing_number', 'like', '%E%')->count();

            $count = $count1 + $count2;
        }elseif($filingTypeCode == 'S'){
            $count1 = Filing::withTrashed()->where('filing_number', 'like', '%S%')->count();
            $count2 = Answer::withTrashed()->where('departure_filing', 'like', '%S%')->count();

            $count = $count1+ $count2;
        }        

        // Generar el número de radicado con reintentos
        $structure = $filingSetting->filingStructure->filing_structure;
        $maxRetries = 5;
        $attempt = 0;

        do {
            $components = [
                'crt' => 'CRT',
                'merecepion_tiporad_yy' => 1 . ($filingTypeCode ?? 0) . now()->format('y'),
                // 'depe' => str_pad($dependency?->code ?? 0 , $filingSetting->dependency_length, '0', STR_PAD_LEFT), // Dependencia
                'consecutivo' => str_pad(($count ?? 0) + 1 + $attempt, $filingSetting->consecutive_length, '0', STR_PAD_LEFT), // Consecutivo
            ];

            $radicadoNumber = $structure;
            foreach ($components as $key => $value) {
                $radicadoNumber = str_replace($key, $value, $radicadoNumber);
            }

            // Verificar si ya existe
            $exists = Filing::where('filing_number', $radicadoNumber)->exists();
            if (!$exists) {
                return $radicadoNumber;
            }

            $attempt++;
        } while ($attempt < $maxRetries);

        return ['error' => 'No se pudo generar un número de radicado único después de ' . $maxRetries . ' intentos'];
    } catch (\Exception $e) {
        // Capturar cualquier excepción y devolver un error
        return ['error' => 'Error al generar el número de radicado: ' . $e->getMessage()];
    }
}
