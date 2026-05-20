<?php

namespace App\Http\Controllers;

use App\Repositories\HoursWorkNotRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class HoursNotWorkController extends Controller
{
    public function __construct(private HoursWorkNotRepository $hoursWorkNotRepository) {}

    public function index(Request $request)
    {
        return Inertia::render("Configuration/hours_not_work/Index");
    }

    public function create(Request $request)
    {
        return Inertia::render("Configuration/hours_not_work/Create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|integer',
            'date' => 'required|date',
            'reason' => 'required|string|max:100',
            'is_recurring' => 'required|boolean',
        ]);

        $validated['day_of_week'] = Carbon::parse($validated['date'])->locale('es')->dayName;

        if (empty($request->id)) {
            $validated['creado_por_id'] = Auth::id();
        }

        $data = $this->hoursWorkNotRepository->storeGeneral($validated);

        return response()->json([
            'success' => true,
            'message' => 'Día no laboral guardado exitosamente.',
            'data' => $data,
        ]);
    }

    public function list(Request $request)
    {
        $data = $this->hoursWorkNotRepository->list($request->all());

        return response()->json($data);
    }

    public function edit(string $id)
    {
        return Inertia::render("Configuration/hours_not_work/Create", compact('id'));
    }

    public function show(string $id)
    {
        $object = $this->hoursWorkNotRepository->find($id);

        return response()->json($object);
    }

    public function destroy(string $id)
    {
        $object = $this->hoursWorkNotRepository->find($id);

        $object->trashed() ? $object->restore() : $object->delete();

        return response()->json([
            'success' => true,
            'message' => $object->trashed() ? 'Día no laboral restaurado.' : 'Día no laboral eliminado.',
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->hoursWorkNotRepository->list(array_merge($filters, ['typeData' => 'todos']));
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

        foreach ($data as $item) {
            $item->day_of_week = ucfirst(__("auth.day_of_weeks." . strtolower($item->day_of_week)));
        }

        return $this->hoursWorkNotRepository->export(
            $type,
            $data->toArray(),
            'Excel.Export.generalExport',
            'configuration.hours_work.form'
        );
    }
}
