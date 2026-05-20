<?php

namespace App\Http\Controllers;

use App\Repositories\ProcessRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProcessInformsController extends Controller
{   
    private $processRepository;

    public function __construct(
        ProcessRepository $processRepository
    )
    {
        $this->processRepository = $processRepository;
    }
    
    function contingencies(Request $request) {
        return Inertia::render('JudicialProcess/Contingencies/Index');
    }
    function contingenciesData(Request $request) {
        $request['with_archived'] = true;
        $data = $this->processRepository->informContingence($request->all());
        return response()->json($data);
    }
}
