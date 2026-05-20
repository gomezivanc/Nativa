<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CopiarACorreo extends Mailable
{
    use Queueable, SerializesModels;

    public $data, $docs;

    public function __construct($data, $docs)
    {
        $this->data = $data;
        $this->docs = $docs;
    }

    public function build()
    {
        $email = $this->subject('Número de radicado')
            ->view('Email.copiaACorreo')
            ->with(['data' => $this->data]);

        foreach ($this->docs as $doc) {

            // Documentos de respuesta (response_templates)
            if (!empty($doc['template_url'])) {

                $rutaArchivo = storage_path('app/public/' . $doc['template_url']);
                if (file_exists($rutaArchivo)) {
                    $email->attach($rutaArchivo, [
                        'as' => basename($doc['template_url'])
                    ]);
                }
            }

            // Documentos del radicado (documents)
            if (!empty($doc['file'])) {

                $rutaArchivo = storage_path('app/public/' . $doc['file']);
                if (file_exists($rutaArchivo)) {
                    $email->attach($rutaArchivo, [
                        'as' => basename($doc['file'])
                    ]);
                }
            }
        }

        return $email;
    }
}