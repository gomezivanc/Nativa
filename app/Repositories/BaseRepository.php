<?php

namespace App\Repositories;

use App\Exports\GeneralExport;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function new($data = [])
    {
        return new $this->model($data);
    }

    public function all($with = [], $select = '*', $withCount = [], $hidden = [], )
    {
        // Recuperar los resultados con los campos especificados
        $query = $this->model->select($select)->withCount($withCount)->with($with)->get();

        // Ocultar los campos no deseados
        foreach ($query as $item) {
            $item->makeHidden($hidden);
        }

        return $query;
    }

    public function first()
    {
        return $this->model->first();
    }

    public function get($with = [])
    {
        return $this->model->with($with)->get();
    }

    public function find($id, $with = [], $select = '*', $withCount = [])
    {
        return $this->model->select($select)->withCount($withCount)->withTrashed()->with($with)->find($id);
    }

    public function findRemove($id, $with = [], $select = '*', $withCount = [])
    {
        return $this->model->withTrashed()->select($select)->withCount($withCount)->with($with)->find($id);
    }

    public function save(Model $model)
    {
        $model->save();

        return $model;
    }

    public function make(Model $model) //esto es para simular un registro
    {
        $model->make();

        return $model;
    }

    public function delete($id)
    {
        $model = $this->model->find($id);
        $model->delete();

        return $model;
    }

    public function changeState($id, $estado, $column = 'estado', $with = [])
    {
        $model = $this->model->with($with)->find($id);
        $model[$column] = $estado;
        $model->save();

        return $model;
    }

    public function pdf($view, array $data = [], string $file_name = 'archivo', string $directory = 'pdfTemporal', array $aCustomPdf = [])
    {
        $file_path = storage_path('app/public/' . $directory . '/' . $file_name . '.pdf');
        if (!file_exists(storage_path('app/public/' . $directory))) {
            mkdir(storage_path('app/public/' . $directory));
        }
        try {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView($view, $data);
            //code...
        } catch (\Throwable $th) {
            dd($th);
        }
        // dd(123);

        if (!empty($aCustomPdf)) {
            if (isset($aCustomPdf['paper']) && !empty($aCustomPdf['paper'])) {
                call_user_func_array(array($pdf, 'setPaper'), $aCustomPdf['paper']);
            }
            // $paperWidth = 1100;
            // $paperHeight = 800;
            // $pdf->setPaper(array(0, 0, $paperWidth, $paperHeight));
        }
        $pdf->save($file_path);

        return 'storage/' . $directory . '/' . $file_name . '.pdf';
    }

    public function storeGeneral($request)
    {
        foreach ($request as $key => $value) {
            $request[$key] = $request[$key] != 'null' ? $request[$key] : null;
        }
        if (!empty($request['id'])) {
            try {
                $data = $this->model->withTrashed()->find($request['id']);
            } catch (\Throwable $th) {
                $data = $this->model->find($request['id']);
            }
            // dd($data);
        } else {
            $data = $this->model::newModelInstance();
        }
        foreach ($request as $key => $value) {
            $data[$key] = $request[$key];
        }

        $data->save();

        return $data;
    }
    function export(string $type, $data, string $template, string $translate, $nameModule = 'exportDefault')
    {
        $title = __($nameModule);
        switch ($type) {
            case 'csv':
                // Definir el nombre del archivo CSV dinámicamente
                $csvName = $title . '.csv';
                $headers = [
                    "Content-type" => "text/csv",
                    "Content-Disposition" => "attachment; filename=$csvName",
                    "Pragma" => "no-cache",
                    "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                    "Expires" => "0",
                    'X-File-Name' => $csvName
                ];

                return response()->stream(function () use ($data, $translate) {
                    // dd($translate);
                    $handle = fopen('php://output', 'w');

                    // Encabezados del CSV
                    if (!empty($data)) {
                        $headers = [];
                        foreach ($data[0] as $key => $value) {
                            $headers[] = __($translate . '.' . $key);
                        }
                        fputcsv($handle, $headers);
                    }

                    // Escribir las filas del CSV
                    foreach ($data as $row) {
                        fputcsv($handle, $row);
                    }

                    fclose($handle);
                }, 200, $headers);
            case 'excel':
                // Primero se genera la descarga del archivo Excel
                $excelName = $title . '.xlsx';
                $headers = [];
                if (!empty($data)) {
                    foreach ($data[0] as $key => $value) {
                        $headers[] = __($translate . '.' . $key);
                    }
                    array_unshift($data, $headers);
                }
                $excelResponse = Excel::download(new GeneralExport($data), $excelName, \Maatwebsite\Excel\Excel::XLSX);

                // Cambiamos la respuesta a un StreamedResponse para poder añadir la cabecera
                $streamedResponse = new StreamedResponse(function () use ($excelResponse) {
                    $excelResponse->send();
                });

                // Añadimos las cabeceras personalizadas
                $streamedResponse->headers->set('X-File-Name', $excelName);

                return $streamedResponse;
            case 'pdf':
                $pdfName = $title . '.pdf';
                // Generamos el PDF
                // dd($template,$data, $translate);
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView($template, ['data' => $data, 'translate' => $translate]);
                $pdf->setPaper('A4', 'landscape');
                return response($pdf->output())
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="export.xlsx"')->header('X-File-Name', $pdfName);
                break;

            case 'json':
            default:
                break;
        }
    }

    function getModel(): Model
    {
        return $this->model;
    }

    function getBase64Extension($base64String)
    {
        if (preg_match('/^data:(\w+\/[\w\-.]+);base64,/', $base64String, $matches)) {
            $mimeType = $matches[1]; // Obtiene el MIME Type

            // Mapeo de tipos MIME a extensiones
            $mimeMap = [
                // Documentos de texto
                'text/plain' => 'txt',
                'application/msword' => 'doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
                'application/pdf' => 'pdf',
                'application/rtf' => 'rtf',

                // Hojas de cálculo
                'application/vnd.ms-excel' => 'xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',

                // Presentaciones
                'application/vnd.ms-powerpoint' => 'ppt',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',

                // Otros documentos
                'application/json' => 'json',
                'application/xml' => 'xml',
                'application/zip' => 'zip',
                'application/x-rar-compressed' => 'rar',
                'application/x-tar' => 'tar',
                'application/x-7z-compressed' => '7z',
            ];

            return $mimeMap[$mimeType] ?? null; // Retorna la extensión si coincide
        }
        return null;
    }
}
