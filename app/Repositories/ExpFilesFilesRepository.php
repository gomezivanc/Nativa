<?php

namespace App\Repositories;

use App\Models\ExpFilesFiles;
use App\Models\ExpFilesTypeDoc;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\DB;
use App\Models\ExpFiles;
use Illuminate\Support\Facades\Crypt;
use App\Services\PdfSplitterService;
use App\Exceptions\PdfSegmentationException;

class ExpFilesFilesRepository extends BaseRepository{

    public function __construct(
        ExpFilesFiles $modelo,
        private PdfSplitterService $pdfSplitterService
    ){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = [], $hidden = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['searchQuery'])) {
                    $query->where('nombre', 'like', '%'. $request['searchQuery']. '%');
                }
                if (!empty($request['description'])) {
                    $query->where('description', 'like', '%'. $request['description']. '%');
                }
                // if (!empty($request['type_doc_id'])) {
                //     $query->where('type_doc_id', $request['type_doc_id']);
                // }
                if (!empty($request['exp_file_id'])) {
                    $query->where('exp_file_id', $request['exp_file_id']);
                }
                if (!empty($request['state_loan_id'])) {
                    $query->where('state_loan_id', $request['state_loan_id']);
                }
                if (!empty($request['exp_file'])) {
                    $query->whereHas('expFile',function ($q) use($request) {
                        $q->where('name',$request['exp_file']);
                    });
                }
                if (!empty($request['dependency_id'])) {
                    $query->whereHas('expFile',function ($q) use($request) {
                        $q->where('dependency_id',$request['dependency_id']);
                    });
                }

                if (!empty($request['created_at_init'])) {
                    $query->where('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->where('created_at', '<=', $request['created_at_end']);
                }
            });

        if(!empty($request['onlyArchiveds'])) {
            $data->whereHas('expFilesArchiveds');
        }
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        foreach ($data as $item) {
            $item->makeHidden($hidden);
        }
        return $data;
    }

    function storeIdsStates($ids,$id_state) {
        $this->model->whereIn('id',$ids)->update([
            'state_loan_id' => $id_state
        ]);
    }

    public function storeWithSegments($request)
    {
        DB::beginTransaction();

        try {
            $createdFiles = [];
            $warnings = [];

            foreach ($request->ids as $id) {
                $expediente = ExpFiles::with('dependency')->findOrFail($id);
                $dependencyName = $expediente->dependency->name;
                $initials = $this->getInitials($dependencyName);

                foreach ($request->filesList as $fileIndex => $value) {
                    $fileDetail = $value['file_detail'];
                    $filename = sanitizeFilename($fileDetail['name']);
                    $baseDirectory = "exp_file/$id";
                    $originalPath = "$baseDirectory/$filename";

                    // Guardar archivo original temporalmente
                    Storage::disk('local')->put(
                        "public/" . $originalPath,
                        base64_decode($value['file'])
                    );

                    $isPdf = ($fileDetail['type'] ?? '') === 'application/pdf';
                    $segments = $value['segments'] ?? [];

                    if ($isPdf && !empty($segments)) {
                        $totalPages = $this->getPdfTotalPages($originalPath);
                        $this->pdfSplitterService->validateSegments($segments, $totalPages);

                        try {
                            $segmentPaths = $this->pdfSplitterService->split(
                                $originalPath,
                                $segments,
                                $baseDirectory,
                                $filename
                            );

                            foreach ($segments as $segIndex => $segment) {
                                $fileData = collect($value)
                                    ->except('file', 'segments', 'ids')
                                    ->toArray();

                                $fileData['file_detail'] = json_encode($fileDetail);
                                $fileData['exp_file_id'] = $id;
                                $fileData['creado_por_id'] = auth()->id();
                                $fileData['type_doc_id'] = $segment['type_doc_id'] ?? null;

                                $file = $this->storeGeneral($fileData);
                                $file->document_sequential = $initials . '-' . $file->id;

                                $tokenData = json_encode([
                                    'id' => $file->id,
                                    'is_public' => $file->is_public,
                                    'exp_file_id' => $file->exp_file_id,
                                    'created_at' => $file->created_at
                                ]);
                                $file->token = substr(Crypt::encryptString($tokenData), 0, 191);
                                $file->file = $segmentPaths[$segIndex];
                                $file->num_pages = $this->getPdfTotalPages($segmentPaths[$segIndex]);
                                $file->save();

                                $createdFiles[] = $file;
                            }
                        } catch (PdfSegmentationException $e) {
                            // Fallback: guardar el archivo original completo sin type_doc_id
                            $fileData = collect($value)
                                ->except('file', 'segments', 'ids')
                                ->toArray();

                            $fileData['file_detail'] = json_encode($fileDetail);
                            $fileData['exp_file_id'] = $id;
                            $fileData['creado_por_id'] = auth()->id();

                            $file = $this->storeGeneral($fileData);
                            $file->document_sequential = $initials . '-' . $file->id;

                            $tokenData = json_encode([
                                'id' => $file->id,
                                'is_public' => $file->is_public,
                                'exp_file_id' => $file->exp_file_id,
                                'created_at' => $file->created_at
                            ]);
                            $file->token = substr(Crypt::encryptString($tokenData), 0, 191);
                            $file->file = $originalPath;
                            $file->num_pages = $totalPages;
                            $file->save();

                            $createdFiles[] = $file;
                            $warnings[] = [
                                'file_index' => $fileIndex,
                                'file_name' => $filename,
                                'message' => 'segmentation_failed',
                                'detail' => $e->getMessage()
                            ];
                        }
                    } else {
                        // Sin segmentos o no es PDF: guardar archivo original
                        $fileData = collect($value)
                            ->except('file', 'segments', 'ids')
                            ->toArray();

                        $fileData['file_detail'] = json_encode($fileDetail);
                        $fileData['exp_file_id'] = $id;
                        $fileData['creado_por_id'] = auth()->id();

                        $file = $this->storeGeneral($fileData);
                        $file->document_sequential = $initials . '-' . $file->id;

                        $tokenData = json_encode([
                            'id' => $file->id,
                            'is_public' => $file->is_public,
                            'exp_file_id' => $file->exp_file_id,
                            'created_at' => $file->created_at
                        ]);
                        $file->token = substr(Crypt::encryptString($tokenData), 0, 191);
                        $file->file = $originalPath;
                        $file->num_pages = $isPdf ? $this->getPdfTotalPages($originalPath) : 1;
                        $file->save();

                        $createdFiles[] = $file;
                    }
                }
            }

            DB::commit();

            return [
                'files' => $createdFiles,
                'warnings' => $warnings
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function getInitials($text)
    {
        $words = explode(' ', $text);
        $initials = '';

        foreach ($words as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }

        return $initials;
    }


    private function getPdfTotalPages($path)
    {
        $parser = new Parser();
        $pdf = $parser->parseFile(storage_path('app/public/' . $path));

        return count($pdf->getPages());
    }

}
