<?php

namespace App\Http\Controllers;

use App\Repositories\CancellationRequestFilingRepository;
use App\Repositories\FilingLogRepository;
use App\Repositories\FilingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CancellationRequestFilingController extends Controller
{
    public function __construct(
        private CancellationRequestFilingRepository $cancellationRequestFilingRepository,
        private FilingRepository $filingRepository,
        private FilingLogRepository $filingLogRepository

    ) {
    }

    function index(Request $request)
    {
        return Inertia::render("correspondenceManagement/cancellation_request/Index", [
        ]);
    }

    function create(Request $request)
    {

        return Inertia::render("correspondenceManagement/cancellation_request/Create");
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->cancellationRequestFilingRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->cancellationRequestFilingRepository->list($request->all(), ['filing.typesFilings', 'user.persona']);

        return response()->json($data);
    }

    function edit(string $id)
    {
        return Inertia::render("Configuration/cancellationRequestFiling/Create", compact('id'));
    }

    function show(string $id)
    {
        $object = $this->cancellationRequestFilingRepository->find($id);
        return response()->json($object);
    }

    function destroy(string $id)
    {
        $object = $this->cancellationRequestFilingRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->cancellationRequestFilingRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at', 'updated_at', 'deleted_at', 'id']);
        }
        return $this->cancellationRequestFilingRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', '');
    }
    function updateStateCancelation(Request $request)
    {
        try {
            $id = $this->cancellationRequestFilingRepository->updateStateCancelation($request);
            $response = $this->filingRepository->updateStateCancelation($request);

            $status = $request['cancelation_status']; // 1 = Aceptada, 2 = Rechazada
            $dataLog = [
                'action_es' => $status == 1 ? 'Solicitud de cancelación aceptada' : 'Solicitud de cancelación rechazada',
                'action_en' => $status == 1 ? 'Filing cancellation request accepted' : 'Filing cancellation request rejected',

                'description_es' => sprintf(
                    'Se ha %s la solicitud de cancelación del radicado. Observación: %s',
                    $status == 1 ? 'aceptado' : 'rechazado',
                    $request['observation_response'] ?: 'Sin observación'
                ),
                'description_en' => sprintf(
                    'The filing cancellation request has been %s. Observation: %s.',
                    $status == 1 ? 'accepted' : 'rejected',
                    $request['observation_response'] ?: 'No observation'
                ),

                'icon' => $status == 1 ? 'pi-check' : 'pi-times', // Icono de aceptación o rechazo
                'creado_por_id' => Auth::id(),
                'filing_id' => $response['data']['id'],
                'dependency_id' => $response['data']['dependency_id'],
                'color' => $status == 1 ? '#28A745' : '#DC3545' // Verde para aceptar, rojo para rechazar
            ];
            $this->filingLogRepository->storeGeneral($dataLog);
            //dd($request['observation_response']);

            return response()->json([
                'success' => true,
                'filingRequest' => $response['data']['filing_number'],
            ], 200);
        } catch (\Throwable $th) {
            dd($th);
        }

    }
}
