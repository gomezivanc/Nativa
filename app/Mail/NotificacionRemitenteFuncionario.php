<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionRemitenteFuncionario extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        $email = $this->subject('Código de verificación')
        ->view('Email.notificacionRemitente')
        ->with([
            'data' => $this->data,
            'esFuncionario' => $this->data['esFuncionario']
        ]);    

        return $email;
    }
}
