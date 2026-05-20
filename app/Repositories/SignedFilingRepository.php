<?php

    namespace App\Repositories;

    use App\Models\SignedFiling;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

    class SignedFilingRepository extends BaseRepository
    {
        public function __construct(SignedFiling $modelo)
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
        public function singFiling($data) {
            
            $user = User::find($data->signatures[0]['userId']);
            if (!$user || !Hash::check($data->password, $user->password)) {
                return ([
                    'error' => true,
                    'message' => 'password'
                ]);
            };
            // dd('pasa');
            $signedDocuments = [];
            $alreadySigned = [];
        
            foreach ($data->signatures as $signature) {
                $hash = hash('sha256', $signature['userId'] . $signature['idRadicate'] . $signature['date']);
        
                // Verificar si ya existe una firma para este filing y usuario
                $existingSignature = SignedFiling::where('user_id', $signature['userId'])
                    ->where('filing_id', $signature['idRadicate'])
                    ->exists();
        
                if ($existingSignature) {
                    $alreadySigned[] = $signature['number_filing']; // Guardar radicados ya firmados
                    continue;
                }
        
                // Si no existe, guardar la firma
                SignedFiling::create([
                    'user_id' => $signature['userId'],
                    'filing_id' => $signature['idRadicate'],
                    'hash' => $hash,
                    'type_sing' => $data->selectedFirma
                ]);
        
                $signedDocuments[] = $signature['number_filing']; // Guardar radicados recién firmados
            }
        
            return [
                'signedDocuments' => $signedDocuments,
                'alreadySigned' => $alreadySigned
            ];
        }
    }