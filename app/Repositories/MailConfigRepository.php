<?php

namespace App\Repositories;

use App\Models\MailConfig;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MailConfigRepository extends BaseRepository
{
    public function __construct(MailConfig $modelo)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->where(function ($query) use ($request) {
                if (!empty($request['email'])) {
                    $query->orWhere('email', 'like', '%' . $request['email'] . '%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
            });

        if (!empty($request['per_page'])) {
            return $data->paginate($request['per_page']);
        }
        if (!empty($request['page'])) {
            return $data->paginate(15, ['*'], 'page', $request['page']);
        }
        return $data->paginate(15);
    }


    public function findByEmail(string $email): ?MailConfig
    {
        return $this->model->where('email', $email)
            ->where('status', 'active') // Opcional: solo si está activa
            ->first();
    }

    /**
     * Actualiza los tokens y la fecha de expiración del watch
     */
    public function updateTokens(int $id, array $tokens): bool
    {
        $config = $this->find($id);
        if ($config) {
            return $config->update([
                'access_token' => $tokens['access_token'] ?? $config->access_token,
                'refresh_token' => $tokens['refresh_token'] ?? $config->refresh_token,
                'watch_expiration' => $tokens['watch_expiration'] ?? $config->watch_expiration,
                'status' => 'active',
            ]);
        }
        return false;
    }
}


