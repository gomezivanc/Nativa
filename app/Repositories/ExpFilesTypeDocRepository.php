<?php

namespace App\Repositories;

use App\Models\ExpFilesTypeDoc;
use App\Models\Filing;
use App\Models\ExpFilesFiles;
use App\Models\ChargeDocFiling;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ExpFilesTypeDocRepository extends BaseRepository{

    public function __construct(ExpFilesTypeDoc $modelo){
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator{
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['searchQuery'])) {
                    $query->orWhere('nombre', 'like', '%'. $request['searchQuery']. '%');
                }
            });
        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage']?? 10);
        } else {
            $data = $data->get();
        }
        return $data;
    }

    public function isUsed($id): bool
    {
        $usedInFilings = Filing::where('document_type_id',$id)->exists();

        $usedInExpFiles = ExpFilesFiles::where('type_doc_id',$id)->exists();

        $usedInChargeDoc = ChargeDocFiling::where('type_doc_id', $id)->exists();

        $usedInRetention = DB::table('retencion_tipo_documental')
            ->where('tipo_documental_id', $id)
            ->exists();

        return ($usedInFilings || $usedInExpFiles || $usedInChargeDoc || $usedInRetention);
    }
}