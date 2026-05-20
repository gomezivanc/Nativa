<?php

namespace App\Http\Controllers;

use App\Repositories\SolicitudesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\FilingLogRepository;
use App\Models\Filing;
use App\Models\CancellationRequestFiling;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ControlerApro extends Controller
{
    public function __construct(private SolicitudesRepository $solicitudesRepository, private FilingLogRepository $filingLogRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Control/Index", []);
    }

    function list(Request $request)
    {
        $with = [
            'filing' => function($query) {
                $query->withTrashed(); 
            },
            'official',
            'filing.official' => function($query) {
                $query->withTrashed();
            },
            'filing.dependency'
        ];

        $data = $this->solicitudesRepository->list($request->all(), $with);
        return response()->json($data);
    }

    function show(String $id)
    {
        $object = $this->solicitudesRepository->find($id,['questions']);
        return response()->json($object);
    }

    function apliacionTiempo(Request $request)
    {   
        $data = $request->all();
        $data['tipo'] = 1;  //1 es ampliacion de tiempo
        $data['id_official'] = Auth::user()->id;

        $object = $this->solicitudesRepository->storeGeneral($data);
        $filing = Filing::with('dependency')->findOrFail($request->id_filing);

        $dataLog = [
            'action_es' => 'Solicitud de Ampliacion de tiempo',
            'action_en' => 'Solicitud de Ampliacion de tiempo',

            'description_es' => sprintf(
                'Se ha solicitado la Ampliacion de tiempo de respuesta'
            ),
            'description_en' => sprintf(
                'Se ha solicitado la Ampliacion de tiempo de respuesta'
            ),
            'icon' => 'pi-calendar-plus', // Icono de cancelación
            'creado_por_id' => Auth::id(),
            'filing_id' => $request->id_filing,
            'dependency_id' => $filing->dependency_id,
            'color' => '#31dab5' // Rojo para indicar cancelación
        ];

            $this->filingLogRepository->storeGeneral($dataLog);

        return response()->json([
            'success' => true,
            'filingRequest' => $filing->filing_number,
        ], 200);
    }

    function accionEspecial(Request $request)
    {
        $data = $request->all();
        $data['id_official'] = Auth::user()->id;

        $object = $this->solicitudesRepository->storeGeneral($data);

        $actionDescription = match ($data['tipo']) {
            2 => 'Reasignación de radicado',
            3 => 'Reapertura de radicado',
            4 => 'Desbloque de radicado',
            default => 'Acción desconocida',
        };        

        $dataLog = [
            'action_es' => $actionDescription,
            'action_en' => $actionDescription,
            'description_es' => sprintf('Se ha realizado la acción: %s', $actionDescription),
            'description_en' => sprintf('Action performed: %s', $actionDescription),
            'icon' => $data['tipo'] === 2 ? 'pi-sitemap' : 'pi-undo',
            'creado_por_id' => Auth::id(),
            'filing_id' => $request->id_filing,
            'dependency_id' => Filing::withTrashed()->findOrFail($data['id_filing'])->dependency_id,
            'color' => $data['tipo'] === 2 ? '#007bff' : '#ffc107',
        ];

        $this->filingLogRepository->storeGeneral($dataLog);

        return response()->json([
            'success' => true
        ], 200);
    }

    function destroy(String $id)
    {
        $object = $this->solicitudesRepository->find($id);
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
        $data = $this->solicitudesRepository->all(hidden: [
            'created_at',
            'updated_at',
            'deleted_at',
            'creado_por_id',
            'departament',
            'city',
            'id',
            'gdDependency'
        ], withCount: ['questions']);
        // dd($data);
        return $this->solicitudesRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.satisfaction_survey.form');
    }

    public function aprobarSolicitud(Request $request)
    {   
        // dd('hola');
        DB::beginTransaction();

        try {
            $type = $request->type;

            $rules = [
                'id' => 'required|integer',
                'id_filing' => 'required|integer',
                'observation' => 'required|string',
            ];

            if ($type == 1) {
                $rules['additional_days'] = 'required|integer|min:1';
            }

            $request->validate($rules);

            $filing = Filing::withTrashed()->findOrFail($request->id_filing);

            $dataLog = [];

            switch ($type) {

                // 1. AMPLIACIÓN
                case 1:
                    $filing->remaining_days += $request->additional_days;

                    $filing->expiration_date = Carbon::parse($filing->expiration_date)
                        ->addDays($request->additional_days);

                    $filing->save();
                    
                    $this->solicitudesRepository->updateEstado($request->id, 1);
                    $this->destroy($request->id);

                    $dataLog = [
                        'action_es' => 'Aprobación de ampliación de tiempo',
                        'action_en' => 'Approval of time extension',
                        'description_es' => "Se aprobaron {$request->additional_days} días adicionales. Observación: {$request->observation}",
                        'description_en' => "{$request->additional_days} additional days approved. Observation: {$request->observation}",
                    ];
                    break;

                // 2. REASIGNACIÓN
                case 2:                     
                    $filing->dependency_id = $request->dependency_id;
                    $filing->official_id = $request->official_id;

                    $filing->save();

                    $this->solicitudesRepository->updateEstado($request->id, 1);
                    $this->destroy($request->id);

                    $dataLog = [
                        'action_es' => 'Aprobación de reasignación',
                        'action_en' => 'Reassignment approval',
                        'description_es' => "Solicitud de reasignación aprobada. Observación: {$request->observation}",
                        'description_en' => "Reassignment request approved. Observation: {$request->observation}",
                    ];
                    break;

                // 3. REAPERTURA / CANCELACIÓN
                case 3:
                    $filing->cancelation_request = null;
                    $filing->deleted_at = null;
                    $filing->save();
                    
                    $this->solicitudesRepository->updateEstado($request->id, 1);
                    $this->destroy($request->id);

                    CancellationRequestFiling::where('filing_id', $request->id_filing)->delete();

                    $dataLog = [
                        'action_es' => 'Aprobación de reapertura',
                        'action_en' => 'Reopening approval',
                        'description_es' => "Solicitud aprobada. Observación: {$request->observation}",
                        'description_en' => "Request approved. Observation: {$request->observation}",
                    ];
                    break;
                // Desbloqueo de radicados
                case 4:
                    $dataLog = [
                        'action_es' => 'Aprobación de Desbloqueo',
                        'action_en' => 'Reassignment approval',
                        'description_es' => "Solicitud de reasignación aprobada. Observación: {$request->observation}",
                        'description_en' => "Reassignment request approved. Observation: {$request->observation}",
                    ];

                    $this->solicitudesRepository->updateEstado($request->id, 1); // aprobado
                    // $this->store($datos);

                    $this->destroy($request->id);


                    break;
                default:
                    return response()->json(['success' => false, 'message' => 'Tipo no válido'], 400);
            }

            $dataLog = array_merge($dataLog, [
                'icon' => 'pi-calendar-plus',
                'creado_por_id' => Auth::id(),
                'filing_id' => $request->id_filing,
                'dependency_id' => $filing->dependency_id,
                'color' => '#31dab5',
            ]);

            $this->filingLogRepository->storeGeneral($dataLog);

            DB::commit();

            return response()->json(['success' => true]);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function negarSolicitud(Request $request)
    {   
        // dd($request->all());   
        DB::beginTransaction();

        try {
            $type = $request->type;

            $rules = [
                'id' => 'required|integer',
                'id_filing' => 'required|integer',
                'observation' => 'required|string',
                'type' => 'required|integer'
            ];

            $request->validate($rules);

            $filing = Filing::withTrashed()->findOrFail($request->id_filing);
            $dataLog = [];

            // 1. Actualizamos el estado a 2 (Negado/Rechazado)
            $this->solicitudesRepository->updateEstado($request->id, 2);
            $this->destroy($request->id);

            switch ($type) {
                // 1. AMPLIACIÓN
                case 1:
                    $dataLog = [
                        'action_es' => 'Negación de ampliación de tiempo',
                        'action_en' => 'Denial of time extension',
                        'description_es' => "Se negó la solicitud de días adicionales. Observación: {$request->observation}",
                        'description_en' => "Extension of days denied. Observation: {$request->observation}",
                        'icon' => 'pi-calendar-times',
                        'color' => '#ff4d4d',
                    ];
                    break;

                // 2. REASIGNACIÓN
                case 2:                     
                    $dataLog = [
                        'action_es' => 'Negación de reasignación',
                        'action_en' => 'Reassignment denial',
                        'description_es' => "Solicitud de reasignación rechazada. Observación: {$request->observation}",
                        'description_en' => "Reassignment request denied. Observation: {$request->observation}",
                        'icon' => 'pi-user-minus',
                        'color' => '#ff4d4d',
                    ];
                    break;

                // 3. REAPERTURA / CANCELACIÓN
                case 3:
                    $dataLog = [
                        'action_es' => 'Negación de reapertura/cancelación',
                        'action_en' => 'Reopening/Cancellation denial',
                        'description_es' => "Solicitud de reapertura negada. El documento permanecerá en su estado actual. Observación: {$request->observation}",
                        'description_en' => "Reopening request denied. Observation: {$request->observation}",
                        'icon' => 'pi-lock',
                        'color' => '#ff4d4d',
                    ];
                    break;

                // 4. DESBLOQUEO
                case 4:
                    $dataLog = [
                        'action_es' => 'Negación de desbloqueo',
                        'action_en' => 'Unlock denial',
                        'description_es' => "Solicitud de desbloqueo de radicado negada. Observación: {$request->observation}",
                        'description_en' => "Unlock request denied. Observation: {$request->observation}",
                        'icon' => 'pi-lock-open',
                        'color' => '#ff4d4d',
                    ];
                    break;

                default:
                    return response()->json(['success' => false, 'message' => 'Tipo no válido'], 400);
            }

            // Combinar con datos generales del log
            $dataLog = array_merge($dataLog, [
                'creado_por_id' => Auth::id(),
                'filing_id' => $request->id_filing,
                'dependency_id' => $filing->dependency_id,
            ]);

            $this->filingLogRepository->storeGeneral($dataLog);

            DB::commit();
            return response()->json(['success' => true]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la negación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
