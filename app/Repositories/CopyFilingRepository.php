<?php

namespace App\Repositories;

use App\Models\CopyFiling;

class CopyFilingRepository extends BaseRepository
{
    public function __construct(CopyFiling $model)
    {
        parent::__construct($model);
    }

    /**
     * Obtener todas las copias de un radicado
     */
    public function getByFilingId($filingId, $with = [])
    {
        return $this->model
            ->where('id_filing', $filingId)
            ->with($with)
            ->get();
    }

    /**
     * Verificar si un radicado tiene copias
     */
    public function hasCopies($filingId)
    {
        return $this->model
            ->where('id_filing', $filingId)
            ->exists();
    }

    public function deleteCopies($filingId)
    {
        return $this->model
            ->where('id_filing', $filingId)
            ->delete();
    }

    public function updateUnitByFiling($filingId, $unitId)
    {
        return $this->model
            ->where('id_filing', $filingId)
            ->update(['id_unitidis' => $unitId]);
    }

    public function updateUnitByCopyId($copyId, $unitId)
    {
        return $this->model
            ->where('id', $copyId)
            ->update(['id_unitidis' => $unitId]);
    }

    public function updateUnitByofficial($copyId, $officialId)
    {
        return $this->model
            ->where('id', $copyId)
            ->update(['id_official' => $officialId]);
    }

    public function finishCopy($copyId, $observation = null)
    {
        return $this->model
            ->where('id', $copyId)
            ->update([
                'estado' => 2,
                'observation' => $observation,
            ]);
    }

    /**
     * Contar copias de un radicado
     */
    public function countByFilingId($filingId)
    {
        return $this->model
            ->where('id_filing', $filingId)
            ->count();
    }
}
