<?php

namespace App\Http\Controllers;

use App\Repositories\ConfMaskTrdRepository;
use App\Repositories\ExpFilesFilesRepository;
use App\Repositories\ExpFilesReferencecrusadeRepository;
use App\Repositories\ExternalRepresentantRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpFilesChargeDocumentsController extends Controller
{
    public function __construct(private ExpFilesFilesRepository $expFilesFilesRepository)
    {
    }

    // function index(Request $request) {
    //     return Inertia::render("Configuration/Trd/Index",[
    //     ]);
    // }

    // function create(Request $request) {

    //     return Inertia::render("Configuration/Trd/Create");
    // }

    // store - update
    // function store(Request $request) {
    //     // dd($request->all());
    //     if(empty($request['ids'])) {
    //         return response()->json(['error' => ''], 400);
    //     }

    //     foreach ($request->ids as $key => $id) {
    //         $expediente = ExpFiles::with('dependency')->findOrFail($id);

    //         $filenames = [];
    //         foreach ($request->filesList as $key => $value) {
    //             if(empty($value['id'])) {
    //                 $value['creado_por_id'] = Auth::user()->id;
    //             }
    //             $value['exp_file_id'] = $id;
    //             $fileDetail = $value['file_detail'];
    //             $value['file_detail'] = json_encode($value['file_detail']);
    //             $data = $this->expFilesFilesRepository->storeGeneral(collect($value)->except('file','ids','segments')->toArray());
    //             $dependencyName = $expediente->dependency->name;
    //             $initials = $this->getInitials($dependencyName);

    //             $consecutive = $initials . '-' . $data->id;

    //             $token = json_encode([
    //                 'id' => $data->id,
    //                 'is_public' => $data->is_public,
    //                 'exp_file_id' => $data->exp_file_id,
    //                 'created_at' => $data->created_at
    //             ]);

    //             $data->token = substr(Crypt::encryptString($token),0,191);
    //             $filename = $fileDetail['name'];
    //             $filenames[] = $filename;
    //             $path = "exp_file/$id/$filename";
    //             Storage::disk('local')->put("public/" . $path, base64_decode($value['file']));

    //             $segments = $this->expFilesFilesRepository->storeWithSegments($request);

    //             $data->document_sequential = $consecutive;
    //             $data->file = $path;
    //             $data->save();
    //         }

    //         activity('Expediente_detalle')
    //         ->causedBy(auth()->user()) // Usuario que realiza la acción
    //         ->performedOn(ExpFiles::find($id)) // Relación con ExpFiles
    //         ->withProperties([
    //             'expFiles' => ExpFiles::find($id)
    //         ])
    //         ->log("Se incluyo al expediente una serie de archivos: ".implode(', ',$filenames));
    //     }


    //     return response()->json($data);
    // }

    public function store(Request $request)
    {
        if (empty($request['ids'])) {
            return response()->json(['error' => 'No hay expedientes seleccionados'], 400);
        }

        try {
            $response = $this->expFilesFilesRepository->storeWithSegments($request);

            return response()->json($response);

        } catch (\Exception $e) {

            $parts = explode('|', $e->getMessage());

            return response()->json([
                'error_key' => $parts[0],
                'total_pages' => $parts[1] ?? null
            ], 422);
        }
    }

    function list(Request $request) {
        $data = $this->expFilesFilesRepository->list($request->all());

        return response()->json($data);
    }

    // function edit(String $id) {

    //     return Inertia::render("Configuration/Trd/Create",compact('id'));
    // }

    // function show(String $id) {
    //     $object = $this->expFilesFilesRepository->find($id);
    //     return response()->json($object);
    // }

    function destroy(String $id) {
        $object = $this->expFilesFilesRepository->find($id);
        $object->delete();
        activity('Expediente_detalle')
        ->causedBy(auth()->user()) // Usuario que realiza la acción
        ->performedOn($object->expFile) // Relación con ExpFiles
        ->withProperties([
            'expFiles' => $object->expFile
        ])
        ->log("Se excluyo el siguiente archivo: ". $object->file);

        return response()->json($object);
    }

    // function export(Request $request) {
    //     $type = $request->type;
    //     $data = $this->expFilesFilesRepository->all(hidden: ['created_at','updated_at','deleted_at','conf_mask_trd_id','creado_por_id','mask','id']);
    //     return $this->expFilesFilesRepository->export($type,$data->toArray(),'Excel.Export.generalExport','configuration.trd.form');
    // }
}
