<?php

namespace App\Http\Controllers;

use App\Repositories\JudgeRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JudgeController extends Controller
{
    private $judgeRepository;

    public function __construct(JudgeRepository $judgeRepository)
    {
        $this->judgeRepository = $judgeRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Judge/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/Judge/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->judgeRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->judgeRepository->list($request->all());
        
        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/Judge/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->judgeRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->judgeRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
