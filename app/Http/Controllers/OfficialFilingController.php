<?php

namespace App\Http\Controllers;

use App\Repositories\FilingRepository;
use App\Repositories\TypePersonRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OfficialFilingController extends Controller
{
    public function __construct(
        private FilingRepository $filingRepository,
        private TypePersonRepository $typePersonRepository,
    ) {
    }

    function index(Request $request)
    {
        return Inertia::render("filing/registered_official/Index", []);
    }

    function list(Request $request)
    {
        $officialIdPersona = Auth::user()->id;

        $requestData = $request->all();
        $requestData['official_id'] = $officialIdPersona;
        $requestData['cancelation_request'] = [0, 1];

        $data = $this->filingRepository->list(
            $requestData,
            [
                'typesFilings',
                'documentalType',
                'clasification',
                'priority',
                'peopleType',
                'country',
                'department',
                'city',
                'receptionMedia',
                'dependency',
                'official.persona',
                'chargeDocFilings',
                'filing_logs',
                'responseTemplates'
            ]
        );

        return response()->json($data);
    }

    function indexProcedures(Request $request)
    {
        return Inertia::render("filing/formalities/Index", []);
    }

    function createProcedures(Request $request)
    {  
        $typePerson = $this->typePersonRepository->all();
        $currentLocale = App::getLocale();
        return Inertia::render("filing/formalities/Create", compact('currentLocale','typePerson'));
    }

    function listProcedures(Request $request)
    {  
        // return Inertia::render("filing/formalities/Index", []);
    }
}
