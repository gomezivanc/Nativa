<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/guardar-documento-en-linea/*',
        'api/getfileOnly',
        'api/guardar-documento-en-linea/',
        'api/guardar-documento-en-linea/',
        'api/gmail/webhook',
        'api/google/redirect/{id}',
        'api/google/callback',
    ];
}
