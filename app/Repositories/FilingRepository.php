<?php

namespace App\Repositories;

use App\Imports\DestinatariesImport;
use App\Mail\ReassingrCorreo;
use App\Models\Filing;
use App\Models\WorkflowNodes;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

class FilingRepository extends BaseRepository
{
    public function __construct(
        Filing $modelo,
        private WorkflowNodesRepository $workflowNodesRepository,
        private FilingWorkflowRepository $filingWorkflowRepository,
        private SignedFilingRepository $signedFilingRepository
    ) {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $officialId = (int) ($request['official_id'] ?? 0);
        
        if ($select === ['*']) {
            $select = ['filings.*'];

            if ($officialId) {
                $select[] = DB::raw("
                    EXISTS (
                        SELECT 1 FROM copy_filing cf 
                        WHERE cf.id_filing = filings.id 
                        AND cf.id_official = {$officialId}
                        AND cf.estado = 1
                        AND cf.deleted_at IS NULL
                    ) as is_copy
                ");
                $select[] = DB::raw("
                    (SELECT cf.id FROM copy_filing cf 
                        WHERE cf.id_filing = filings.id 
                        AND cf.id_official = {$officialId}
                        AND cf.estado = 1
                        AND cf.deleted_at IS NULL
                        LIMIT 1
                    ) as copy_id
                ");
            } else {
                $select[] = DB::raw("0 as is_copy");
                $select[] = DB::raw("NULL as copy_id");
            }
        }

        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name', 'like', '%' . $request['name'] . '%');
                }
                if (!empty($request['types_filings_id'])) {
                    $query->where('types_filings_id', $request['types_filings_id']);
                }
                if (!empty($request['official_id'])) {
                    $officialId = $request['official_id'];

                    $query->where(function ($q) use ($officialId) {
                        $q->where('official_id', $officialId)
                        ->orWhereExists(function ($sub) use ($officialId) {
                            $sub->select(DB::raw(1))
                                ->from('copy_filing as cf')
                                ->whereColumn('cf.id_filing', 'filings.id')
                                ->where('cf.id_official', $officialId)
                                ->where('cf.estado', 1)
                                ->whereNull('cf.deleted_at');
                        });
                    });
                }
                if (!empty($request['distribution_shipping_status'])) {
                    $query->where('distribution_shipping_status', $request['distribution_shipping_status']);
                }
                if (!empty($request['filing_number'])) {
                    $query->where('filing_number', 'like', '%' . $request['filing_number'] . '%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
                if (!empty($request['not_id'])) {
                    $query->where('id', '!=', $request['not_id']);
                }
                if (!empty($request['cancelation_request'])) {
                    $query->where(function ($q) use ($request) {
                        $q->whereNotIn('cancelation_request', $request['cancelation_request'])
                        ->orWhereNull('cancelation_request');
                    });
                }
            })
            ->where('filing_number', 'not like', '%S%')
            ->orderByRaw("expiration_date");

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }

    function getNodes(Filing $filing)
    {
        $nodes = $filing->workflow->nodes;
        $node_advanced = $filing->nodesAdvanceds()->latest()->first();
        $node_advanceds = $filing->nodesAdvanceds;
        $edges = $filing->workflow->edges;

        $data = [
            'nodes' => [],
            'edges' => [],
            'current_node_id' => null,
            'last_node_id' => $node_advanced,
            'next_node_yes' => null,
            'next_node_false' => null,
        ];
        if (empty($node_advanced)) {
            $data['last_node_id'] = $nodes->first()->id;
        }
        $latest_index = $nodes->search(function ($item) use ($node_advanced) {
            return $item->id == $node_advanced?->node_id;
        });

        if ($filing->is_end_wk) {
            $current_node_id = null;
        } else {
            $current_node_id = $filing->current_node_id;
        }

        $data['current_node_id'] = $current_node_id;
        $node = $filing->current_node;
        $nodesAdvs = $filing->nodesAdvanceds()->latest()->with('node')->get();
        foreach ($nodes as $key => $nd) {
            // colocar los mensajes de devolución a cada paso
            $infos = $nodesAdvs->filter(function ($item) use ($nd) {
                return $item->node_id == $nd->id;
            });
            if ($infos->count() > 0) {
                $nd->node_data = [
                    ...$nd->node_data,
                    'data' => [
                        ...$nd->node_data['data'],
                        'infos' => array_values($infos->toArray())
                    ],
                ];
            }

            $node_index = $node_advanceds->search(function ($i) use ($nd) {
                return $i->node_id == $nd->id;
            });
            if (!is_numeric($node_index)) {
                $nodes->node_data = $nd->node_data = [
                    ...$nd->node_data,
                    'data' => [
                        ...$nd->node_data['data'],
                        'no_actions' => true,
                        'current_node' => $nd->id == $filing->current_node_id
                    ],
                ];
                continue;
            }
            if ($nd->is_parallel_flow) {
                $nd->node_data = [
                    ...$nd->node_data,
                    'data' => [
                        ...$nd->node_data['data'],
                        'no_actions' => true,
                        'current_node' => $nd->id == $filing->current_node_id
                    ],
                    // 'type' => 'flowNodeSucces',
                ];
                continue;
            }
            $nd->node_data = [
                ...$nd->node_data,
                'data' => [
                    ...$nd->node_data['data'],
                    'no_actions' => true,
                    'current_node' => $nd->id == $filing->current_node_id
                ],
                'type' => 'flowNodeSucces',
            ];
            $edge_index = $edges->search(function ($i) use ($nd) {
                return $i->node_id == $nd->id;
            });
            $edges[$edge_index]->edge_data = [
                ...$edges[$edge_index]->edge_data,
            ];
        }

        if ($node?->is_parallel_flow) {
            $data['next_node_yes'] = $this->workflowNodesRepository->getModel()->where('conditional_wf_node_id', $node->id)->where('conditional_true_yes', 1)->first();
            $data['next_node_false'] = $this->workflowNodesRepository->getModel()->where('conditional_wf_node_id', $node->id)->where(function ($query) {
                return $query->where('conditional_true_yes', 0)->orWhereNull('conditional_true_yes');
            })->first();
        }

        $data['is_node_conditional'] = $node?->is_parallel_flow;
        $data['nodes'] = $nodes;
        $data['edges'] = $edges;
        return $data;
    }

    function checkIsFinsihWk(Filing $filing)
    {
        $node = $filing->nodesAdvanceds()->latest()->first()?->node;
        if ($node->is_finish) {
            $filing->is_end_wk = true;
            $filing->save();
        }
    }

    function nextStep(Filing $filing)
    {
        $filing->load(['current_node']);
        $next_node = $filing->workflow->edges()->where('node_id', $filing->current_node_id)->latest()->first();
        if (!$next_node) {
            return;
        }
        $filing->current_node_id = $next_node->second_node_id;
        $filing->save();
    }

    function rejectStep(Filing $filing, Request $request)
    {
        $last_node_advanced = $filing->nodesAdvanceds()->where('is_devolution', 0)->where('is_reject', 0)->latest()->first();
        // dd($last_node_advanced);
        if (!$last_node_advanced) {
            return;
        }
        $request['creador_por_id'] = Auth::user()->id;
        $request['is_devolution'] = 1;
        $request['node_id'] = $last_node_advanced->node_id;
        $this->filingWorkflowRepository->storeGeneral($request->all());

        $last_node_advanced->is_reject = true;
        $last_node_advanced->save();

        if (!$last_node_advanced) {
            return;
        }

        $filing->current_node_id = $last_node_advanced->node_id;
        $filing->save();

    }

    public function reassingFiling($data)
    {
        $filing = $this->find($data['filing']);
        $filing->dependency_id = $data['dependency_id'];
        $filing->official_id = $data['official_id'];
        $filing->date_reasign = Carbon::now();
        $filing->save();
        return $this->reasingSendMail($filing, $data);
    }
    public function reassingFilingMassive($data)
    {
        $sentEmails = [];
        foreach ($data->filing_ids as $value) {
            $filing = $this->find($value);
            $filing->dependency_id = $data['dependency_id'];
            $filing->official_id = $data['official_id'];
            $filing->save();
            $sentEmails[] = [
                'filing_number' => $filing->filing_number,
                'email' => $filing->official->email,
            ];
        }
        return $sentEmails;
    }

    private function reasingSendMail(Filing $filing, $data)
    {
        $destinatary = $data->official_id_copy;
        $data['filing_number'] = $filing->filing_number;
        $data['name_social_reason_sender'] = $filing->name_social_reason_sender;
        $data['first_surname_legal_representative_sender'] = $filing->first_surname_legal_representative_sender;
        Mail::to($filing->official->email)->send(new ReassingrCorreo($data, $destinatary));
        $destinatary[] = $filing->official->email;
        return $destinatary;
    }

    public function associateTemplate($data)
    {
        $id = $data->id;
        $extension = $this->getBase64Extension($data->file);
        //dd($data);
        $sanitizedFilename = sanitizeFilename($data->template_name);

        // Reconstruir el nombre del archivo con la extensión
        $filename = $sanitizedFilename . '.' . $extension;

        // Ruta donde se guardará el archivo
        $path = "filing/$id/$filename";

        // Decodificar el archivo en Base64 y guardarlo en el almacenamiento
        $fileData = substr($data->file, strpos($data->file, ',') + 1);
        Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

        // Actualizar el modelo con la nueva información
        $filing = $this->find($data->id);
        $filing->template_url = $path;
        $filing->template_name = $filename;

        $filing->save();

        return [
            'filename' => $filename,
            'dependency_id'=> $filing->dependency_id
        ];
    }

    function finishFiling($data, $isArchived = null)
    {
        $filing = $this->find($data->id);
        //dd($filing,$data);
        $filing->finished = $isArchived ? 2 : 1;
        $filing->finish_observation = $data->finish_observation;
        $filing->finish_date = date('Y-m-d H:i:s');
        $filing->save();

        return $filing;
    }

    function cancellationRequest($data)
    {

        $filing = $this->find($data->id);
        $filing->cancelation_request = 0;
        $filing->save();
        return $filing;
    }

    /**
     * @return Array
     *
     */

    public function masiveFiling(Request $request)
    {
        $import = new DestinatariesImport();

        // Extraer base64 del request
        $base64 = substr($request->masive_destinatary[0]['data'], strpos($request->masive_destinatary[0]['data'], ',') + 1);

        // Decodificar base64
        $decodedData = base64_decode($base64);

        // Crear archivo temporal
        $tempFilePath = storage_path('app/temp_import.xlsx');
        file_put_contents($tempFilePath, $decodedData);

        // Importar el archivo
        Excel::import($import, $tempFilePath);

        // Eliminar archivo temporal después de la importación
        unlink($tempFilePath);
        // Retornar los datos importados
        return $import->getData();
    }
    public function updateStateCorrespondece($data)
    {
        try {
            $filing = $this->find($data->id_filing);
            $filing->distribution_shipping_status = $data->distribution_shipping_status;
            $filing->save();
            return [
                'success' => true,
                'message' => 'Estado de envío actualizado correctamente.',
                'data' => $filing
            ];
        } catch (\Throwable $th) {
            dd($th);
        }

    }

    public function updateStateCancelation($data)
    {
        try {
            $filing = $this->find($data->id_filing);
            //  dd($data);
            $filing->cancelation_request = $data->cancelation_status;
            $filing->save();
            return  [
                'success' => true,
                'data' => $filing
            ];
        } catch (\Throwable $th) {
            dd($th);
        }

    }

    /**
     * Función para obtener los días de respuesta de los radicados
     */
    function reportdays($request) {
        $data = $this->model->where(function ($query) use($request) {
            if (!empty($request['name'])) {
                $query->where('name', 'like', '%' . $request['name'] . '%');
            }
            if (!empty($request['types_filings_id'])) {
                $query->where('types_filings_id', $request['types_filings_id']);
            }
            if (!empty($request['filing_number'])) {
                $query->where('filing_number', 'like', '%' . $request['filing_number'] . '%');
            }
            if (!empty($request['created_at_init'])) {
                $query->where('created_at', '>=', $request['created_at_init']);
            }
            if (!empty($request['created_at_end'])) {
                $query->where('created_at', '<=', $request['created_at_end']);
            }
        });

        $days = 15;
        for ($i=1; $i <= $days; $i++) {
            $data->selectRaw("
                SUM(
                    CASE
                        WHEN DATEDIFF(COALESCE(finish_date, CURDATE()), created_at) = {$i}
                        THEN 1 ELSE 0
                    END
                ) as {$i}_days
            ");
        }

        $data->selectRaw("
            SUM(
                CASE
                    WHEN DATEDIFF(COALESCE(finish_date, CURDATE()), created_at) > 15
                    THEN 1 ELSE 0
                END
            ) as 15_plus_days
        ");

        return $data->get();
    }

    /**
     * Función para obtener los días de respuesta de los radicados
     */
    function reporttype($request) {
        $data = $this->model->where(function ($query) use($request) {
            if (!empty($request['name'])) {
                $query->where('name', 'like', '%' . $request['name'] . '%');
            }
            if (!empty($request['types_filings_id'])) {
                $query->where('types_filings_id', $request['types_filings_id']);
            }
            if (!empty($request['filing_number'])) {
                $query->where('filing_number', 'like', '%' . $request['filing_number'] . '%');
            }
            if (!empty($request['created_at_init'])) {
                $query->where('created_at', '>=', $request['created_at_init']);
            }
            if (!empty($request['created_at_end'])) {
                $query->where('created_at', '<=', $request['created_at_end']);
            }
        });

        $data->selectRaw("
            count(*) as total,
            types_filings.name
        ");
        $data->join('types_filings', 'types_filings_id', '=', 'types_filings.id');

        $data->groupbY('types_filings_id');

        return $data->get();
    }

    /**
     * Función para obtener los días de respuesta de los radicados
     */
    function reportPerson($request) {
        $data = $this->model->where(function ($query) use($request) {
            if (!empty($request['name'])) {
                $query->where('name', 'like', '%' . $request['name'] . '%');
            }
            if (!empty($request['types_filings_id'])) {
                $query->where('types_filings_id', $request['types_filings_id']);
            }
            if (!empty($request['filing_number'])) {
                $query->where('filing_number', 'like', '%' . $request['filing_number'] . '%');
            }
            if (!empty($request['created_at_init'])) {
                $query->where('created_at', '>=', $request['created_at_init']);
            }
            if (!empty($request['created_at_end'])) {
                $query->where('created_at', '<=', $request['created_at_end']);
            }
        });

        $data->selectRaw("
            count(*) as total,
            name_social_reason_sender as name
        ");

        $data->groupbY('name_social_reason_sender');

        return $data->get();
    }

    public function noResponseRequired($id,$idExpFile)
    {
        try {
            $filing = $this->find($id);
            $filing->no_response_required = 1;
            $filing->exp_file_id = $idExpFile;
            $filing->save();
            return $filing;
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function mailtransfer($id)
    {   
        try {
            $filing = $this->find($id);
            $filing->distribution_shipping_status = 1;
            $filing->save();
            return $filing;
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
