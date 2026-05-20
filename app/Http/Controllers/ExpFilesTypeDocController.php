<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\ExpFilesTypeDocRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpFilesTypeDocController extends Controller
{
    public function __construct( private ExpFilesTypeDocRepository $expFilesTypeDocRepository) {}

    public function index(Request $request)
    {
        $records = $this->expFilesTypeDocRepository->list(['typeData' => 'all']);
        return Inertia::render("Configuration/exp-type-doc/index", ['records' => $records] );
    }

    public function list(Request $request)
    {
        $data = $this->expFilesTypeDocRepository->list($request->all());
        return response()->json($data);
    }

    public function store(Request $request)
    {
        try {
            $request->validate(['name_es' => 'required|string|max:255',]);

            $data = $this->expFilesTypeDocRepository->storeGeneral($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tipo documental guardado correctamente',
                'data' => $data
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $request->validate(['name_es' => 'required|string|max:255',]);

            $isUsed = $this->expFilesTypeDocRepository->isUsed($id);

            if ($isUsed) {
                return response()->json([
                    'success' => false,
                    'message' => 'No es posible editar el tipo documental porque ya está siendo utilizado.'
                ], 422);
            }

            $dataRequest = $request->all();
            $dataRequest['id'] = $id;

            $data = $this->expFilesTypeDocRepository->storeGeneral($dataRequest);

            return response()->json([
                'success' => true,
                'message' => 'Tipo documental actualizado correctamente',
                'data' => $data
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {

            $isUsed = $this->expFilesTypeDocRepository
                ->isUsed($id);

            if ($isUsed) {

                return response()->json([
                    'success' => false,
                    'message' => 'No es posible eliminar el tipo documental porque ya está siendo utilizado.'
                ], 422);
            }

            $this->expFilesTypeDocRepository->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Tipo documental eliminado correctamente'
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}