<?php

namespace App\Http\Controllers;

use App\Repositories\ProcesActuationRepository;
use App\Repositories\ProcessStateRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProcessActuationController extends Controller
{
    private $procesActuationRepository;
    private $processStateRepository;

    public function __construct(ProcesActuationRepository $procesActuationRepository,ProcessStateRepository $processStateRepository)
    {
        $this->procesActuationRepository = $procesActuationRepository;
        $this->processStateRepository = $processStateRepository;
    }

    function index() {
        $procesState = $this->processStateRepository->all();
        return Inertia::render('JudicialProcess/ActuationProcess/Index',[
            'procesState' => $procesState
        ]);
    }

    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->procesActuationRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->procesActuationRepository->list($request->all(),with: ['ProcesState','Proces','Alert']);
        return response()->json($data);
    }

    function show(String $id) {
        return $this->procesActuationRepository->find($id,with: ['Alert']);
    }

    function destroy(String $id) {
        $object = $this->procesActuationRepository->find($id);
        if ($object) {
            // Verifica si el registro está borrado
            if ($object->trashed()) {
                // Restaura el registro borrado
                $object->restore();
            } else {
                $object->delete();
            }
        }
        return response()->json($object);
    }
}
