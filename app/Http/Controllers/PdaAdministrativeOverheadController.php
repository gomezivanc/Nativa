<?php

namespace App\Http\Controllers;

use App\Repositories\DefendantsRepository;
use App\Repositories\JudicialOfficesRepository;
use App\Repositories\PdaAcceptRequestRepository;
use App\Repositories\PdaAdministrativeOverheadRepository;
use App\Repositories\PdaComiteRepetitionRepository;
use App\Repositories\PdaComplianceVerificationsRepository;
use App\Repositories\PdaExhaustionRepository;
use App\Repositories\PdaExistResourceRepository;
use App\Repositories\PdaJurisdictionCorrespondsRepository;
use App\Repositories\PdaPJudicialsRepository;
use App\Repositories\PdaPrejudicialsRepository;
use App\Repositories\PdaProbabilitiesRepository;
use App\Repositories\PdaReclamationRepository;
use App\Repositories\PdaSentenceUnificationRepository;
use App\Repositories\PdaTypeSentenceUnificationRepository;
use App\Repositories\PlaintiffsRepository;
use App\Repositories\ProcessResultsRepository;
use App\Repositories\TypeProcessRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PdaAdministrativeOverheadController extends Controller
{
    private $pdaAdministrativeOverheadRepository;
    private $pdaAcceptRequestRepository;
    private $pdaReclamationRepository;
    private $pdaSentenceUnificationRepository;
    private $pdaTypeSentenceUnificationRepository;
    private $pdaExistResourceRepository;
    private $pdaExhaustionRepository;
    private $judicialOfficesRepository;
    private $pdaPrejudicialsRepository;
    private $pdaJurisdictionCorrespondsRepository;
    private $typeProcessRepository;
    private $plaintiffsRepository;
    private $userRepository;
    private $pdaProbabilitiesRepository;
    private $pdaPJudicialsRepository;
    private $defendantsRepository;
    private $processResultsRepository;
    private $pdaComplianceVerificationsRepository;
    private $pdaComiteRepetitionRepository;

    public function __construct(
        PdaAdministrativeOverheadRepository $pdaAdministrativeOverheadRepository,PdaAcceptRequestRepository $pdaAcceptRequestRepository,
        PdaReclamationRepository $pdaReclamationRepository,PdaSentenceUnificationRepository $pdaSentenceUnificationRepository, 
        PdaTypeSentenceUnificationRepository $pdaTypeSentenceUnificationRepository, PdaExistResourceRepository $pdaExistResourceRepository,
        PdaExhaustionRepository $pdaExhaustionRepository, JudicialOfficesRepository $judicialOfficesRepository, PdaPrejudicialsRepository $pdaPrejudicialsRepository,
        PdaJurisdictionCorrespondsRepository $pdaJurisdictionCorrespondsRepository, TypeProcessRepository $typeProcessRepository, PlaintiffsRepository $plaintiffsRepository,
        UserRepository $userRepository, PdaProbabilitiesRepository $pdaProbabilitiesRepository, PdaPJudicialsRepository $pdaPJudicialsRepository,
        DefendantsRepository $defendantsRepository, ProcessResultsRepository $processResultsRepository, PdaComplianceVerificationsRepository $pdaComplianceVerificationsRepository,
        PdaComiteRepetitionRepository $pdaComiteRepetitionRepository
        )
    {
        $this->pdaAdministrativeOverheadRepository = $pdaAdministrativeOverheadRepository;
        $this->pdaAcceptRequestRepository = $pdaAcceptRequestRepository;
        $this->pdaReclamationRepository = $pdaReclamationRepository;
        $this->pdaSentenceUnificationRepository = $pdaSentenceUnificationRepository;
        $this->pdaTypeSentenceUnificationRepository = $pdaTypeSentenceUnificationRepository;
        $this->pdaExistResourceRepository = $pdaExistResourceRepository;
        $this->pdaExhaustionRepository = $pdaExhaustionRepository;
        $this->judicialOfficesRepository = $judicialOfficesRepository;
        $this->pdaPrejudicialsRepository = $pdaPrejudicialsRepository;
        $this->pdaJurisdictionCorrespondsRepository = $pdaJurisdictionCorrespondsRepository;
        $this->typeProcessRepository = $typeProcessRepository;
        $this->plaintiffsRepository = $plaintiffsRepository;
        $this->userRepository = $userRepository;
        $this->pdaProbabilitiesRepository = $pdaProbabilitiesRepository;
        $this->pdaPJudicialsRepository = $pdaPJudicialsRepository;
        $this->defendantsRepository = $defendantsRepository;
        $this->processResultsRepository = $processResultsRepository;
        $this->pdaComplianceVerificationsRepository = $pdaComplianceVerificationsRepository;
        $this->pdaComiteRepetitionRepository = $pdaComiteRepetitionRepository;
    }

    function index(Request $request) {
        // Etapa 1
        $S1Reclamations = $this->pdaReclamationRepository->all();
        $S1ResourceExist = $this->pdaExistResourceRepository->all();
        $S1typeSentence = $this->pdaTypeSentenceUnificationRepository->all();
        $S1Sentence = $this->pdaSentenceUnificationRepository->all();
        $S1AcceptRequest = $this->pdaAcceptRequestRepository->all();

        //Etapa 2
        $S2Exhaustions = $this->pdaExhaustionRepository->all();
        $S2judicialOffices = $this->judicialOfficesRepository->all();

        // Etapa 3
        $S3JurisdictionCorresponds = $this->pdaJurisdictionCorrespondsRepository->all();
        $S3typesProcess = $this->typeProcessRepository->all();
        $S3PlanPlaniffys = $this->plaintiffsRepository->all();
        $S3Defendants = $this->defendantsRepository->all();
        $S3Probabilities = $this->pdaProbabilitiesRepository->all();
        $S3processResults = $this->processResultsRepository->all();
        $S3pdaComiteRepetition = $this->pdaComiteRepetitionRepository->all();

        return Inertia::render("JudicialProcess/PublicPoliticDamageAntiJuridico/Index",[
            'S1Reclamations' => $S1Reclamations,
            'S1typeSentence' => $S1typeSentence,
            'S1ResourceExist' => $S1ResourceExist,
            'S1Sentence' => $S1Sentence,
            'S1AcceptRequest' => $S1AcceptRequest,

            'S2Exhaustions' => $S2Exhaustions,
            'S2judicialOffices' => $S2judicialOffices,

            'S3JurisdictionCorresponds' => $S3JurisdictionCorresponds,
            'S3typesProcess' => $S3typesProcess,
            'S3PlanPlaniffys' => $S3PlanPlaniffys,
            'S3Probabilities' => $S3Probabilities,
            'S3Defendants' => $S3Defendants,
            'S3processResults' => $S3processResults,
            'S3pdaComiteRepetition' => $S3pdaComiteRepetition
        ]);
    }

    function create(Request $request) {
        return Inertia::render("JudicialProcess/PublicPoliticDamageAntiJuridico/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        
        if($request['action'] == 'stage_1') {
            unset($request['action']);
            $data = $this->pdaAdministrativeOverheadRepository->storeGeneral($request->all());
        }
        if($request['action'] == 'stage_2') {
            unset($request['action']);
            $data = $this->pdaPrejudicialsRepository->storeGeneral($request->all());
        }
        if($request['action'] == 'stage_3') {
            unset($request['action']);
            $data = $this->pdaPJudicialsRepository->storeGeneral($request->all());
        }
        if($request['action'] == 'stage_4') {
            unset($request['action']);
            $data = $this->pdaComplianceVerificationsRepository->storeGeneral($request->all());
        }

        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->pdaAdministrativeOverheadRepository->list($request->all());

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("JudicialProcess/PublicPoliticDamageAntiJuridico/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->pdaAdministrativeOverheadRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->pdaAdministrativeOverheadRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function existStageId(Request $request) {
        $request->validate([
            'stage_id' => 'required',
            'id_proceso' => 'required',
        ]);

        $stage_id = $request->stage_id;
        $id_proceso = $request->id_proceso;
        if($stage_id == 1) {
            return $this->pdaAdministrativeOverheadRepository->validateStage($id_proceso);
        }
        if($stage_id == 2) {
            return $this->pdaPrejudicialsRepository->validateStage($id_proceso);
        }
        if($stage_id == 3) {
            return $this->pdaPJudicialsRepository->validateStage($id_proceso);
        }
        if($stage_id == 4) {
            return $this->pdaComplianceVerificationsRepository->validateStage($id_proceso);
        }
    }
}

