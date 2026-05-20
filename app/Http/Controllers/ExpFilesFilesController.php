<?php

namespace App\Http\Controllers;

use App\Models\ExpFilesFiles;
use App\Models\ExpFilesTypeDoc;
use App\Repositories\DocumentaryLoansRepository;
use App\Repositories\ExpFilesFilesRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\HistoricLoanRepository;
use App\Repositories\TypeDocumentaryLoansRepository;
use App\Repositories\TypeLoanRepository;
use App\Repositories\TypeRequirementsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpFilesFilesController extends Controller
{
    public function __construct(private ExpFilesFilesRepository $expFilesFilesRepository, private TypeDocumentaryLoansRepository $typeDocumentaryLoansRepository,
        private GDDependencyRepository $gDDependencyRepository, private ExpFilesTypeDoc $expFilesTypeDoc, private TypeRequirementsRepository $typeRequirementsRepository, private TypeLoanRepository $typeLoanRepository,
        private DocumentaryLoansRepository $documentaryLoansRepository, private HistoricLoanRepository $historicLoanRepository
    )
    {
    }

    function index(Request $request) {
        $states = $this->typeDocumentaryLoansRepository->all();
        $gdDependecy = $this->gDDependencyRepository->all();
        $typesDocuments = $this->expFilesTypeDoc->all();
        $typeRequirements = $this->typeRequirementsRepository->all();
        $typeLoan = $this->typeLoanRepository->all();
        return Inertia::render("documentary_loans/requestLoans/Index",compact('states','gdDependecy','typesDocuments','typeRequirements','typeLoan'));
    }

    function create(Request $request) {
        $states = $this->typeDocumentaryLoansRepository->all();
        $gdDependecy = $this->gDDependencyRepository->all();
        $typesDocuments = $this->expFilesTypeDoc->all();
        return Inertia::render("documentary_loans/requestLoans/Create",compact('states','gdDependecy','typesDocuments'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->expFilesFilesRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $request['onlyArchiveds'] = true;
        $data = $this->expFilesFilesRepository->list($request->all(),['expFile','expFilesArchived' => function ($q) {
            $q->latest()->first();
        },'expFilesArchived.typeArea','stateLoan']);
        return response()->json($data);
    }

    function listAdminLoan(Request $request) {
        $request['onlyArchiveds'] = true;

        $data = $this->expFilesFilesRepository->list($request->all(),['expFile.dependency','created_by.persona','expFilesArchived' => function ($q) {
            $q->latest()->first();
        },'expFilesArchived.typeArea','stateLoan','documentaryLoan' => function ($q) {
            $q->latest();
        },'documentaryLoan.typeLoan','documentaryLoan.requirement']);
        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("documentary_loans/requestLoans/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->expFilesFilesRepository->find($id);
        return response()->json($object);
    }

    function storeLoan(Request $request) {
        foreach ($request->ids as $key => $id) {
            $request['exp_files_file_id'] = $id;
            $expFile = $this->documentaryLoansRepository->storeGeneral($request->except('ids'));

            // 📝 Registrar log con formato similar a los de los modelos
            activity()
            ->event('created') // Tipo de evento similar a los modelos
            ->useLog('solicitud de préstamo documental')
            ->causedBy(auth()->user()) // Usuario que hace la solicitud
            ->performedOn($expFile) // Relacionar con el modelo del archivo
            ->withProperties([
                'attributes' => [
                    'exp_files_file_id' => $id,
                    'state_loan_id' => 2, // Estado del préstamo
                    'creado_por_id' => auth()->user()->id,
                    'fecha' => now()->toDateTimeString(),
                ]
            ])
            ->log("Se creó una solicitud de préstamo para el archivo ID: {$id}");
        }
        $this->expFilesFilesRepository->storeIdsStates($request->ids,2);

        return response()->json([
            'code' => 200,
           'message' => __('request_loans.request_loans.table.loan_dialog.succes_message'),
        ]);
    }

    function destroy(String $id) {
        $object = $this->expFilesFilesRepository->find($id);
        if($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesFilesRepository->list(array_merge($filters, ['typeData' => 'todos']), hidden: ['created_at','updated_at','deleted_at','creado_por_id','id']);

        $dataObtained = [];
        foreach ($data as $value) {
            $expFilesArchived = $value->expFile->expFilesArchived()->latest()->first();
            $item = [
                'num_radicate' => '',
                'date' => $value->created_at->format('Y-m-d H:i'),
                'subject' => '',
                'type_documental' => $value->type_documental['name_'.session('locale','es')],
                'exp_file' => $value->expFile->name,
                'file_area' => $expFilesArchived->typeArea?->file_area,
                'module' => $expFilesArchived->module,
                'spacer' => $expFilesArchived->panel,
                'box' => $expFilesArchived->box,
            ];

            $dataObtained[] = $item;
        }
        return $this->expFilesFilesRepository->export($type,$dataObtained,'Excel.Export.generalExport','request_loans.request_loans.table');
    }
    function exportAdmin(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesFilesRepository->list(array_merge($filters, ['typeData' => 'todos']), hidden: ['created_at','updated_at','deleted_at','creado_por_id','id']);

        $dataObtained = [];
        foreach ($data as $value) {
            $expFilesArchived = $value->expFile->expFilesArchived()->latest()->first();
            $item = [
                'num_radicate' => '',
                'type_documental' => $value->type_documental['name_'.session('locale','es')],
                'type_loan' => $value->type_documental['name_'.session('locale','es')],
                'requirement' => $value->documentaryLoan->typeLoan['name_'.session('locale','es')],
                'reques_date' => $value->documentaryLoan->created_at->format('Y-m-d'),
                'exp_file' => $value->expFile->name,
                'file_area' => $expFilesArchived->typeArea?->file_area,
                'module' => $expFilesArchived->module,
                'spacer' => $expFilesArchived->panel,
                'box' => $expFilesArchived->box,
                'user' => "{$value->created_by?->persona->nombre} {$value->created_by?->persona->apellido}",
                'dependency' => $value->expFile->dependency->name,
            ];

            $dataObtained[] = $item;
        }
        return $this->expFilesFilesRepository->export($type,$dataObtained,'Excel.Export.generalExport','request_loans.admin_loans.table');
    }

    function adminLoans() {
        $states = $this->typeDocumentaryLoansRepository->all();
        $gdDependecy = $this->gDDependencyRepository->all();
        $typesDocuments = $this->expFilesTypeDoc->all();

        $typeRequirements = $this->typeRequirementsRepository->all();
        $typeLoan = $this->typeLoanRepository->all();
        return Inertia::render("documentary_loans/requestLoans/AdminLoans",compact('states','gdDependecy','typesDocuments','typeRequirements','typeLoan'));
    }

    function storeLoanState(Request $request) {
        $request['state_loan_id'] = $request->mode;

        if($request->mode !== 4) {

            $password = $request->password;
            $user = Auth::user();
            if(!Auth::attempt(['usuario' => $user->usuario, 'password' => $password])) {
                return response()->json([
                    'message' => __('documental_gestion.exp_files.dialogs.close_form.message_error_login')
                ],422);
            }
        }
        foreach ($request->ids as $key => $id) {
            $request['exp_files_file_id'] = $id;
            $expFilesFiles = $this->expFilesFilesRepository->find($id);
            $expFilesFiles->state_loan_id = $request->mode;
            $expFilesFiles->return_at = null;
            if($request->mode == 3) {
                $expFilesFiles->return_at = $request->return_at;
            }
            $expFilesFiles->save();
            $request['exp_files_file_id'] = $expFilesFiles->id;
            $request['creado_por_id'] = auth()->user()->id;
            $expFile = $this->historicLoanRepository->storeGeneral($request->except('ids','password','mode'));

            // 📝 Registrar log con formato similar a los de los modelos
            activity()
            ->event('created') // Tipo de evento similar a los modelos
            ->useLog('Cambio de estado en gestion documental')
            ->causedBy(auth()->user()) // Usuario que hace la solicitud
            ->performedOn($expFile) // Relacionar con el modelo del archivo
            ->withProperties([
                'attributes' => [
                    'exp_files_file_id' => $id,
                    'state_loan_id' => 2, // Estado del préstamo
                    'creado_por_id' => auth()->user()->id,
                    'fecha' => now()->toDateTimeString(),
                ]
            ])
            ->log("Se creó una solicitud de préstamo para el archivo ID: {$id}");
        }

        return response()->json([
            'code' => 200,
           'message' => __('request_loans.request_loans.table.loan_dialog.succes_message'),
        ]);
    }

    function historicLoans(ExpFilesFiles $expFilesFiles) {
        $historic = $expFilesFiles->historicLoan->load(['stateLoan','created_by.persona','expFileFiles.expFile.dependency']);
        return Inertia::render("documentary_loans/requestLoans/LoanTimeline",compact('historic'));
    }
}
