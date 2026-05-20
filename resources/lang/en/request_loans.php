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
        'title' => 'Apply for a loan',
        'save' => 'Save',
        'form' => [
            'num_radicate' => 'File number',
            'date' => 'Date',
            'subject' => 'Subject',
            'type_documental' => 'Documentary type',
            'exp_file' => 'File',
            'file_area' => 'Archive area',
            'module' => 'Module',
            'spacer' => 'Spacer',
            'box' => 'Box',
        ],
        'table' => [
            'num_radicate' => 'File number',
            'date' => 'Date',
            'subject' => 'Subject',
            'type_documental' => 'Documentary type',
            'exp_file' => 'File',
            'file_area' => 'Archive area',
            'module' => 'Module',
            'spacer' => 'Spacer',
            'box' => 'Box',
            'dependency' => 'Dependency',
            'dial' => [
                'loan' => 'Apply for a loan',
            ],
            'loan_dialog' => [
                'type_loan' => 'Type of loan',
                'requirement' => 'Requirement',
                'observation' => 'Observation',
                'return_at' => 'Date devolution',
                'succes_message' => 'Record stored correctly'
            ]
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
    'admin_loans' => [
        'title' => 'Apply for a loan',
        'save' => 'Save',
        'form' => [
            'num_radicate' => 'File number',
            'date' => 'Date',
            'subject' => 'Subject',
            'type_documental' => 'Tipo documental',
            'exp_file' => 'File',
            'file_area' => 'Archive area',
            'module' => 'Module',
            'spacer' => 'Spacer',
            'box' => 'Box',
        ],
        'table' => [
            'num_radicate' => 'File number',
            'subject' => 'Subject',
            'type_documental' => 'Documentary type',
            'type_loan' => 'Type of loan',
            'requirement' => 'Requirement',
            'reques_date' => 'Date of loan request',
            'exp_file' => 'File',
            'file_area' => 'Archive area',
            'module' => 'Module',
            'spacer' => 'Spacer',
            'box' => 'Box',
            'dependency' => 'Dependency',
            'user' => 'User',
            'headers_dialog' => [
                'accept' => 'Accept request',
                'reject' => 'Reject request',
                'return' => 'Devolver solicitud',
            ],
            'state' => [
                'reject' => 'Loan declined',
                'accepted' => 'Loan accepted',
                'return' => 'Loan repaid',
            ],
            'dial' => [
                'acepted' => 'Approve application',
                'reject' => 'Reject request',
                'history' => 'Hisorial',
                'return' => 'Return',
            ],
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
];
