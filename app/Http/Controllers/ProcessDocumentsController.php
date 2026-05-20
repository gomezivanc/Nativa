<?php

namespace App\Http\Controllers;

use App\Repositories\DocumentCategoryRepository;
use App\Repositories\ProcessDocumentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProcessDocumentsController extends Controller
{
    private $processDocumentRepository;
    private $documentCategoryRepository;

    public function __construct(
        ProcessDocumentRepository $processDocumentRepository,DocumentCategoryRepository $documentCategoryRepository,
    )
    {
        $this->processDocumentRepository = $processDocumentRepository;
        $this->documentCategoryRepository = $documentCategoryRepository;
    }

    function index(Request $request) {
        return Inertia::render("JudicialProcess/Process/Index");
    }
    function noActive(Request $request) {
        return Inertia::render("JudicialProcess/ProcessFail/Activation");
    }

    function create(Request $request) {
        // $departaments = $this->documentCategoryRepository->all();
        return Inertia::render("JudicialProcess/Process/Create",compact(
            'departaments','typeProcess','typeAmount', 'unities','offices',
            'plaintiffs', 'users','defendants','judges', 'themes', 'externalRepresentants',
            'secretaries'
        ));
    }

    // store - update
    function store(Request $request) { 
        $data = $request['data'];
        unset($request['data']);
        $data2 = $this->processDocumentRepository->storeGeneral($request->all());
        if($data) {
            $path = "juridica/juriduca_" . $data2->id . "/" . $data2['filename'];
    
            $fileData = substr($data, strpos($data, ',') + 1);
    
            Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

            $data2->data = '/storage/'.$path;
            $data2->save();
        }
        // guardar archivo
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->processDocumentRepository->list($request->all(),with: ['process','category']);
        return response()->json($data);
    }

    function dataForm() {
        $categories = $this->documentCategoryRepository->all();
        return response()->json(
            [
                'categories' => $categories
            ]
        );
    }

    function show(String $id) {
        $object = $this->documentCategoryRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->processDocumentRepository->find($id);
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
