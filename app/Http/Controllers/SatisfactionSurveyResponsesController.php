<?php

namespace App\Http\Controllers;

use App\Models\SatisfactionSurvey;
use App\Repositories\SatisfactionSurveyResponsesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SatisfactionSurveyResponsesController extends Controller
{
    public function __construct(private SatisfactionSurveyResponsesRepository $satisfactionSurveyResponsesRepository)
    {
    }

    function response(SatisfactionSurvey $satisfaction_survey) {
        $questions = $satisfaction_survey->questions;

        return Inertia::render('Configuration/satisfactionSurvey/Response',compact('questions','satisfaction_survey'));
    }

    function store(SatisfactionSurvey $satisfaction_survey,Request $request) {
        $responses = $request->all();
        foreach ($responses as $qId => $response) {
            $this->satisfactionSurveyResponsesRepository->storeGeneral([
                'question_id' => $qId,
                'survey_id' => $satisfaction_survey->id,
                'response' => $response,
                'user_id' => Auth::user()->id
            ]);
        }

        return response()->json([]);
    }

    public function resume(Request $request)
    {
        $surveyData = $this->satisfactionSurveyResponsesRepository->getModel()
            ->select('survey_id', DB::raw('COUNT(*) as total_responses'))
            ->with('satisfaction')
            ->groupBy('survey_id')
            ->get();
        $questionData = [];
        if($request->query('survey_id')) {
            $questionData = $this->satisfactionSurveyResponsesRepository->getModel()
                ->select(
                    'question_id',
                    'satisfaction_survey_questions.question', // Traemos el texto de la pregunta
                    'response',
                    DB::raw('COUNT(*) as count')
                )
                ->join('satisfaction_survey_questions', 'satisfaction_survey_questions.id', '=', 'satisfaction_survey_responses.question_id') // Hacemos join para traer el texto de la pregunta
                ->where('satisfaction_survey_responses.survey_id', $request->query('survey_id'))
                ->groupBy('question_id', 'satisfaction_survey_questions.question', 'response')
                ->get();
                // dd($questionData);
        }


        $userData = $this->satisfactionSurveyResponsesRepository->getModel()
            ->select('user_id', DB::raw('COUNT(DISTINCT survey_id) as total_surveys'))
            ->with('user.persona')
            ->groupBy('user_id')
            ->get();

        $avgData = $this->satisfactionSurveyResponsesRepository->getModel()
            ->select('survey_id', DB::raw('COUNT(*) / COUNT(DISTINCT user_id) as avg_responses_per_user'))
            ->with('satisfaction')
            ->groupBy('survey_id')
            ->get();

        return Inertia::render('Configuration/satisfactionSurvey/Resume', [
            'surveyData' => $surveyData,
            'questionData' => $questionData,
            'userData' => $userData,
            'avgData' => $avgData,
        ]);
    }

}
