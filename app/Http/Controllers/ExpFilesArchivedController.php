<?php

namespace App\Http\Controllers;

use App\Repositories\ExpFilesArchivedRepository;
use App\Repositories\ExpFilesRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpFilesArchivedController extends Controller
{
    public function __construct(private ExpFilesArchivedRepository $expFilesArchivedRepository, private ExpFilesRepository $expFilesRepository){}

    function index(Request $request) {
        return Inertia::render("Configuration/expFilesArchived/Index",[
        ]);
    }

    function create(Request $request) {
        return Inertia::render("Configuration/expFilesArchived/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        foreach ($request->exp_files_ids as $key => $id) {
            $request['exp_file_id'] = $id;
            $expFile = $this->expFilesRepository->find($id);
            $expFile->state_loan_id = 1;
            $expFile->save();
            $data = $this->expFilesArchivedRepository->storeGeneral($request->except('exp_files_ids'));
        }
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->expFilesArchivedRepository->list($request->all(),[]);

        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Configuration/expFilesArchived/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->expFilesArchivedRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->expFilesArchivedRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->expFilesArchivedRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->expFilesArchivedRepository->export($type,$data->toArray(),'Excel.Export.generalExport','');
    }

    function exportSheets(Request $request) {
        $pdfName = 'rotulo de caja'.'.pdf';

        $expFiles = $this->expFilesRepository->getModel()->wherein('id',$request->ids)->whereHas('expFilesArchived')->get();
        // Generamos el PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('PDF.BoxRotule', ['expFiles' => $expFiles]);
        $pdf->setPaper('A4', 'landscape');
        return response($pdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="export.xlsx"')->header('X-File-Name', $pdfName);
    }
    function FolderRotule(Request $request) {
        $pdfName = 'rotulo de carpeta'.'.pdf';

        $expFile = $this->expFilesRepository->find($request->id);
        // Generamos el PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('PDF.FolderRotule', ['expFile' => $expFile]);
        $pdf->setPaper('A4', 'landscape');
        return response($pdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="export.xlsx"')->header('X-File-Name', $pdfName);
    }

    function detail(String $id, Request $request)  {
        $expFiles = $this->expFilesRepository->find($id,['clasification','dependency','dependencies',
        'responsible:id,id_persona','responsible.persona:id,nombre,apellido','expFilesArchived.ubication','expFilesArchived.typeBody','expFilesArchived.user.persona']);
        return Inertia::render("document_gestion/ExpFiles/DetailArchive",compact('expFiles'));
    }
}
