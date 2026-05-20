<?php

namespace App\Repositories;

use App\Models\ExpFiles;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use ZipStream\ZipStream;

class ExpFilesRepository extends BaseRepository
{

    public function __construct(ExpFiles $modelo)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $hidden = [], $withCount = [])
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {

                if (!empty($request['text'])) {
                    $query->where(function ($q) use ($request) {
                        $q->where('name', 'like', '%' . $request['text'] . '%')
                        ->orWhere('number', 'like', '%' . $request['text'] . '%')
                        ->orWhere('description', 'like', '%' . $request['text'] . '%')
                        ->orWhereHas('indices', function ($indiceQuery) use ($request) {
                            $indiceQuery->where('valor', 'like', '%' . $request['text'] . '%')
                                ->orWhereHas('indice', function ($q) use ($request) {
                                    $q->where('nombre', 'like', '%' . $request['text'] . '%');
                                });
                        });
                    });
                }
                if (!empty($request['searchQuery'])) {
                    $query->orWhere('name', 'like', '%' . $request['searchQuery'] . '%');
                }
                if (!empty($request['onlyExp'])) {
                    $query->whereNull('sub_exp_id');
                }

                if (!empty($request['number'])) {
                    $query->where('number', 'like', '%' . $request['number'] . '%');
                }
                if (!empty($request['name'])) {
                    $query->where('name', 'like', '%' . $request['name'] . '%');
                }
                if (!empty($request['numberExp'])) {
                    $query->where('number', 'like', '%' . $request['numberExp'] . '%');
                }
                if (!empty($request['date_init'])) {
                    $query->where('date_init', 'like', '%' . $request['date_init'] . '%');
                }
                if (!empty($request['serie'])) {
                    $query->where('serie->code', $request['serie']['code']);
                    $query->where('serie->name', $request['serie']['name']);
                }
                if (!empty($request['dependency_id'])) {
                    $query->where('dependency_id', $request['dependency_id']);
                }
                if (!empty($request['archive_id'])) {
                    $query->where('archive_id', $request['archive_id']);
                }

                if (!empty($request['state_loan_ids']) && empty($request['state_loan_id'])) {
                    $query->whereIn('state_loan_id', $request['state_loan_ids']);
                }
                if (!empty($request['state_loan_id'])) {
                    $query->where('state_loan_id', $request['state_loan_id']);
                }

                if (!empty($request['onlyWithUbications'])) {
                    $query->whereHas('expFilesArchived');
                }

                if (!empty($request['type_loan_id'])) {
                    $query->whereHas('documentaryLoanLatest', function ($q) use ($request) {
                        $q->where('type_loan_id', $request['type_loan_id']);
                    });
                }

                if (!empty($request['created_at_init'])) {
                    $query->where('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->where('created_at', '<=', $request['created_at_end']);
                }
                if(!empty($request['items_dispo_final_e'])) {
                    $query->whereNotNull('subserie->items_dispo_final_e');
                }
                if(!empty($request['items_dispo_final_s'])) {
                    $query->whereNotNull('subserie->items_dispo_final_s');
                }
                if(!empty($request['items_dispo_final_ct'])) {
                    $query->whereNotNull('subserie->items_dispo_final_ct');
                }
                if(!empty($request['items_dispo_final_md'])) {
                    $query->whereNotNull('subserie->items_dispo_final_md');
                }

                if (!empty($request['creado_por_id'])) {
                    $query->where('creado_por_id', $request['creado_por_id']);
                }

                if (!empty($request['subserie'])) {
                    $query->where('subserie->code', $request['subserie']['code']);
                }
            });

        if (!empty($request['state_transfer'])) {
            $data->withCount('expFilesArchiveds');

            if ($request['state_transfer'] == 4) {
                $data->havingRaw('exp_files_archiveds_count = 2');
            } else {
                $data->where('state_transfer', $request['state_transfer']);
            }
        }

        if (!empty($request['type_archive'])) {
            $data->withCount('expFilesArchiveds');

            if ($request['type_archive'] == 1) {
                $data->havingRaw('exp_files_archiveds_count = 1')
                    ->orHavingRaw('exp_files_archiveds_count = 0');
            }
            if ($request['type_archive'] == 2) {
                $data->havingRaw('exp_files_archiveds_count = 2');
            }
        }

        if (isset($request['active']) && $request['active'] !== null) {
            if ($request['active'] === false || $request['active'] === 'false') {
                $data->onlyTrashed();
            }
        }

        if(!empty($request['only_dispo_final'])){
            $data->selectRaw("CONCAT(
                JSON_UNQUOTE(JSON_EXTRACT(serie, '$.name')), '/',
                JSON_UNQUOTE(JSON_EXTRACT(subserie, '$.name'))
            ) AS type_trd");

            $data->with(['filing:filings.id,filings.filing_number']);

            $data->onlyTrashed();
        }
        
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }
        foreach ($data as $item) {
            $item->makeHidden($hidden);
        }
        
        $collection = $data instanceof \Illuminate\Pagination\LengthAwarePaginator ? $data->getCollection() : $data;

        $collection->transform(function ($item) {

            $item->indices_formateados = $item->indices->map(function ($indice) {
                return [
                    'nombre' => $indice->indice->nombre ?? '',
                    'valor'  => $indice->valor ?? ''
                ];
            })->values();

            return $item;
        });

        if ($data instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $data->setCollection($collection);
        } else {
            $data = $collection;
        }

        return $data;
    }

    function generateFileNumber()
    {
        $año = date('Y'); // Año actual
        $numeroAleatorio = mt_rand(1000000, 9999999); // Número aleatorio de 7 dígitos
        $numeroExpediente = $año . $numeroAleatorio; // Concatenar año y número aleatorio
        return $numeroExpediente;
    }

    function exportClosePdf($data)
    {
        $pdf = Pdf::loadView('PDF.Close', $data);
        $date = date('Y_m_d_H_i_s');
        $pdf->setPaper('a4', 'landscape'); // Se establece el papel en formato A4 horizontal
        return $pdf->download("Indice_electronico_$date.pdf");
    }

    function exportSheetControl($data)
    {
        $pdf = Pdf::loadView('PDF.Close', $data);
        $date = date('Y_m_d_H_i_s');
        $pdf->setPaper('a4', 'landscape'); // Se establece el papel en formato A4 horizontal
        return $pdf->download("Indice_electronico_$date.pdf");
    }

    function exportPackageZip($request)
    {
        // Define el nombre del archivo ZIP que será descargado
        $zipFileName = 'docs_' . date('Y_m_d_H_i_s') . '.zip';

        // Obtiene los documentos a incluir
        $files = $this->model->withTrashed()->find($request->id)->files()->where(function ($query) use ($request) {
            if (!empty($request['ids'])) {
                $query->whereIn('id', $request['ids']);
            }
            // $query->whereNot('type_doc_id',3);
        })->get();

        // Retorna un stream de descarga usando ZipStream
        return response()->streamDownload(function () use ($zipFileName, $files) {
            // Inicializa el objeto ZipStream
            $zip = new \ZipStream\ZipStream(outputName: $zipFileName);

            foreach ($files as $file) {
                $filePath = storage_path('app/public/' . $file->file); // Ruta completa del archivo

                // Verifica si el archivo existe antes de incluirlo
                if (file_exists($filePath)) {
                    $zip->addFileFromPath(
                        json_decode($file->file_detail)->name ?? basename($filePath), // Nombre del archivo en el ZIP
                        $filePath // Ruta completa al archivo
                    );
                }
            }

            // Finaliza el ZIP
            $zip->finish();
        }, $zipFileName, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $zipFileName . '"',
        ]);
    }

    function getState($item)
    {
        if ($item->expFilesArchiveds()->count() == 2) {
            return __('archive_gestion.physicalSpace.table.state.archived');
        }
        switch ($item->state_transfer) {
            case 1:
                return __('documental_gestion.exp_files.table.state_transfer.1');
            case 2:
                return __('documental_gestion.exp_files.table.state_transfer.2');
            case 3:
                return __('documental_gestion.exp_files.table.state_transfer.3');
            default:
                return __('documental_gestion.exp_files.table.state_transfer.0');
        }
    }

    function storeIdsStates($ids, $id_state)
    {
        $this->model->whereIn('id', $ids)->update([
            'state_loan_id' => $id_state
        ]);
    }
    function noResponseRequired($dataFiling)
    {
        //dd($dataFiling->official['id']);
        try {
            $data = [
                'number' => $this->generateFileNumber(),
                'name' => 'NO REQUIERE RESPUESTA',
                'date_init' => date('Y-m-d'),
                'serie' => $dataFiling->serie,
                'subserie' => $dataFiling->subserie,
                'clasification_id' => $dataFiling->clasification['id'],
                'dependency_id' => $dataFiling->dependency['id'],
                'responsible_id' => $dataFiling->official['id'],
                'creado_por_id'=>Auth::user()->id
            ];
            $creadted = $this->model->create($data);

            return $creadted;
        } catch (\Throwable $th) {
            dd($th);
        }

    }

    /**
     * Función para obtener los días de respuesta de los radicados
     */
    function reporttype($request) {
        $data = $this->model->where(function ($query) use($request) {
            if (!empty($request['searchQuery'])) {
                $query->orWhere('nombre', 'like', '%' . $request['searchQuery'] . '%');
            }
            if (!empty($request['onlyExp'])) {
                $query->whereNull('sub_exp_id');
            }

            if (!empty($request['number'])) {
                $query->where('number', 'like', '%' . $request['number'] . '%');
            }
            if (!empty($request['name'])) {
                $query->where('name', 'like', '%' . $request['name'] . '%');
            }
            if (!empty($request['numberExp'])) {
                $query->where('number', 'like', '%' . $request['numberExp'] . '%');
            }
            if (!empty($request['date_init'])) {
                $query->where('date_init', 'like', '%' . $request['date_init'] . '%');
            }
            if (!empty($request['serie'])) {
                $query->where('serie->code', $request['serie']['code']);
                $query->where('serie->name', $request['serie']['name']);
            }
            if (!empty($request['dependency_id'])) {
                $query->where('dependency_id', $request['dependency_id']);
            }

            if (!empty($request['state_loan_ids']) && empty($request['state_loan_id'])) {
                $query->whereIn('state_loan_id', $request['state_loan_ids']);
            }
            if (!empty($request['state_loan_id'])) {
                $query->where('state_loan_id', $request['state_loan_id']);
            }

            if (!empty($request['onlyWithUbications'])) {
                $query->whereHas('expFilesArchived');
            }
            if (!empty($request['type_loan_id'])) {
                $query->whereHas('documentaryLoanLatest', function ($q) use ($request) {
                    $q->where('type_loan_id', $request['type_loan_id']);
                });
            }

            if (!empty($request['created_at_init'])) {
                $query->orWhere('created_at', '>=', $request['created_at_init']);
            }
            if (!empty($request['created_at_end'])) {
                $query->orWhere('created_at', '<=', $request['created_at_end']);
            }

            if(!empty($request['items_dispo_final_e'])) {
                $query->whereNotNull('subserie->items_dispo_final_e');
            }
            if(!empty($request['items_dispo_final_s'])) {
                $query->whereNotNull('subserie->items_dispo_final_s');
            }
            if(!empty($request['items_dispo_final_ct'])) {
                $query->whereNotNull('subserie->items_dispo_final_ct');
            }
            if(!empty($request['items_dispo_final_md'])) {
                $query->whereNotNull('subserie->items_dispo_final_md');
            }

            if (!empty($request['creador_por_id'])) {
                $query->where('creador_por_id', $request['creador_por_id']);
            }
        });

        $curren_leng = session('locale','es');
        $data->selectRaw("
            count(*) as total,
            exp_files_clasifications.name_$curren_leng as name
        ");
        $data->with(['createBy.persona']);
        $data->join('exp_files_clasifications', 'clasification_id', '=', 'exp_files_clasifications.id');

        $data->groupbY('clasification_id');

        return $data->get();
    }

    public function buildFilesForDetail($expFiles, $request, $filesRepository)
    {
        $request['exp_file_id'] = $expFiles->id;
        $request['typeData'] = 'todos';

        // ARCHIVOS DEL EXPEDIENTE
        $files = $filesRepository->list($request,  [ 'supportType', 'creador.persona'] );

        $expedienteFiles = collect($files)->map(fn ($file, $index)=> $this->mapExpedienteFile($file, $index));

        // ARCHIVOS DE RADICADOS
        $filingFiles = collect();

        foreach ($expFiles->filings as $filing) {

            foreach ($filing->chargeDocFilings ?? [] as $file) {
                $filingFiles->push(
                    $this->mapFilingFile($file, $filing)
                );
            }
            // RESPUESTAS
            foreach ($filing->responseTemplates ?? [] as $template) {
                if (!$template->answers) {continue;}

                $filingFiles->push(
                    $this->mapTemplateFile($template, $filing)
                );
            }
        }

        return $expedienteFiles->merge($filingFiles)->sortBy('created_at')->values();
    }

    private function mapExpedienteFile($file, $index)
    {
        $fileDetail = json_decode($file->file_detail, true);
        $filename = $fileDetail['name'] ?? '';
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $isPdf = $extension === 'pdf';
        $filePath = storage_path('app/public/' . $file->file);

        $numPages = $file->num_pages ?? ($isPdf && file_exists($filePath) ? readLastPage($filePath) : 1);

        return [
            'file_id' => $file->id,
            'row_key' => 'file_' . $file->id,
            'orden' => $index + 1,
            'origen' => 'Expediente',
            'is_pdf' => $isPdf,
            'tipo_archivo' => $extension,
            'tipo_soporte' => $file->supportType?->name_es ?? null,
            'radicado_asunto' => $file->description ?? null,
            'created_at' => $file->date ?? $file->created_at,
            'date_created' => $file->created_at,
            'radicado_creado_por' => $file->creador?->persona?->nombre . '' . $file->creador?->persona?->apellido ?? null,
            'radicado_numero' => $file->document_sequential,
            'radicado_tipo_procedimiento' => 'Expediente',
            'hash' => file_exists($filePath)? hash_file('sha256', $filePath): null,
            'file' => $file->file,
            'name' => $fileDetail['name'] ?? 'Archivo',
            'size' => $fileDetail['size'] ?? 'N/A',
            'tipo_documental' => $file->typeDocumental?->name_es ?? '—',
            'file_url' => $file->file ? url("getfile?path={$file->file}") : null,
            'file_preview' => $file->file ? url("getfile?path={$file->file}&preview=true") : null,
            'num_pages' => $numPages,
            'last_page_pdf' => $numPages,
        ];
    }

    private function mapFilingFile($file, $filing)
    {
        $fileDetail = json_decode($file->file_detail, true);
        $filename = $fileDetail['name'] ?? '';
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $isPdf = $extension === 'pdf';
        $filePath = storage_path('app/public/' . $file->file);
        $persona = optional($file->user?->persona);
        $numPages = $file->num_pages ?? ($isPdf && file_exists($filePath) ? readLastPage($filePath) : 1);

        return [
            'file_id' => $file->id,
            'row_key' => 'file_' . $file->id,
            'origen' => 'Radicado',
            'is_pdf' => $isPdf,
            'tipo_archivo' => $extension,
            'created_at' => $file->created_at,
            'hash' => file_exists($filePath) ? hash_file('sha256', $filePath) : null,
            'file' => $file->file,
            'tipo_soporte' => $file->supportType?->name_es ?? null,
            'radicado_numero' => $filing->filing_number ?? null,
            'radicado_asunto' => $filing->subject ?? null,
            'radicado_tipo_procedimiento' => $filing->typeOfProcedure?->name ?? 'N/A',
            'radicado_creado_por'=> trim(($persona->nombre ?? '') . ' ' . ($persona->apellido ?? '')),
            'name' => $fileDetail['name'] ?? 'Archivo',
            'size' => $fileDetail['size'] ?? 'N/A',
            'tipo_documental' => $file->typeDocumental?->name_es ?? '—',
            'file_url' => $file->file ? url("getfile?path={$file->file}") : null,
            'file_preview' => $file->file ? url("getfile?path={$file->file}&preview=true") : null,
            'num_pages' => $numPages,
            'last_page_pdf' => $numPages,
            'date_created' => null,
        ];
    }

    private function mapTemplateFile($template, $filing)
    {
        $filename = $template->template_url;
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $isPdf = $extension === 'pdf';
        $filePath = storage_path('app/public/' . $template->template_url);
        $numPages = $isPdf && file_exists($filePath) ? readLastPage($filePath) : 1;

        return [
            'file_id' => 'resp_' . $template->id,
            'row_key' => 'resp_' . $template->id,
            'origen' => 'respuesta',
            'is_pdf' => $isPdf,
            'tipo_archivo' => $extension,
            'tipo_soporte' => 'Digital',
            'name' => $template->template_url ? basename($template->template_url) : 'Respuesta firmada',
            'created_at' => $template->created_at ?? $filing->created_at,
            'hash' => file_exists($filePath) ? hash_file('sha256', $filePath) : null,

            'file' => $template->template_url,
            'file_url' => $template->template_url ? url("getfile?path={$template->template_url}") : null,
            'file_preview' => $template->template_url ? url("getfile?path={$template->template_url}&preview=true") : null,

            // ESTE es el radicado final
            'radicado_numero' => $template->answers?->departure_filing ?? null,
            'radicado_asunto' => $filing->subject ?? null,
            'radicado_tipo_procedimiento' => $filing->typeOfProcedure?->name ?? 'N/A',
            'radicado_creado_por' => 'Respuesta oficial',
            'tipo_documental' => 'Respuesta firmada',
            'num_pages' => $numPages,
            'last_page_pdf' => $numPages,
        ];
    }



    public function buildFilingsForDetail($expFiles)
    {
        return collect($expFiles->filings)->map(function ($filing) {

            // documentos radicado
            $documentos = collect();

            foreach ($filing->chargeDocFilings ?? [] as $file) {

                $documentos->push(
                    $this->mapFilingFile($file, $filing)
                );
            }

            //respuestas
            $respuestas = collect();

            foreach ($filing->responseTemplates ?? [] as $template) {

                if (!$template->answers) {
                    continue;
                }

                $respuestas->push(
                    $this->mapTemplateFile($template, $filing)
                );
            }

            $persona = optional($filing->user?->persona);

            return [
                'id' => $filing->id,
                'filing_number' => $filing->filing_number,
                'subject' => $filing->subject,
                'created_at' => $filing->created_at,
                'tipo_tramite' => $filing->typeOfProcedure?->name ?? 'N/A',
                'creado_por' => trim(($persona->nombre ?? '') . ' ' .($persona->apellido ?? '')),
                'documentos' => $documentos->sortBy('created_at')->values(),
                'respuestas' => $respuestas->sortBy('created_at')->values(),
            ];

        })->sortBy('created_at')->values();
    }

}
