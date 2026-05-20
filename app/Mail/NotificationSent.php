<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationSent extends Mailable
{
    use Queueable, SerializesModels;

    public $data; // Datos que se pasan a la vista
    public $rutaArchivo; // Datos que se pasan a la vista

    /**
     * Create a new message instance.
     *
     * @param array $data
     */
    public function __construct($data,$rutaArchivo)
    {
        $this->data = $data;
        $this->rutaArchivo = $rutaArchivo;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Envio de correspondecía') // Asunto del correo
                    ->view('Email.notificationSent') // Vista del correo
                    ->with(['data' => $this->data])
                    ->attach($this->rutaArchivo); // Pasar datos a la vista
    }
}
