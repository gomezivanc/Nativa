<?php

namespace App\Http\Controllers;

use App\Models\PersonsType;
use App\Repositories\PlaintiffsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlaintiffsController extends Controller
{
    private $plaintiffsRepository;

    public function __construct(PlaintiffsRepository $plaintiffsRepository)
    {
        $this->plaintiffsRepository = $plaintiffsRepository;
    }

    function index(Request $request) {
        return Inertia::render("Maestros/Plaintiffs/Index");
    }

    function create(Request $request) {
        $type_persons = PersonsType::all();
        return Inertia::render("Maestros/Plaintiffs/Create",['type_persons' => $type_persons]);
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->plaintiffsRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->plaintiffsRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        $type_persons = PersonsType::all();
        
        return Inertia::render("Maestros/Plaintiffs/Create",compact('id','type_persons'));
    }

    function show(String $id) {
        $object = $this->plaintiffsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->plaintiffsRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
