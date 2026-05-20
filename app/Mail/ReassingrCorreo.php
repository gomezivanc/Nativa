<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReassingrCorreo extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $copyto;

    public function __construct($data,$copyto)
    {
        $this->data = $data;    
        $this->copyto = $copyto;    
    }

    public function build()
    {
        $email = $this->subject('Reasinacion de radicadion')
        ->view('Email.reasignacionCorreo')
        ->with(['data' => $this->data])
        ->cc($this->copyto);

        return $email;
    }
}