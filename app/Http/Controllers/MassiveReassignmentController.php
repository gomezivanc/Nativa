<?php

namespace App\Http\Controllers;

use App\Mail\CopiarACorreo;
use App\Models\AssociatedFiling;
use App\Models\ExpFilesTypeDoc;
use App\Models\Filing;
use App\Models\FilingSetting;
use App\Models\FilingWorkflow;
use App\Models\GDDependency;
use App\Models\TypesFilings;
use App\Repositories\AssociatedFilingRepository;
use App\Repositories\CancellationRequestFilingRepository;
use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\FilingExpFileRepository;
use App\Repositories\FilingRepository;
use App\Repositories\FilingSettingRepository;
use App\Repositories\FilingWorkflowRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\ReceptionMediumRepository;
use App\Repositories\SignedFilingRepository;
use App\Repositories\TypePersonRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Intervention\Image\Facades\Image;

class MassiveReassignmentController extends Controller
{
    public function __construct(
        private FilingRepository $filingRepository,
        private ExpFilesClasificationsRepository $expFilesClasificationsRepository,
        private ExpFilesTypeDocRepository $expFilesTypeDocRepository,
        private ReceptionMediumRepository $receptionMediumRepository,
        private PriorityRepository $priorityRepository,
        private TypePersonRepository $typePersonRepository,
        private FilingWorkflowRepository $filingWorkflowRepository,
        private SignedFilingRepository $signedFilingRepository,
        private AssociatedFilingRepository $associatedFilingRepository,
        private FilingExpFileRepository $filingExpFileRepository,
        private CancellationRequestFilingRepository $cancellationRequestFilingRepository
    ) {
    }

    function index(Request $request)
    {
        return Inertia::render("correspondenceManagement/massiveReassignment/Index", []);
    }

    function list(Request $request)
    {
        $data = $this->filingRepository->list($request->all(), ['typesFilings', 'documentalType', 'clasification', 'priority', 'peopleType', 'country', 'department', 'city', 'receptionMedia', 'dependency', 'city', 'official.persona', 'chargeDocFilings']);

        return response()->json($data);
    }


    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->filingRepository->list(array_merge($filters, ['typeData' => 'todos']), with: ['documentalType']);
        $dataObtained = [];
        foreach ($data as $value) {
            $item = [
                'types_filing' => $value->typesFilings->name,
                'number_filing' => $value->filing_number,
                'creation_date' => $value->created_at,
                'client' => $value->name_social_reason_sender . " " . $value->first_surname_legal_representative_senderss,
                'subject' => $value->subject,
                'documental_type' => $value->documentalType['name_' . session('locale', 'es')],
                'due_date' => $value->expiration_date,
                'priority' => $value->priority['name_' . session('locale', 'es')],
                'document' => $value->document,
                'permission_file' => $value->clasification['name_' . session('locale', 'es')],
            ];

            $dataObtained[] = $item;
        }
        return $this->filingRepository->export($type, $dataObtained, 'Excel.Export.generalExport', 'filing.standard_filing.table', 'filing.standard_filing.title');
    }

    public function reassingMassive(Request $request)
    {
       // dd($request);
        try {
            $destinataries = $this->filingRepository->reassingFilingMassive($request);
            //dd($destinataries);
            return response()->json([
                'success' => true,
                'mails' => $destinataries,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al enviar el correo: ' . $th->getMessage(),
            ], 500);
        }
    }
}
