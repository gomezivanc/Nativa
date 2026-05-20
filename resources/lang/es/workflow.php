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

    'table' => [
        'name' => 'Nombre',
        'description' => 'Descripción',
        'creado_por_id' => 'Creado por',
        'dials' => [
            'nodes' => 'Nodos',
            'copy' => 'Copiar workflow',
        ],
    ],
    'form' => [
        'name' => 'Nombre',
        'description' => 'Descripción',
        'last_node' => 'Nodo de inicio',
        'next_node' => 'Nodo fin',
        'conditional_node' => '¿Es nodo condicional si/no?',
        'conditional_true' => '¿El nodo pertenece a un condicional?',
        'conditional_true_yes' => '¿El nodo pertenece a un condicional si?',
        'is_end' => 'Finaliza el flujo',
    ],
    'workflow_standart' => [
        'message_complete' => 'Ya se completo el flujo de trabajo!',
        'message_empty' => 'Este radicado no tiene un flujo de trabajo asignado',
        'assign' => 'Asignar',
        'observation' => 'Observación',
        'advance' => 'Avanzar',
        'reject' => 'Rechazar',

        'conditional_message' => '¿Se cumple con la condición {{rep_condi}}?',
        'current' => 'Paso actual',
        'table' => [
            'observation' => 'Observación',
            'created_at' => 'Fecha de Creación',
        ]
    ]
];
