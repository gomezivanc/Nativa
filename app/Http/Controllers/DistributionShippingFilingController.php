<?php

namespace App\Http\Controllers;

use App\Repositories\ConfServicesProviderRepository;
use App\Repositories\DistributionShippingFilingRepository;
use App\Repositories\ResponseTemplateRepository;
use App\Repositories\FilingRepository;
use App\Repositories\AnswerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Models\Answer;
use App\Models\Filing;
use App\Models\ResponseTemplate;
use App\Http\Controllers\FilingController;
use Carbon\Carbon;

class DistributionShippingFilingController extends Controller
{
    public function __construct(
        private DistributionShippingFilingRepository $distributionShippingFilingRepository,
        private ConfServicesProviderRepository $confServicesProviderRepository,
        private FilingRepository $filingRepository,
        private ResponseTemplateRepository $responseTemplateRepository,
        private AnswerRepository $answerRepository,
        private ExpFilesTypeDocRepository $expFilesTypeDocRepository,
        private FilingController $filingController
    ) {
    }

    function index(Request $request)
    {
        $servicesToAdd = $this->confServicesProviderRepository->all();

        return Inertia::render("correspondenceManagement/distributionShippingFiling/Index", [
            'servicesToAdd' => $servicesToAdd
        ]);
    }

    function indexAcus(Request $request) {
        $servicesToAdd = $this->confServicesProviderRepository->all();
        return Inertia::render("correspondenceManagement/accusation/Index", [
            'servicesToAdd' => $servicesToAdd
        ]);
    }

    function create(Request $request)
    {

        return Inertia::render("correspondenceManagement/distributionShippingFiling/Create");
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->distributionShippingFilingRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->distributionShippingFilingRepository->list($request->all(), []);

        return response()->json($data);
    }

    function listdistri(Request $request)
    {
        $requestData = $request->all();
        $requestData['state'] = 5;
        $data = $this->responseTemplateRepository->list($requestData, [ 'answers','filing', 'filing.dependency' ,'third' ,'third.city','third.department','third.country' , 'filing.user' , 'filing.documentalType' , 'filing.typesFilings' ,'filing.receptionMedia', 'filing.chargeDocFilings', 'filing.official.persona' ]);
        return response()->json($data);
    }

    function listAcus(Request $request)
    {
        $requestData = $request->all();
        if (!empty($requestData['perPage']) && is_array($requestData['perPage'])) {
            $requestData['created_at_init'] = $requestData['perPage']['created_at_init'] ?? null;
            $requestData['created_at_end'] = $requestData['perPage']['created_at_end'] ?? null;
            $requestData['perPage'] = 10;
        }
        $requestData['state'] = [6,7];
        $data = $this->responseTemplateRepository->list($requestData, [ 'answers','template', 'filing', 'filing.dependency' ,'third' ,'third.city','third.department','third.country' , 'filing.user' , 'filing.documentalType' , 'filing.typesFilings' ,'filing.receptionMedia', 'filing.chargeDocFilings', 'filing.official.persona' ]);
        
        return response()->json($data);
    }

    function edit(string $id)
    {
        return Inertia::render("correspondenceManagement/distributionShippingFiling/Create", compact('id'));
    }

    function show(string $id)
    {
        $object = $this->distributionShippingFilingRepository->find($id);
        return response()->json($object);
    }

    function destroy(string $id)
    {
        $object = $this->distributionShippingFilingRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->distributionShippingFilingRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at', 'updated_at', 'deleted_at', 'id']);
        }
        return $this->distributionShippingFilingRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', '');
    }

    function sendShippingMail(Request $request)
    {
        try {

            $plantilla = $this->responseTemplateRepository->find($request->filing);

            $filing = $this->filingRepository->find($plantilla->filings_id);
            
            $filingNumber = generateFilingNumber($filing->types_filings_id, 1);

            if (is_array($filingNumber) && isset($filingNumber['error'])) {
                return response()->json([
                    'error' => $filingNumber['error']
                ], 400);
            }
            
            $dataFiledDeparture = [
                'filings_id' => $filing->id,
                'departure_filing' => $filingNumber,
                'id_response_template' => $plantilla->id,
            ];
            
            $filed_departure = $this->answerRepository->findBy([
                'id_response_template' => $plantilla->id
            ])->first();

            if(!$filed_departure){
                $this->answerRepository->storeGeneral($dataFiledDeparture);
            }
        
            $pathDocument = $this->distributionShippingFilingRepository->saveDataMail($request->except('shipping_receipt', 'email', 'emails'), $request->shipping_receipt);

            $temple = ResponseTemplate::findOrFail($plantilla->id);
            $temple->state = 6;
            $temple->transfer_date = Carbon::now();
            $temple->save();

            return response()->json([
                'success' => true,
                'message' => 'Exitoso proceso de distribucion',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage()
            ], 500);
        }


    }
    function updateStateCorrespondece(Request $request)
    {
        try {
            $message = $this->filingRepository->updateStateCorrespondece($request);
            if ($message['success']) {
                return [
                    'success' => true,
                    'message' => 'Estado de envío actualizado correctamente.'
                ];
            }
        } catch (\Throwable $th) {
            //throw $th;
        }

    }
    function newStateCorrespondece(Request $request)
    {
        try {
            $filing = $this->filingRepository->mailtransfer($request->filing_id);

            $responseId = $request->response_id;

            if (!str_starts_with($responseId, 'response_')) {
                return response()->json([
                    'message' => 'Estas intentando firmar un documento que no es una respuesta.'
                ], 400);
            }

            $id = str_replace('response_', '', $responseId);


            $temple = $this->responseTemplateRepository->mailtransfer($id);

            if(is_object($filing) && is_object($temple)){
                return response()->json([
                    'message' => 'Traslado Exitoso.'
                ], 200);
            }else{
                 return response()->json([
                    'message' => 'Traslado Fallido.'
                ], 400);
            }
        } catch (\Throwable $th) {
        }
    }

    function showdistribution(Request $request)
    {   
        $requestData['id'] = $request->id;
        $data = $this->responseTemplateRepository->list($requestData, [ 'answers','filing', 'filing.dependency' ,'third' ,'third.city','third.department','third.country' , 'filing.user' , 'filing.documentalType' , 'filing.typesFilings' ,'filing.receptionMedia', 'filing.chargeDocFilings', 'filing.official.persona' ])->first();

        return Inertia::render(    "correspondenceManagement/distributionShippingFiling/Showdistribution",[ ...$data->toArray(),'servicesToAdd' => $request->servicesToAdd]);
    }
}
