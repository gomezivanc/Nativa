<?php

namespace App\Http\Controllers;

use App\Repositories\SatisfactionSurveyRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Tymon\JWTAuth\Facades\JWTAuth;

class SatisfactionSurveyController extends Controller
{
    public function __construct(private SatisfactionSurveyRepository $satisfactionSurveyRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/satisfactionSurvey/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/satisfactionSurvey/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->satisfactionSurveyRepository->storeGeneral($request->except('questions'));

        if(!empty($request->questions)) {
            $data->questions()->delete();
            foreach ($request->questions as $key => $value) {
                $data->questions()->create([
                    'question' => $value['text']
                ]);
            }
        }

        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->satisfactionSurveyRepository->list($request->all(), ['questions'],['questions']);
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/satisfactionSurvey/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->satisfactionSurveyRepository->find($id,['questions']);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->satisfactionSurveyRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->satisfactionSurveyRepository->list(array_merge($filters, ['typeData' => 'todos']), withCount: ['questions']);
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'departament',
                'city',
                'id',
                'gdDependency'
            ]);
        }
        return $this->satisfactionSurveyRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.satisfaction_survey.form');
    }
}
