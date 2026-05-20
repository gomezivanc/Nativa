<?php

namespace App\Repositories;

use App\Models\ResponseEmail;

class ResponseEmailRepository extends BaseRepository
{
    public function __construct(ResponseEmail $model)
    {
        parent::__construct($model);
    }

    /**
     * Registra un nuevo email de respuesta
     */
    public function recordEmail($responseTemplateId, $email, $status = 'success', $errorMessage = null)
    {
        return $this->model->create([
            'response_template_id' => $responseTemplateId,
            'email' => $email,
            'status' => $status,
            'error_message' => $errorMessage,
            'sent_at' => $status === 'success' ? now() : null,
        ]);
    }

    /**
     * Obtiene todos los emails de una respuesta
     */
    public function getByResponseTemplate($responseTemplateId)
    {
        return $this->model
            ->where('response_template_id', $responseTemplateId)
            ->get();
    }

    /**
     * Marca un email como rebotado
     */
    public function markBounced($responseEmailId, $errorMessage = null)
    {
        return $this->model
            ->find($responseEmailId)
            ->update([
                'status' => 'bounced',
                'bounced_at' => now(),
                'error_message' => $errorMessage,
            ]);
    }

    /**
     * Obtiene solo los emails exitosos de una respuesta
     */
    public function getSuccessfulByResponseTemplate($responseTemplateId)
    {
        return $this->model
            ->where('response_template_id', $responseTemplateId)
            ->where('status', 'success')
            ->get();
    }

    /**
     * Obtiene solo los emails que rebotaron
     */
    public function getBouncedByResponseTemplate($responseTemplateId)
    {
        return $this->model
            ->where('response_template_id', $responseTemplateId)
            ->where('status', 'bounced')
            ->get();
    }
}
