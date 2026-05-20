<?php

namespace App\Http\Controllers;

use App\Repositories\HoursWorkRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HoursWorkController extends Controller
{
    public function __construct(private HoursWorkRepository $hoursWorkRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/hours_work/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/hours_work/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->hoursWorkRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->hoursWorkRepository->list($request->all(), []);

        return response()->json($data);
    }

    function edit(String $id)
    {

        return Inertia::render("Configuration/hours_work/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->hoursWorkRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->hoursWorkRepository->find($id);
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
        $data = $this->hoursWorkRepository->list(array_merge($filters, ['typeData' => 'todos']));
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
        $days = collect([
            [ "label" => __('auth.day_of_weeks.monday') , "value" => "1" ],
            [ "label" => __('auth.day_of_weeks.tuesday') , "value" => "2" ],
            [ "label" => __('auth.day_of_weeks.wednesday') , "value" => "3" ],
            [ "label" => __('auth.day_of_weeks.thursday') , "value" => "4" ],
            [ "label" => __('auth.day_of_weeks.friday') , "value" => "5" ],
            [ "label" => __('auth.day_of_weeks.saturday') , "value" => "6" ],
            [ "label" => __('auth.day_of_weeks.sunday') , "value" => "7" ],
        ]);

        foreach ($data as $value) {
            $value->day_of_week_init = $days->firstWhere('value',$value->day_of_week_init)['label'] ?? '';
            $value->day_of_week_end = $days->firstWhere('value',$value->day_of_week_end)['label'] ?? '';
        }
        return $this->hoursWorkRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.hours_work.form');
    }
}
