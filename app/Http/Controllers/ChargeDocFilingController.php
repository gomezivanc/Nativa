<?php

namespace App\Http\Controllers;

use App\Repositories\ChargeDocFilingRepository;
use App\Repositories\FilingLogRepository;
use App\Repositories\FilingRepository;
use App\Services\PdfSplitterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\ResponseTemplate;
use App\Exceptions\PdfSegmentationException;

class ChargeDocFilingController extends Controller
{
    public function __construct(
        private ChargeDocFilingRepository $chargeDocFilingRepository,
        private FilingLogRepository $filingLogRepository,
        private FilingRepository $filingRepository,
        private PdfSplitterService $pdfSplitterService,
    ) {
    }

    // function index(Request $request) {
    //     return Inertia::render("Configuration/chargeDocFiling/Index",[
    //     ]);
    // }

    // function create(Request $request) {

    //     return Inertia::render("Configuration/chargeDocFiling/Create");
    // }

    // store - update
    function store(Request $request)
    {
        if (empty($request['ids'])) {
            return response()->json(['error' => ''], 400);
        }

        $documentType = $request->radicados ? 'Documento Principal' : '';
        $createdDocuments = [];
        $warnings = [];

        foreach ($request->ids as $id) {
            $filing = $this->filingRepository->find($id);

            foreach ($request->filesList as $fileIndex => $value) {
                $fileDetail = $value['file_detail'];
                $filename = sanitizeFilename($fileDetail['name']);
                $baseDirectory = "doc_filing/$id";
                $originalPath = "$baseDirectory/$filename";

                // Guardar archivo original temporalmente
                Storage::disk('local')->put("public/" . $originalPath, base64_decode($value['file']));

                $isPdf = ($fileDetail['type'] ?? '') === 'application/pdf';
                $segments = $value['segments'] ?? [];

                if ($isPdf && !empty($segments)) {
                    $totalPages = $this->pdfSplitterService->getTotalPages($originalPath);
                    $this->pdfSplitterService->validateSegments($segments, $totalPages);

                    try {
                        $segmentPaths = $this->pdfSplitterService->split(
                            $originalPath,
                            $segments,
                            $baseDirectory,
                            $filename
                        );

                        foreach ($segments as $segIndex => $segment) {
                            $dataInsert = collect($value)
                                ->except('file', 'ids', 'segments', 'date')
                                ->toArray();

                            $dataInsert['creado_por_id'] = Auth::user()->id;
                            $dataInsert['filing_id'] = $id;
                            $dataInsert['file_detail'] = json_encode($fileDetail);
                            $dataInsert['document_type'] = $documentType;
                            $dataInsert['type_doc_id'] = $segment['type_doc_id'] ?? null;

                            $data = $this->chargeDocFilingRepository->storeGeneral($dataInsert);
                            $data->file = $segmentPaths[$segIndex];
                            $data->save();

                            $createdDocuments[] = $data;
                        }
                    } catch (PdfSegmentationException $e) {
                        // Fallback: guardar archivo original completo
                        $dataInsert = collect($value)
                            ->except('file', 'ids', 'segments', 'date')
                            ->toArray();

                        $dataInsert['creado_por_id'] = Auth::user()->id;
                        $dataInsert['filing_id'] = $id;
                        $dataInsert['file_detail'] = json_encode($fileDetail);
                        $dataInsert['document_type'] = $documentType;

                        $data = $this->chargeDocFilingRepository->storeGeneral($dataInsert);
                        $data->file = $originalPath;
                        $data->save();

                        $createdDocuments[] = $data;
                        $warnings[] = [
                            'file_index' => $fileIndex,
                            'file_name' => $filename,
                            'message' => 'segmentation_failed',
                            'detail' => $e->getMessage()
                        ];
                    }
                } else {
                    // Sin segmentos o no es PDF
                    $dataInsert = collect($value)
                        ->except('file', 'ids', 'segments', 'date')
                        ->toArray();

                    $dataInsert['creado_por_id'] = Auth::user()->id;
                    $dataInsert['filing_id'] = $id;
                    $dataInsert['file_detail'] = json_encode($fileDetail);
                    $dataInsert['document_type'] = $documentType;

                    $data = $this->chargeDocFilingRepository->storeGeneral($dataInsert);
                    $data->file = $originalPath;
                    $data->save();

                    $createdDocuments[] = $data;
                }

                // Log para traza
                $dataLog = [
                    'action_es' => 'Documento cargado al radicado',
                    'action_en' => 'Document uploaded to filing',
                    'description_es' => sprintf(
                        'Se ha cargado el documento %s al radicado %s.',
                        $filename ?: 'Sin nombre',
                        $filing->filing_number ?: 'Sin número'
                    ),
                    'description_en' => sprintf(
                        'The document %s has been uploaded to filing %s.',
                        $filename ?: 'No name',
                        $filing->filing_number ?: 'No number'
                    ),
                    'icon' => 'pi-paperclip',
                    'creado_por_id' => Auth::id(),
                    'filing_id' => $id,
                    'dependency_id' => $filing->dependency_id,
                    'color' => '#17A2B8'
                ];

                $this->filingLogRepository->storeGeneral($dataLog);
            }
        }

        return response()->json([
            'data' => $createdDocuments,
            'warnings' => $warnings
        ]);
    }

