<?php

namespace App\Http\Controllers;

use App\Repositories\PayrollManagementRepository;
use App\Repositories\DependencyTemplateRepository;
use App\Repositories\GDDependencyRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PayrollManagementController extends Controller
{
    public function __construct(
        private PayrollManagementRepository $payrollManagementRepository,
        private GDDependencyRepository $gddependencyRepository,   
        private DependencyTemplateRepository $dependencyTemplateRepository,   
    ) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/payroll_management/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/payroll_management/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->payrollManagementRepository->storeGeneral($request->except('file'));
        if(!empty($request['file']) && !empty($request['filename'])) {
            $file = $request->only(['file','filename']);
            $path = "payroll_managment/" . $data->id . "/" . $file['filename'];
            $fileData = substr($file['file'], strpos($file['file'], ',') + 1);

            Storage::disk('local')->put("public/" . $path, base64_decode($fileData));

            $data->file = $path;

            $data->save();
        }
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->payrollManagementRepository->list($request->all(), []);
        return response()->json($data);
    }

    function listVie(Request $request)
    {
        $data = $this->gddependencyRepository->list($request->all(),['regional','gdDependency','gdDependency']);
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/payroll_management/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->payrollManagementRepository->find($id);
        return response()->json($object);
    }

    function showMor(String $id)
    {  
        $dependency = $this->gddependencyRepository->find($id,['regional','gdDependency','gdDependency']);
        $data = $this->dependencyTemplateRepository->findByDependency($id);

        if (request()->wantsJson()) {
            return response()->json(['data' => $data]);
        }

        return Inertia::render("Configuration/payroll_management/Show",compact('data', 'dependency'));
    }

    function destroy(String $id)
    {
        $object = $this->payrollManagementRepository->find($id);
        if ($object->trashed()) {
            $object->restore();
        } else {
            $object->delete();
        }
        return response()->json($object);
    }

    function templates()
    {
        $data = $this->payrollManagementRepository->all();
        return response()->json($data);
    }

    function assign(Request $request)
    {
        $data = $request->only('id_dependency','id_template','observation','code','version','name');

        $dependencyTemplate = !empty($request['id'])
            ? $this->dependencyTemplateRepository->find($request['id'])->update($data)
            : $this->dependencyTemplateRepository->storeGeneral($data);

        return response()->json($dependencyTemplate);
    }

    function deleteAssign(String $id)
    {
        $object = $this->dependencyTemplateRepository->find($id);
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
        $filters = $request->except('type');
        $data = $this->payrollManagementRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden([
                'created_at',
                'updated_at',
                'deleted_at',
                'creado_por_id',
                'departament',
                'city',
                'id',
                'gdDependency'
            ]);
        }

        return $this->payrollManagementRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.hours_work.form');
    }
}
