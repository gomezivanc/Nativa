<?php

namespace App\Http\Controllers;

use App\Models\ExpFiles;
use App\Models\ExpFilesTypeDoc;
use App\Repositories\DocumentaryLoansExpRepository;
use App\Repositories\ExpFilesRepository;
use App\Repositories\GDDependencyRepository;
use App\Repositories\HistoricLoansExpRepository;
use App\Repositories\TypeDocumentaryLoansRepository;
use App\Repositories\TypeLoanRepository;
use App\Repositories\TypeRequirementsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoansExpFilesController extends Controller
{
    public function __construct(private ExpFilesRepository $expFilesRepository, private TypeDocumentaryLoansRepository $typeDocumentaryLoansRepository,
        private GDDependencyRepository $gDDependencyRepository, private ExpFilesTypeDoc $expFilesTypeDoc, private TypeRequirementsRepository $typeRequirementsRepository, private TypeLoanRepository $typeLoanRepository,
        private DocumentaryLoansExpRepository $documentaryLoansExpRepository, private HistoricLoansExpRepository $historicLoansExpRepository
    )
    {
    }

    function index(Request $request) {
        $states = $this->typeDocumentaryLoansRepository->all();
        $gdDependecy = $this->gDDependencyRepository->all();
        $typesDocuments = $this->expFilesTypeDoc->all();

        $typeRequirements = $this->typeRequirementsRepository->all();
        $typeLoan = $this->typeLoanRepository->all();
        return Inertia::render("documentary_loans/loansExp/Index",compact('states','gdDependecy','typesDocuments','typeRequirements','typeLoan'));
    }

    function storeLoan(Request $request) {
        foreach ($request->ids as $key => $id) {
            $request['exp_file_id'] = $id;
            $request['creado_por_id'] = Auth::user()->id;
            $this->documentaryLoansExpRepository->storeGeneral($request->except('ids'));
        }
        $this->expFilesRepository->storeIdsStates($request->ids,2);
        return response()->json([
            'code' => 200,
           'message' => __('request_loans.request_loans.table.loan_dialog.succes_message'),
        ]);
    }

    function export(Request $request) {
        $type = $request->type;
        $data = $this->expFilesRepository->list($request->all());

        $dataObtained = [];
        foreach ($data as $value) {
            $expFilesArchived = $value->expFilesArchived()->latest()->first();
            $item = [
                'number' => $value->number,
                'name' => $value->name,
                'dependency' => $value->dependency?->name,
                'user' => $value->createBy->persona->nombre. ' '.$value->createBy->persona->apellido,
                'file_area' => $expFilesArchived?->typeArea?->file_area,
                'rack' => $expFilesArchived?->rack,
                'spacer' => $expFilesArchived?->panel,
                'box' => $expFilesArchived?->box,
            ];

            $dataObtained[] = $item;
        }
        return $this->expFilesRepository->export($type,$dataObtained,'Excel.Export.generalExport','request_loans.admin_loans_expfile.table');
    }

    function adminLoans() {
        $states = $this->typeDocumentaryLoansRepository->all();
        $gdDependecy = $this->gDDependencyRepository->all();
        $typesDocuments = $this->expFilesTypeDoc->all();

        $typeRequirements = $this->typeRequirementsRepository->all();
        $typeLoan = $this->typeLoanRepository->all();
        return Inertia::render("documentary_loans/loansExp/AdminLoans",compact('states','gdDependecy','typesDocuments','typeRequirements','typeLoan'));
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
            $expFiles = $this->expFilesRepository->find($id);
            $expFiles->state_loan_id = $request->mode;
            $expFiles->return_at = null;
            if($request->mode == 3) {
                $expFiles->return_at = $request->return_at;
            }
            $expFiles->save();
            $request['exp_file_id'] = $expFiles->id;
            $request['creado_por_id'] = auth()->user()->id;
            $this->historicLoansExpRepository->storeGeneral($request->except('ids','password','mode'));
        }
        return response()->json([
            'code' => 200,
           'message' => __('request_loans.request_loans.table.loan_dialog.succes_message'),
        ]);
    }

    function historicLoans(ExpFiles $expFiles) {
        $historic = $expFiles->historicLoan->load(['stateLoan','created_by.persona','expFileFiles.expFile.dependency']);
        return Inertia::render("documentary_loans/loansExp/LoanTimeline",compact('historic'));
    }

    function exportAdmin(Request $request) {
        $type = $request->type;
        $request['typeData'] = 'todos';
        $data = $this->expFilesRepository->list($request->all());

        $dataObtained = [];
        foreach ($data as $value) {
            $expFilesArchived = $value->expFilesArchiveds()->latest()->first();
            $item = [
                'number' => $value->number,
                'name' => $value->name,
                'dependency' => $value->dependency->name,
                'type_loan' => $value->documentaryLoanLatest?->type_loan['name_'.session('locale','es')],
                'date_loan' => $value->documentaryLoanLatest?->created_at->format('Y-m-d H:i'),
                'requirement' => $value->documentaryLoanLatest?->requirements['name_'.session('locale','es')],
                'file_area' => $expFilesArchived->typeArea->file_area,
                'rack' => $expFilesArchived->rack,
                'spacer' => $expFilesArchived->panel,
                'box' => $expFilesArchived->box,
                'user_request' => $value->documentaryLoanLatest->created_by->persona->nombre. ' '. $value->documentaryLoanLatest->created_by->persona->apellido,
            ];

            $dataObtained[] = $item;
        }
        return $this->expFilesRepository->export($type,$dataObtained,'Excel.Export.generalExport','request_loans.admin_loans_expfile.table');
    }
}
