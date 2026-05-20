<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class notificacionMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $subject = "Notificación";
    public $data;


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($asunto,$plantilla,$data)
    {
        $this->asunto       = $asunto;
        $this->plantilla    = $plantilla;
        $this->data         = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view($this->plantilla)->with(['data'=> $this->data]);
    }
}
