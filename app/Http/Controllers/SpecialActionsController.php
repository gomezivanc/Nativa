<?php

namespace App\Http\Controllers;

use App\Models\Filing;
use App\Repositories\FilingRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Answer;
use App\Repositories\ExpClasificationArchiveRepository;
use App\Repositories\GDDependencyRepository;
class SpecialActionsController extends Controller
{
    protected $filingRepository;
    protected $expClasificationArchiveRepository;
    protected $dependencyRepository;
    public function __construct(FilingRepository $filingRepository, ExpClasificationArchiveRepository $expClasificationArchiveRepository, GDDependencyRepository $dependencyRepository)

    {
        $this->filingRepository = $filingRepository;
        $this->expClasificationArchiveRepository = $expClasificationArchiveRepository;
        $this->dependencyRepository = $dependencyRepository;
        
    }

    /**
     * Mostrar página de búsqueda de radicados generales
     */
    public function generalFilings()
    {
        $repoRequest = ['typeData' => true];
        return Inertia::render('Special_actions/General_filing/Index', [
            'filters' => [
                'number' => request()->query('number'),
                'person' => request()->query('person'),
                'email' => request()->query('email'),
                'document' => request()->query('document'),
                'phone' => request()->query('phone'),
                'subject' => request()->query('subject'),
                'date_from' => request()->query('date_from'),
                'date_to' => request()->query('date_to'),
                'status' => request()->query('status'),
                'priority' => request()->query('priority'),
                'per_page' => request()->query('per_page', 10),
            ],
            'archiveClasification' => $this->expClasificationArchiveRepository->all(),
            'dependencies' => $this->dependencyRepository->list($repoRequest, ['series', 'series.subseries', 'series.retencion', 'series.subseries.retencion']),

        ]);
    }

    /**
     * Buscar radicados según los filtros aplicados
     */
    public function searchGeneralFilings(Request $request)
    {
        $query = Filing::withTrashed()
            ->with(['typesFilings', 'documentalType', 'clasification', 'priority', 'peopleType', 'country', 'department', 'city', 'receptionMedia',
            'dependency', 'city', 'official.persona', 'chargeDocFilings',
            'filing_logs','filing_logs.creador','filing_logs.creador.dependency' , 'TypeOfProcedure', 'responseTemplates','filedDeparture' ,
            'responseTemplates.third' , 'responseTemplates.template']);

        // Filtro por número de radicado
        if ($request->filled('number')) {
            $query->where('filing_number', 'like', '%' . $request->input('number') . '%');
        }

        // Filtro por nombre de persona remitente
        if ($request->filled('person')) {
            $query->where(function($q) use ($request) {
                $q->where('name_social_reason_sender', 'like', '%' . $request->input('person') . '%')
                ->orWhere('first_surname_legal_representative_sender', 'like', '%' . $request->input('person') . '%');});
        }

        // Filtro por email
        if ($request->filled('email')) {
            $query->where('email_sender', 'like', '%' . $request->input('email') . '%');
        }

        // Filtro por documento/NIT
        if ($request->filled('document')) {
            $query->where('document_nit_sender', 'like', '%' . $request->input('document') . '%');
        }

        // Filtro por teléfono
        if ($request->filled('phone')) {
            $query->where('phone_sender', 'like', '%' . $request->input('phone') . '%');
        }

        // Filtro por asunto
        if ($request->filled('subject')) {
            $query->where('subject', 'like', '%' . $request->input('subject') . '%');
        }

        // Filtro por rango de fechas
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Filtro por prioridad
        if ($request->filled('priority')) {
            $query->where('id_priority', $request->input('priority'));
        }

        // Ordenar por fecha descendente y paginar
        $filingsPaginated = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 10));
        
        if ($request->filled('number')) {
            $departureResults = Answer::withTrashed()
                ->whereHas('filing', function($q) {
                    $q->withTrashed();
                }) 
                ->with([
                    'responseTemplate',
                    'responseTemplate.third',
                    'filing' => function($q) {
                        $q->withTrashed();
                    },
                    'filing.typesFilings',
                    'filing.priority',
                    'filing.official.persona',
                    'filing.dependency',
                    'filing.receptionMedia',
                    'filing.country',
                    'filing.department',
                    'filing.city',
                    'filing.chargeDocFilings',
                    'filing.responseTemplates',
                    'filing.responseTemplates.third',
                    'filing.responseTemplates.template'
                ])
                ->where('departure_filing', 'like', '%' . $request->input('number') . '%')
                ->get()
                ->map(function ($answer) {
                    return $this->formatAnswerAsFiling($answer);
                });

            if ($departureResults->isNotEmpty()) {
                $existingFilings = collect($filingsPaginated->items());
                
                $combinedData = $existingFilings->merge($departureResults);

                return response()->json([
                    'data' => $combinedData,
                    'total' => $filingsPaginated->total() + $departureResults->count(),
                    'per_page' => $filingsPaginated->perPage(),
                    'current_page' => $filingsPaginated->currentPage(),
                    'last_page' => $filingsPaginated->lastPage(),
                ]);
            }
        }
    
        return response()->json($filingsPaginated);
    }

    //formatAnswerResult
    private function formatAnswerAsFiling($answer)
    {
        $filing = $answer->filing;
        $third_response = $answer->responseTemplate->third;
        
        return [
            'id' => $answer->id,
            'answer_id' => $answer->id,
            'filing_id' => $filing->id ?? 'N/A',
            'filing_number' => $filing->filing_number  . ' <br> ' . $answer->departure_filing ?? 'N/A',
            'departure_number' => $answer->filing_number ?? 'N/A',
            'type' => 'salida',
            'name_social_reason_sender' => $third_response->name_social_reason_sender ?? 'N/A',
            'first_surname_legal_representative_sender' => $third_response->first_surname_legal_representative_sender ?? 'N/A',
            'document_nit_sender' => $third_response->document_nit_sender ?? 'N/A',
            'email_sender' => $third_response->email_sender ?? 'N/A',
            'phone_sender' => $third_response->phone_sender ?? 'N/A',
            'subject' => $filing->subject ?? 'N/A',
            'created_at' => $answer->created_at,
            'typesFilings' => $filing->typesFilings ?? 'N/A',
            'priority' => $filing->priority ?? 'N/A',
            'dependency' => $filing->dependency ?? 'N/A',
            'official' => $filing->official ?? 'N/A',
            'receptionMedia' => $filing->receptionMedia ?? 'N/A',
            'country' => $filing->country ?? 'N/A',
            'department' => $filing->department ?? 'N/A',
            'city' => $filing->city ?? 'N/A',
            'chargeDocFilings' => $filing->chargeDocFilings ?? [],
            'responseTemplates' => $filing->responseTemplates ?? [],
            'related_filing' => $filing ?? 'N/A',
            'route_name' => 'filing.show'
        ];
    }
}
