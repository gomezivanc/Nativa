<?php

namespace App\Http\Controllers;

use App\Repositories\ConfMaskTrdRepository;
use App\Repositories\ExpFilesFilesRepository;
use App\Repositories\ExpFilesReferencecrusadeRepository;
use App\Repositories\ExternalRepresentantRepository;
use App\Repositories\TrdRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class ExpFilesReferencecrusadeController extends Controller
{
    public function __construct(private ExpFilesReferencecrusadeRepository $expFilesReferencecrusadeRepository, private ExpFilesFilesRepository $expFilesFilesRepository)
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
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }

        if(!empty($request['ids'])) {
            foreach ($request->ids as $key => $v) {
                $request['exp_file_id'] = $v;
                $data = $this->expFilesReferencecrusadeRepository->storeGeneral($request->except('ids','password'));
                $token = json_encode([
                    'id' => $data->id,
                    'is_public' => $data->is_public,
                    'exp_file_id' => $data->exp_file_id,
                    'created_at' => $data->created_at
                ]);

                $token = substr(Crypt::encryptString($token),0,191);


                $this->expFilesFilesRepository->storeGeneral([
                    'type_doc_id' => 3,
                    'date' => now(),
                    'description' => '',
                    'is_public' => 1,
                    'exp_file_id' => $data->exp_file_id,
                    'creado_por_id' => Auth::user()->id,
                    'reference_cr_id' => $data->id,
                    'token' => $token,
                    'file_detail' => json_encode([
                        'name' => $data->name_middle
                    ])
                ]);
            }
        } else{
            $data = $this->expFilesReferencecrusadeRepository->storeGeneral($request->all());
        }

        activity('Expediente_detalle')
        ->causedBy(auth()->user()) // Usuario que realiza la acción
        ->performedOn($data->ExpFiles) // Relación con ExpFiles
        ->withProperties([
            'expFiles' => $data->ExpFiles
        ])
        ->log("Se incluyo al expediente una nueva referencia cruzada con el id: ".$data->id);

        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->expFilesReferencecrusadeRepository->list($request->all());

        return response()->json($data);
    }

    // function edit(String $id) {

    //     return Inertia::render("Configuration/Trd/Create",compact('id'));
    // }

    // function show(String $id) {
    //     $object = $this->expFilesReferencecrusadeRepository->find($id);
    //     return response()->json($object);
    // }

    // function destroy(String $id) {
    //     $object = $this->expFilesReferencecrusadeRepository->find($id);
    //     $object->delete();
    //     return response()->json($object);
    // }

    // function export(Request $request) {
    //     $type = $request->type;
    //     $data = $this->expFilesReferencecrusadeRepository->all(hidden: ['created_at','updated_at','deleted_at','conf_mask_trd_id','creado_por_id','mask','id']);
    //     foreach ($data as $value) {
    //         $value->mask_name = $value->mask->name;
    //     }
    //     return $this->expFilesReferencecrusadeRepository->export($type,$data->toArray(),'Excel.Export.generalExport','configuration.trd.form');
    // }
}
