<?php

namespace App\Repositories;

use App\Models\FilingEmail;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class FilingEmailRepository extends BaseRepository
{
    public function __construct(FilingEmail $modelo, private FilingEmailToRepository $filingEmailToRepository, private UserRepository $userRepository)
    {
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
                if (empty($request['all'])) {
                    $query->whereHas('to',function ($query) {
                        $query->where('to_id',Auth::user()->id);
                    })->orWhere('from_id',Auth::user()->id);
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
            foreach ($data->items() as $key => $email) {
                $userid = Auth::user()->id;
                if($email->from_id == $userid) {
                    $email->entrance_exit = __('filing.email_filing.form.entrance_exit.exit');
                    continue;
                }
                $email->entrance_exit = __('filing.email_filing.form.entrance_exit.exit');
                if($email->to->where('to_id',$userid)) {
                    $email->entrance_exit = __('filing.email_filing.form.entrance_exit.entry');
                }
            }
        } else {
            $data = $data->get();
        }
        return $data;
    }

    function attachSendUsers($email, $files) {
        foreach ($files as $key => $file) {
            $extension = $this->getBase64Extension($file['data']);
            $sanitizedFilename = sanitizeFilename($file['name']);
            // Reconstruir el nombre del archivo con la extensión
            $base64 = substr($file['data'], strpos($file['data'], ',') + 1);

            // Ruta donde se guardará el archivo
            $path = "filing_mail/$email->id/$sanitizedFilename";

            // Decodificar el archivo en Base64 y guardarlo en el almacenamiento
            Storage::disk('local')->put("public/" . $path, base64_decode($base64));

            $email->attachments()->create([
                'path' => $path,
                'file_name' => $file['name']
            ]);
        }
    }

    function storeSendUsers($email, $users) {
        $email->to()->delete();
        foreach ($users as $key => $value) {
            $item['to_id'] = $value;
            $item['filing_email_id'] = $email->id;

            $this->filingEmailToRepository->storeGeneral($item);
        }

        $users = $this->userRepository->getModel()->select('email')->whereIn('id',$users)->get()->map(function ($i) {
            return $i->email;
        });

        Mail::send([], [], function ($message) use ($users, $email) {
            $message->from(Auth::user()->email,Auth::user()->usuario)->to($users->toArray())
                    ->subject($email->subject ? $email->subject : '')
                    ->html($email->body); // Indicar que el contenido es HTML

            foreach ($email->attachments as $key => $file) {
                $path = storage_path('app/public').'/'.$file->path; // Ruta correcta para archivos en `storage/app/`
                $message->attach($path);
            }
        });
    }
}