    public function storeAcuse(Request $request)
    {
        if (empty($request->id)) {
            return response()->json(['error' => 'No se envió el registro'], 400);
        }

        if (empty($request->filesList)) {
            return response()->json(['error' => 'Archivo no enviado'], 400);
        }

        $documentType = 'Acuse';

        // dd($request->id['id']);

        $filingData = $request->id;
        $fileData   = $request->filesList[0];

        $fileDetail = $fileData['file_detail'] ?? null;

        if (!$fileDetail) {
            return response()->json(['error' => 'Detalle del archivo no enviado'], 400);
        }

        $filename = sanitizeFilename($fileDetail['name']);

        $dataInsert = [
            'description'    => $fileData['description'] ?? null,
            'creado_por_id'  => Auth::user()->id,
            'filing_id'      => $filingData['filing']['id'],
            'file_detail'    => json_encode($fileDetail),
            'document_type'  => $documentType,
            'is_public' => 0
        ];

        $data = $this->chargeDocFilingRepository->storeGeneral($dataInsert);

        $idFiling = $filingData['filing']['id'];
        $idAcuse  = $request->id['id'];

        $path = "doc_filing/$idFiling/acuse/$idAcuse/$filename";

        Storage::disk('local')->put(
            "public/" . $path,
            base64_decode($fileData['file'])
        );

        $data->file = $path;
        $data->save();

        $temple = ResponseTemplate::findOrFail($idAcuse);
        $temple->state = 7; //Acuse adjunto
        $temple->id_charge_doc_accusation = $data->id; //archivo
        $temple->date_acuse = $request->filesList[0]['date_acuse'];
        $temple->save();

        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->chargeDocFilingRepository->list($request->all(), []);

        return response()->json($data);
    }

    function destroy(Request $request)
    {
        $responseId = $request->id_ducument;

        if (str_starts_with($responseId, 'response_')) {
            return response()->json([
                'message' => 'Estas intentando Eliminar un documento que es una respuesta.'
            ], 400);
        }

        // Eliminar prefijo legacy 'segment_' si existe; ahora cada documento es un registro directo
        $documentId = (int) str_replace('charge_', '', $responseId);

        $object = $this->chargeDocFilingRepository->find($documentId);

        if ($object && $object->file) {
            Storage::disk('local')->delete('public/' . $object->file);
        }

        if ($object) {
            $object->delete();
        }

        $dataLog = [
            'action_es' => 'Documento Eliminado',
            'action_en' => 'Deleted Document',
            'description_es' => 'Se elimino un documento Anexo relacionado al Expediente.',
            'description_en' => 'An attached document related to the file was removed.',
            'icon' => 'pi-ban',
            'creado_por_id' => Auth::id(),
            'filing_id' => $request->filing,
            'dependency_id' => Auth::user()->dependency_id,
            'color' => '#E91E63'
        ];
        $this->filingLogRepository->storeGeneral($dataLog);

        return response()->json($object);
    }
}
