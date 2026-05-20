<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\RetencionIndiceRepository;
use Illuminate\Validation\Rule;

class RetencionIndiceController extends Controller
{
    public function __construct( private RetencionIndiceRepository $repo ) {}

    public function list(Request $request)
    {
        $data = $this->repo->list($request->retencion_id);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'retencion_id' => 'required|exists:retencion,id',
            'indice_id' => [ 'required', 'exists:indices,id',
                Rule::unique('retencion_indices')
                    ->where(function ($query) use ($request) {
                        return $query->where('retencion_id', $request->retencion_id)
                                    ->whereNull('deleted_at');
                    })
            ],
            'orden' => 'required|integer|min:1',
            'obligatorio' => 'required|boolean',
            'es_nombre' => 'required|boolean',
        ]);

        $this->repo->storeGeneral($data);

        return response()->json([
            'success' => true,
            'message' => 'Índice agregado correctamente'
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'orden' => 'required|integer|min:1',
            'obligatorio' => 'required|boolean',
        ]);

        $item = $this->repo->find($id);
        $item->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Índice actualizado correctamente'
        ]);
    }

    public function destroy($id)
    {
        $item = $this->repo->find($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Índice eliminado'
        ]);
    }
        
}
