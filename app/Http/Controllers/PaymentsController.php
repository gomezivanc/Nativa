<?php

namespace App\Http\Controllers;

use App\Exports\PaymentExport;
use App\Repositories\PaymentsRepository;
use App\Repositories\ProcessRepository;
use App\Repositories\SecretaryRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PaymentsController extends Controller
{
    private $paymentsRepository;
    private $secretaryRepository;
    private $processRepository;

    public function __construct(PaymentsRepository $paymentsRepository, SecretaryRepository $secretaryRepository, ProcessRepository $processRepository)
    {
        $this->paymentsRepository = $paymentsRepository;
        $this->secretaryRepository = $secretaryRepository;
        $this->processRepository = $processRepository;
    }

    function index(Request $request) {
        return Inertia::render("PaymentsSentences/Payments/Index");
    }

    function create(Request $request) {
        $secretaries = $this->secretaryRepository->list(['typeData' => 'todos']);
        $process = $this->processRepository->list(['typeData' => 'todos']);
        return Inertia::render("PaymentsSentences/Payments/Create",compact('secretaries','process'));
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }   
        $files = $request['files'];
        unset($request['files']);

        $filesDelete = $request['filesDelete'];
        unset($request['filesDelete']);

        $data = $this->paymentsRepository->storeGeneral($request->all());

        foreach ($files as $key => $file) {
            $path = "payments/payment_" . $data->id . "/" . $file['name'];
    
            $fileData = substr($file['data'], strpos($file['data'], ',') + 1);
    
            Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

            $data->files()->create([
                'nombre' => $file['name'],
                'ruta' => '/storage/'.$path,
            ]);
        }
        if(!empty($request['id'])) {
            foreach ($filesDelete as $key => $file) {
                $data->files()->find($file)->delete();
            }
        }
    
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->paymentsRepository->list($request->all(),with: ['secretary:id,nombre','process:id,nro_radicado']);

        return response()->json($data);
    }

    function edit(String $id) {
        $secretaries = $this->secretaryRepository->list(['typeData' => 'todos']);
        $process = $this->processRepository->list(['typeData' => 'todos']);
        return Inertia::render("PaymentsSentences/Payments/Create",compact('id','secretaries','process'));
    }

    function show(String $id) {
        $object = $this->paymentsRepository->find($id);
        $object->files = $object->files;
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->paymentsRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function excel(Request $request) {
        $request['typeData'] = 'todos';
        $data = $this->list($request);
        // return $data;
        $dataExcel = [
            'data' => $data->original
        ];
        // dd($data);
        $title = "Informe recibos de pago".Carbon::now()->toString().".xlsx";
        return Excel::download(new PaymentExport($dataExcel),$title);
    }
}
