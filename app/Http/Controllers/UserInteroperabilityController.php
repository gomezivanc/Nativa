<?php

namespace App\Http\Controllers;

use App\Repositories\UserInteroperabilityRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserInteroperabilityController extends Controller
{
    public function __construct(private UserInteroperabilityRepository $userInteroperabilityRepository) {}

    function index(Request $request)
    {
        return Inertia::render("Configuration/userInteroperability/Index", []);
    }

    function create(Request $request)
    {
        return Inertia::render("Configuration/userInteroperability/Create", []);
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->userInteroperabilityRepository->storeGeneral($request->all());
        $data->token = JWTAuth::fromUser($data);
        $data->save();
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->userInteroperabilityRepository->list($request->all(), ['dependency','typeDocument']);

        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/userInteroperability/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->userInteroperabilityRepository->find($id,['dependency','typeDocument']);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->userInteroperabilityRepository->find($id);
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
        $data = $this->userInteroperabilityRepository->list(array_merge($filters, ['typeData' => 'todos']));
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

        return $this->userInteroperabilityRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', 'configuration.user_interoperability.form');
    }
}
