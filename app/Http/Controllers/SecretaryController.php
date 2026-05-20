<?php

namespace App\Http\Controllers;

use App\Repositories\SecretaryRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SecretaryController extends Controller
{
    private $secretaryRepository;

    public function __construct(SecretaryRepository $secretaryRepository)
    {
        $this->secretaryRepository = $secretaryRepository;
    }

    function index(Request $request) {

        return Inertia::render("Maestros/Secretary/Index");
    }

    function create(Request $request) {
        return Inertia::render("Maestros/Secretary/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $data = $this->secretaryRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->secretaryRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Maestros/Secretary/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->secretaryRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->secretaryRepository->find($id);
        $object->delete();
        return response()->json($object);
    }
}
