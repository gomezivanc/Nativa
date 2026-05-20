<?php

namespace App\Http\Controllers;

use App\Repositories\ThirdsRepository;
use App\Repositories\TypePersonRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ThirdsController extends Controller
{
        public function __construct(private ThirdsRepository $thirdsRepository, private TypePersonRepository $typePersonRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Configuration/thirds/Index",[
        ]);
    }

    function create(Request $request) {
        $typePerson = $this->typePersonRepository->all();

        return Inertia::render("Configuration/thirds/Create",compact('typePerson'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $userData['creation_type'] = 1; // Indicar que el tercero fue creado desde el módulo de terceros
        $data = $this->thirdsRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->thirdsRepository->list($request->all(),['city']);
        return response()->json($data);
    }

    function edit(String $id) {
        $typePerson = $this->typePersonRepository->all();
        return Inertia::render("Configuration/thirds/Create",compact('id','typePerson'));
    }

    function show(String $id) {
        $object = $this->thirdsRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->thirdsRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->thirdsRepository->list(array_merge($filters, ['typeData' => 'todos']));
        $data2 = [];

        foreach ($data as $key => $value) {
            $item = [
                'name_social_reason_sender' => $value->name_social_reason_sender,
                'first_surname_legal_representative_sender' => $value->first_surname_legal_representative_sender,
                'document_nit_sender' => $value->document_nit_sender,
                'address_sender' => $value->address_sender,
                'phone_sender' => $value->phone_sender,
                'email_sender' => $value->email_sender,
            ];

            $data2[] = $item;
        }
        return $this->thirdsRepository->export($type,$data2,'Excel.Export.generalExport','filing.standard_filing.form','Terceros');
    }
}
