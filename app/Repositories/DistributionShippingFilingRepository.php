<?php

namespace App\Repositories;

use App\Mail\NotificationSent;
use App\Models\DistributionShippingFiling;
use App\Models\Filing;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class DistributionShippingFilingRepository extends BaseRepository
{
    public function __construct(
        DistributionShippingFiling $modelo,
        private FilingRepository $filingRepository,
        private ConfProviderSendRepository $confProviderSendRepository,
        private ResponseTemplateRepository $responseTemplateRepository

    ) {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name', 'like', '%' . $request['name'] . '%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
            });

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }
    function saveDataMail($data, $document)
    {

        try {
            $data['distribution_shipping_status'] = 1;
            $rowGuarded = $this->storeGeneral(Arr::except($data, ['filing']));


            $sanitizedFilename = sanitizeFilename($document[0]['name']);


            $path = "distribution_shipping_filings/$rowGuarded->id/" . $sanitizedFilename;

            Storage::disk('local')->put("public/" . $path, base64_decode($document[0]['data']));

            $row = $this->find($rowGuarded->id);
            $row->supporting_document = $path;
            $row->save();

            $filing = $this->responseTemplateRepository->find($data['filing']);
            $filing->state = '6';
            $filing->save();

            return [
                'path' => $path               
            ];


        } catch (\Throwable $th) {
            dd($th);
        }
    }
    function sendMailResponsible($data, $pathDocument)
    {
        try {
            $filing = $this->filingRepository->find($data['filing']['id']);
            $provider = $this->confProviderSendRepository->find($data['conf_provider_send_id']);
            $data['regional'] = $provider->regional->name;
            $data['provider'] = $provider->name;
            $rutaArchivo = storage_path('app/public') . '/' . $pathDocument; // Ruta correcta para archivos en `storage/app/`       
            //dd($filing->official->email);    
            Mail::to($filing->official->email)->send(new NotificationSent($data, $rutaArchivo)); 
            $filing->distribution_shipping_status = 1;//Estado para los pediente por entregar
            $filing->save();
            return $filing->official->email;
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}