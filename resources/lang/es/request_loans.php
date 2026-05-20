<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Menu multiidioma
    |--------------------------------------------------------------------------
    |
    | Archivo para guardar la traducción del menu
    | 
    | 
    |
    */

    'request_loans' => [
        'title_historic' => 'Historico de prestamos',
        'title' => 'Solicitar prestamos',
        'save' => 'Save',
        'form' => [
            'num_radicate' => 'Numero radicado',
            'date' => 'Fecha',
            'subject' => 'Asunto',
            'type_documental' => 'Tipo documental',
            'exp_file' => 'Expediente',
            'file_area' => 'Area de archivo',
            'module' => 'Modulo',
            'spacer' => 'Entrepaño',
            'box' => 'Caja',
        ],
        'table' => [
            'num_radicate' => 'Numero radicado',
            'date' => 'Fecha',
            'subject' => 'Asunto',
            'type_documental' => 'Tipo documental',
            'exp_file' => 'Expediente',
            'file_area' => 'Area de archivo',
            'module' => 'Modulo',
            'spacer' => 'Entrepaño',
            'box' => 'Caja',
            'dependency' => 'Dependencia',
            'dial' => [
                'loan' => 'Solicitar prestamo',
            ],
            'loan_dialog' => [
                'type_loan' => 'Tipo préstamo',
                'requirement' => 'Requerimiento',
                'observation' => 'Observación',
                'password' => 'Contraseña del solicitante',
                'return_at' => 'Fecha devolución',
                'succes_message' => 'Registro almacenado correctamente'
            ]
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
    'admin_loans' => [
        'title' => 'Solicitar prestamos',
        'save' => 'Save',
        'form' => [
            'num_radicate' => 'Numero radicado',
            'date' => 'Fecha',
            'subject' => 'Asunto',
            'type_documental' => 'Tipo documental',
            'exp_file' => 'Expediente',
            'file_area' => 'Area de archivo',
            'module' => 'Modulo',
            'spacer' => 'Entrepaño',
            'box' => 'Caja',
        ],
        'table' => [
            'num_radicate' => 'Numero radicado',
            'subject' => 'Asunto',
            'type_documental' => 'Tipo documental',
            'type_loan' => 'Tipo de préstamo',
            'requirement' => 'Requerimiento',
            'reques_date' => 'Fecha solicitud préstamo',
            'exp_file' => 'Expediente',
            'file_area' => 'Area de archivo',
            'module' => 'Modulo',
            'spacer' => 'Entrepaño',
            'box' => 'Caja',
            'dependency' => 'Dependencia',
            'user' => 'Usuario',
            'headers_dialog' => [
                'accept' => 'Aceptar solicitud',
                'reject' => 'Rechazar solicitud',
                'return' => 'Devolver solicitud',
            ],
            'state' => [
                'reject' => 'Prestamo rechazado',
                'accepted' => 'Prestamo aceptado',
                'return' => 'Prestamo devuelto',
            ],
            'dial' => [
                'acepted' => 'Aprobar solicitud',
                'reject' => 'Rechazar solicitud',
                'history' => 'Historial',
                'return' => 'Devolver',
            ],
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
    'admin_loans_expfile' => [
        'title' => 'Prestamos de expedientes',
        'save' => 'Guardar',
        'table' => [
            'number' => 'Número de expediente',
            'name' => 'Nombre expediente',
            'dependency' => 'Dependencia responsable',
            'user' => 'Usuario responsable',
            'file_area' => 'Bodega',
            'rack' => 'Estante',
            'spacer' => 'Entrepaño',
            'box' => 'Caja',

            //-------------------------------------------------------------------------------------------------------------

            'type_loan' => 'Tipo de prestamo',
            'date_loan' => 'Fecha solicitud prestamo',
            'requirement' => 'Requerimiento',
            'user_request' => 'Usuario que solicita',

            'headers_dialog' => [
                'accept' => 'Aceptar solicitud',
                'reject' => 'Rechazar solicitud',
                'return' => 'Devolver solicitud',
            ],
            'state' => [
                'reject' => 'Prestamo rechazado',
                'accepted' => 'Prestamo aceptado',
                'return' => 'Prestamo devuelto',
            ],
            'dial' => [
                'acepted' => 'Aprobar solicitud',
                'reject' => 'Rechazar solicitud',
                'history' => 'Historial',
                'return' => 'Devolver',
            ],
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
];
