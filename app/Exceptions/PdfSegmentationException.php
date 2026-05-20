<?php

namespace App\Exceptions;

use Exception;

class PdfSegmentationException extends Exception
{
    public function __construct(string $message = 'No se pudo segmentar el PDF.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
