<?php

namespace App\Http\Controllers;

use App\Models\PersonsType;
use App\Repositories\DefendantsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DefendantsController extends Controller
{
    private $defendantsRepository;

    public function __construct(DefendantsRepository $defendantsRepository)
    {
        $this->defendantsRepository = $defendantsRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Defendants/Index");
    }

    function create(Request $request) {
        $type_persons = PersonsType::all();
        return Inertia::render("Maestros/Defendants/Create",compact('type_persons'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->defendantsRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->defendantsRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        $type_persons = PersonsType::all();
        return Inertia::render("Maestros/Defendants/Create",compact('id','type_persons'));
    }

    function show(String $id) {
        $object = $this->defendantsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->defendantsRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
