<?php

namespace App\Http\Controllers;

use App\Repositories\ExpFilesRepository;
use App\Repositories\FilingRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ReportController extends Controller
{

    function __construct( private FilingRepository $filingRepository, private ExpFilesRepository $expFilesRepository)
    {
    }

    function permissions() {
        return Inertia::render("Reports/Permissions/Index", []);
    }

    public function showLogs(Request $request)
    {
        // Número de registros por página, podemos configurarlo o pasarlo como parámetro
        $perPage = $request->input('perPage', 5);

        // Obtener los logs de forma paginada, con relaciones necesarias
        $logs = Activity::with('causer.persona')
        ->latest()
        ->paginate($perPage);

        return Inertia::render('Reports/Logs/Index', [
            'logs' => $logs,  // Paginación incluida en el objeto
        ]);
    }

    function filingDaysResponse(Request $request) {
        $data = $this->filingRepository->reportdays($request->all());

        return Inertia::render("Reports/FilingDays/Index", ['data' => $data]);
    }

    function FilingByType(Request $request) {
        $data = $this->filingRepository->reporttype($request->all());
        return Inertia::render("Reports/FilingPerType/Index", ['data' => $data]);
    }

    function ExpFileClassReport(Request $request) {
        $data = $this->expFilesRepository->reporttype($request->all());
        return Inertia::render("Reports/ExpFileClass/Index", ['data' => $data]);
    }

    function FilingByPerson(Request $request) {
        $data = $this->filingRepository->reportPerson($request->all());
        return Inertia::render("Reports/FilingPerPerson/Index", ['data' => $data]);
    }

    function exportFilingDaysResponse(Request $request) {
        $data = $this->filingRepository->reportdays($request->all());
        $type = $request->type;
        $columns = range(1, 15);

        $dataObtained = [];
        foreach ($data as $value) {
            $item = [];
            foreach ($columns as $key => $col) {
                $item[__('report.filing_day.table.days').' '. $col] = $value["{$col}_days"];
            }
            $item[__('report.filing_day.table.days_response')] = $value['15_plus_days'];

            $dataObtained[] = $item;
        }

        return $this->filingRepository->export($type, $dataObtained, 'Excel.Export.generalExport', '', 'menu.report.filing');
    }
}
