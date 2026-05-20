<?php

    namespace App\Repositories;

use App\Models\ExpFiles;
use App\Models\Filing;
use App\Models\FilingExpFile;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

    class FilingExpFileRepository extends BaseRepository
    {
        public function __construct(FilingExpFile $modelo)
        {
            parent::__construct($modelo);
        }

        public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
        {
            $data = $this->model->select($select)
                ->with($with)
                ->withCount($withCount)
                ->where(function ($query) use ($request) {
                    if (!empty($request['name'])) {
                        $query->where('name', 'like', '%' . $request['name'] . '%');
                    }
                    if (!empty($request['created_at_init'])) {
                        $query->orWhere('created_at', '>=', $request['created_at_init']);
                    }
                    if (!empty($request['created_at_end'])) {
                        $query->orWhere('created_at', '<=', $request['created_at_end']);
                    }
                });

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
        public function attachExpFilesToFilings(array $filingIds, array $expFileIds)
        {     
            try {
                $dataToInsert = [];
                $alreadyExists = [];
                $insertedRecords = [];
                foreach ($filingIds as $filingId) {
                    $filing = Filing::find($filingId); // Obtener el radicado
                    
                    //dd($expFileIds);
                    foreach ($expFileIds as $expFileId) {
                        $expFile = ExpFiles::find($expFileId); // Obtener el expediente
                        // Verificar si la relación ya existe
                        $exists = FilingExpFile::where('filing_id', $filingId)
                        ->where('exp_file_id', $expFileId)
                        ->exists();
                        
                        if (!$exists) {
                            $dataToInsert[] = [
                                'filing_id' => $filingId,
                                'exp_file_id' => $expFileId,
                                'creado_por_id' => Auth::user()->id,
                                'created_at' => now(),
                                'updated_at' => now(),                        
                            ];
                            
                            // Guardar el nombre de la relación insertada
                            $insertedRecords[] = [
                                'filing_id' => $filingId,
                                'dependency_id' => $filing->dependency_id,
                                'filing' => $filing->filing_number ?? 'Desconocido',
                                'exp_file_num' => $expFile->number ?? 'Desconocido',
                                'exp_file' => $expFile->name ?? 'Desconocido',
                            ];
                        } else {
                            // Guardar el nombre de la relación que ya existía
                            $alreadyExists[] = [
                                'filing_id' => $filingId,
                               'dependency_id' => $filing->dependency_id,
                                'filing' => $filing->filing_number ?? 'Desconocido',
                                'exp_file_num' => $expFile->number ?? 'Desconocido',
                                'exp_file' => $expFile->name ?? 'Desconocido',
                            ];
                        }
                    }
                }
                
                // Insertar solo si hay datos nuevos
                if (!empty($dataToInsert)) {
                    FilingExpFile::insert($dataToInsert);
                    //dd($dataToInsert,$alreadyExists,$insertedRecords);
                }
        
                return [
                    'success' => true,
                    'insertedRecords' => $insertedRecords,  // Relaciones nuevas creadas
                    'alreadyExists' => $alreadyExists,  // Relaciones que ya existían
                ];
        
            } catch (\Exception $e) {  
                //dd($e);      
                return [
                    'error' => true,
                    'message' => $e,
                ];
            }
        }
    }