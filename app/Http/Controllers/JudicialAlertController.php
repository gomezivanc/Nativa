<?php

namespace App\Http\Controllers;

use App\Repositories\ProcessAlertRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JudicialAlertController extends Controller
{
    private $processAlertRepository;

    public function __construct(ProcessAlertRepository $processAlertRepository)
    {
        $this->processAlertRepository = $processAlertRepository;
    }

    function index(Request $request) {
        $data = $this->processAlertRepository->list($request->all());
        return response()->json($data);
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->processAlertRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function show(String $id) {
        $object = $this->processAlertRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processAlertRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
