<?php

namespace App\Http\Controllers;

use App\Repositories\AccumulatedFundRepository;
use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\TypesBodyRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccumulatedFundController extends Controller
{
        public function __construct(private AccumulatedFundRepository $accumulatedFundRepository, private ExpFilesClasificationsRepository $expFilesClasificationsRepository,private TypesBodyRepository $typesBodyRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("archive_gestion/AccumulatedFunds/Index",[
        ]);
    }

    function create(Request $request) {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typesBody = $this->typesBodyRepository->all();

        return Inertia::render("archive_gestion/AccumulatedFunds/Create",compact('clasifications','typesBody'));
    }

    // store - update
    function store(Request $request) {
        $request->validate([
            'number' => 'required|unique:accumulated_funds,number,'.$request['id'],
        ]);

        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->accumulatedFundRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->accumulatedFundRepository->list($request->all(),[
            'departament','city','third','clasification','ubication','typeBody','user','typeArea',
        ]);

        return response()->json($data);
    }

    function edit(String $id) {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typesBody = $this->typesBodyRepository->all();

        return Inertia::render("archive_gestion/AccumulatedFunds/Create",compact('id','clasifications','typesBody'));
    }

    function show(String $id) {
        $object = $this->accumulatedFundRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->accumulatedFundRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->accumulatedFundRepository->list(array_merge($filters, ['typeData' => 'todos']), with: [
            'departament','city','third','clasification','ubication','typeBody','user','typeArea',
        ]);
        $dataO = [];

        foreach ($data as $key => $value) {
            $item = [
                'number' => $value->number,
                'physical_location' => $value->physical_location,
                'word' => $value->word,
                'subject' => $value->word,
                'type_document' => $value->type_document['name'],
                'serie' => $value->serie['name'],
                'subserie' => $value->subserie['name'],
                'remi_desti_id' => $value->third?->name_social_reason_sender,
                'clasification_id' => $value->clasification?->{'name_' . session('locale','es')},
                'dep_id' => $value->departament?->nombre,
                'ciu_id' => $value->city?->nombre,
                'building' => $value->city?->building,
                'floor' => $value->floor,
                'file_area_id' => $value->ubication?->name,
                'type' => $value->type,
                'rack' => $value->rack,
                'module' => $value->module,
                'panel' => $value->panel,
                'box' => $value->box,
                'type_body_id' => $value->typeBody?->name,
            ];

            $dataO[] = $item;
        }

        return $this->accumulatedFundRepository->export($type,$dataO,'Excel.Export.generalExport','archive_gestion.accumulated_fund.form');
    }
}
