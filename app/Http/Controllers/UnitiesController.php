<?php

namespace App\Http\Controllers;

use App\Repositories\UnitiesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UnitiesController extends Controller
{
    private $unitiesRepository;

    public function __construct(UnitiesRepository $unitiesRepository)
    {
        $this->unitiesRepository = $unitiesRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Unity/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/Unity/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->unitiesRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->unitiesRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/Unity/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->unitiesRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->unitiesRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
