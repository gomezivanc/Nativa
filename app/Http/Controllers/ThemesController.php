<?php

namespace App\Http\Controllers;

use App\Repositories\ThemesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ThemesController extends Controller
{
    private $themesRepository;

    public function __construct(ThemesRepository $themesRepository)
    {
        $this->themesRepository = $themesRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Theme/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/Theme/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->themesRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->themesRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/Theme/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->themesRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->themesRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
