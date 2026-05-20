<?php

namespace App\Http\Controllers;

use App\Models\AplicativoUsuario;
use App\Models\ProcesNotices;
use App\Models\ProcessBeforeCommittee;
use App\Models\ProcessRepetitionStudy;
use App\Models\User;
use App\Repositories\FilingRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\RolesRepository;
use App\Repositories\ThirdsRepository;
use App\Repositories\UsuarioRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use App\Mail\notificacionMailable;
use Illuminate\Support\Facades\Mail;

class DashboardController extends Controller
{
    function __construct(private FilingRepository $filingRepository, private UsuarioRepository $usuarioRepository,
        private ThirdsRepository $thirdsRepository, private RolesRepository $rolesRepository, private GDDependencyRepository $gDDependencyRepository) {
    }


    function index(Request $request) {
        $dateFrom = $request->input('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfMonth()->toDateString());

        $stats = [];
        $stats['users'] = $this->usuarioRepository->getModel()->selectRaw('
            SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as inactive,
            COUNT(*) as total
        ')->first()->toArray();
        $stats['clients'] = $this->thirdsRepository->getModel()->selectRaw('
            SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as inactive,
            COUNT(*) as total
        ')->first()->toArray();

        $stats['reports'] = DB::table('filings')
            ->leftJoin('type_of_procedure', 'filings.typeProcess_id', '=', 'type_of_procedure.id')
            ->whereBetween(DB::raw('DATE(filings.created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('COUNT(*) as total, COALESCE(type_of_procedure.name, "Sin tipo") as name')
            ->groupBy('type_of_procedure.name')
            ->get()
            ->toArray();

        $logs = Activity::with('causer.persona:id,nombre,apellido')->latest()->limit(5)->get();

        $roles = $this->rolesRepository->getModel()->select('id', 'name')->get()->pluck('name')->toArray();

        $usersPerRole = $this->rolesRepository->getModel()
            ->withCount('users')
            ->get()
            ->pluck('users_count')
            ->toArray();


        $dependencies = $this->gDDependencyRepository->getModel()->select('id', 'name')->get()->pluck('name')->toArray();
        // Obtener la cantidad de usuarios por dependencia
        $usersPerDependency = User::select('dependency_id', \DB::raw('count(id) as user_count'))
        ->groupBy('dependency_id') // Agrupamos por dependencia
        ->get()
        ->mapWithKeys(function($item) use ($dependencies) {
            // Verificar si la dependencia existe en el array de dependencias
            if (isset($dependencies[$item->dependency_id])) {
                return [$item->user_count]; // Usamos el nombre de la dependencia
            }
            // Si no se encuentra, asignamos un nombre genérico para la dependencia (por ejemplo, "Desconocida")
            return [];
        })
        ->toArray();

        // ===== NUEVAS CONSULTAS PARA RADICADOS =====

        // 1. Radicados por día
        $filingsByDay = DB::table('filings')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('day')
            ->get();

        // 2. Radicados por dependencia con desglose por estado
        $filingsByDependency = DB::table('filings')
            ->leftJoin('g_d_dependencies', 'filings.dependency_id', '=', 'g_d_dependencies.id')
            ->whereBetween(DB::raw('DATE(filings.created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('
                COALESCE(g_d_dependencies.name, "Sin dependencia") as dependency_name,
                COUNT(*) as total,
                SUM(CASE WHEN filings.deleted_at IS NULL AND (filings.finished != 1 OR filings.finished IS NULL) AND (filings.cancelation_request != 1 OR filings.cancelation_request IS NULL) AND filings.expiration_date >= CURDATE() THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN filings.deleted_at IS NULL AND (filings.finished != 1 OR filings.finished IS NULL) AND (filings.cancelation_request != 1 OR filings.cancelation_request IS NULL) AND filings.expiration_date < CURDATE() THEN 1 ELSE 0 END) as expired,
                SUM(CASE WHEN (filings.deleted_at IS NULL AND filings.finished = 1 AND (filings.cancelation_request != 1 OR filings.cancelation_request IS NULL)) OR filings.deleted_at IS NOT NULL THEN 1 ELSE 0 END) as finished_count,
                SUM(CASE WHEN filings.deleted_at IS NULL AND filings.cancelation_request = 1 THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN filings.deleted_at IS NULL THEN COALESCE((SELECT COUNT(*) FROM response_templates rt WHERE rt.filings_id = filings.id), 0) ELSE 0 END) as responded
            ')
            ->groupBy('filings.dependency_id', 'g_d_dependencies.name')
            ->orderByRaw('COUNT(*) DESC')
            ->get();

        // 3. Radicados por sede/regional
        $filingsByRegional = DB::table('filings')
            ->leftJoin('g_d_dependencies', 'filings.dependency_id', '=', 'g_d_dependencies.id')
            ->leftJoin('regionals', 'g_d_dependencies.regional_id', '=', 'regionals.id')
            ->whereBetween(DB::raw('DATE(filings.created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('COALESCE(regionals.name, "Principal") as regional_name, COUNT(*) as total')
            ->groupBy('regionals.name')
            ->orderByRaw('COUNT(*) DESC')
            ->get();

        // 4. Top solicitantes
        $topApplicants = DB::table('filings')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->selectRaw('name_social_reason_sender as name, COUNT(*) as total')
            ->groupBy('name_social_reason_sender')
            ->orderByRaw('COUNT(*) DESC')
            ->limit(10)
            ->get();

        // Total de radicados en el rango
        $totalFilingsInRange = DB::table('filings')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->count();

        // Entrada vs Salida
        $totalEntrada = DB::table('filings')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->where('filing_number', 'like', '%E%')
            ->count();

        $totalEntradaCorreo = DB::table('received_emails')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->where('filing_number', 'like', '%E%')
            ->count();

        $totalSalidaFilings = DB::table('filings')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->where('filing_number', 'like', '%S%')
            ->count();

        $totalSalidaDeparture = DB::table('filed_departure')
            ->whereBetween(DB::raw('DATE(created_at)'), [$dateFrom, $dateTo])
            ->where('departure_filing', 'like', '%S%')
            ->count();

        $totalSalida = $totalSalidaFilings + $totalSalidaDeparture;

        $totalFilingsInRange = $totalFilingsInRange + $totalEntradaCorreo;

        $totalEntrada = $totalEntrada + $totalEntradaCorreo;

        // seccion para revisar la fecha de finalizacion de los contratos y notificar

        $usuariosContratistas = $this->usuarioRepository->allContractor();
        $hoy = Carbon::now();

        foreach ($usuariosContratistas as $dato) {

            $finaliza = Carbon::parse($dato->fecha_finaliza);
            $diasNotificacion = (int) $dato->notification;
            $yaFueNotificado = (int) $dato->notificacion_correo;

            $diasRestantes = $hoy->diffInDays($finaliza, false);

            if ($diasRestantes >= 0 && $diasRestantes == $diasNotificacion && $yaFueNotificado == 0) {

                $dataBase = [
                    'aplicacion' => env('APP_NAME'),
                    'nombre_contratista' => $dato->persona->nombre,
                    'apellido_contratista' => $dato->persona->apellido,
                    'tiempo_restante' => $diasNotificacion,
                    'fecha_Finalizacion' => $finaliza,
                ];

                $destinatario = array_filter([
                    $dato->boss_mail,
                    $dato->email
                ]);

                $correo = new notificacionMailable(
                    'Notificacion Contrato Pronto a Terminar',
                    'Email.notificacionFinalizaContrato',
                    $dataBase
                );

                Mail::to($dato->email)->cc($dato->boss_mail)->send($correo);

                //evitar reenvío
                $dato->notificacion_correo = 1;
                $dato->save();
            }elseif($diasRestantes == 0){
                $dato->delete();
            }
        }

        return Inertia::render('Dashboard',compact(
            'stats','logs','roles','usersPerRole', 'dependencies','usersPerDependency',
            'filingsByDay', 'filingsByDependency', 'filingsByRegional', 'topApplicants',
            'dateFrom', 'dateTo', 'totalFilingsInRange', 'totalEntrada', 'totalSalida'
        ));
    }
}
