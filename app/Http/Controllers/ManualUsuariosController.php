<?php

namespace App\Http\Controllers;

use App\Repositories\ManualUsuarioRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ManualUsuariosController extends Controller
{
    private $manualUsuarioRepository;

    public function __construct(ManualUsuarioRepository $manualUsuarioRepository)
    {
        $this->manualUsuarioRepository = $manualUsuarioRepository;
    }

    function index(Request $request) {

        return Inertia::render("ManualUsuario/Index");
    }

    function create(Request $request) {
        return Inertia::render("ManualUsuario/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->manualUsuarioRepository->storeGeneral($request->except(['data','filename']));
        if(!empty($request['data']) && !empty($request['filename'])) {
            $file = $request->only(['data','filename']);
            $path = "manuales_usuario/manual_" . $data->id . "/" . $file['filename'];

            $fileData = substr($file['data'], strpos($file['data'], ',') + 1);

            Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

            $data->archivo = '/storage/'.$path;
            $data->archivo_nombre = $file['filename'];
            $data->save();
        }
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->manualUsuarioRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("ManualUsuario/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->manualUsuarioRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->manualUsuarioRepository->find($id);
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
