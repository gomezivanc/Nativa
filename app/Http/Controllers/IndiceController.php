<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\IndiceRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndiceController extends Controller
{
    public function __construct(private IndiceRepository $indiceRepository) {}

    public function index(Request $request)
    {
        return Inertia::render("Configuration/indices/Index");
    }

    public function create()
    {
        return Inertia::render("Configuration/indices/Create", [
            'indice' => null
        ]);
    }

    public function edit($id)
    {
        $indice = $this->indiceRepository->find($id);

        return Inertia::render("Configuration/indices/Create", [
            'indice' => $indice
        ]);
    }
    
    public function storeUpdate(Request $request)
    {
        $data = $request->validate([
            'codigo' => 'required|string|max:50',
            'nombre' => 'required|string|max:255',
            'tipo_dato' => 'required|in:texto,numero,fecha,booleano,lista'
        ]);

        $opciones = collect($request->opciones)
            ->filter(fn($op) => !empty(trim($op)))
            ->values()
            ->toArray();

        $data['opciones'] = $request->tipo_dato === 'lista' ? $opciones : null;

        if ($request->id) {
            $indice = $this->indiceRepository->find($request->id);
            $indice->update($data);
        } else {
            $indice = $this->indiceRepository->storeGeneral($data);
        }

        return Inertia::render("Configuration/indices/Index");
    }

    public function list(Request $request)
    {
        $data = $this->indiceRepository->list($request->all());
        return response()->json($data);
    }

    public function show(string $id)
    {
        $object = $this->indiceRepository->find($id);

        return response()->json($object);
    }

    public function destroy(string $id)
    {
        $indice = $this->indiceRepository->find($id);
        $indice->estado = $indice->estado ? 0 : 1;
        $indice->save();

        return Inertia::render("Configuration/indices/Index");
    }

    public function indicesByRetencion(Request $request)
    {
        $request->validate([
            'serie_id' => 'required|exists:serie,id',
            'subserie_id' => 'nullable|exists:subserie,id'
        ]);

        try {
            $indices = $this->indiceRepository->getByRetencion($request->serie_id, $request->subserie_id);
            return response()->json($indices);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error obteniendo índices',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
}
