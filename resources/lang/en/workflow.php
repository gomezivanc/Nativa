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
        'name' => 'Name',
        'description' => 'Description',
        'created_by_id' => 'Created by',
        'dials' => [
            'nodes' => 'Nodes',
            'copy' => 'Copy workflow',
        ],
    ],
    'form' => [
        'name' => 'Name',
        'description' => 'Description',

        'last_node' => 'Init node',
        'next_node' => 'End node',
        'conditional_node' => 'Conditional node?',
    ],
    'workflow_standart' => [
        'message_complete' => 'The workflow is now complete!',
        'message_empty' => 'This file does not have a workflow assigned to it.',
        'assign' => 'Assign',
        'observation' => 'Observation',
        'advance' => 'Advance',
        'reject' => 'Reject',

        'conditional_message' => 'Is the {{rep_condi}} condition met?',
        'current' => 'Current step',
        'table' => [
            'observation' => 'Observation',
            'created_at' => 'Date of Creation',
        ]
    ]
];
