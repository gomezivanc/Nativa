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

    'physicalSpace' => [
        'title' => 'PhysicalSpace listing',
        'save' => 'Save',
        'form' => [
            'is_exist' => 'Exist building?',
            'name' => 'Building',
            'dep_id' => 'Department',
            'ciu_id' => 'City',
            'floor' => 'Floor',
            'file_area' => 'File Area',
            'rack' => 'Rack',
            'module' => 'Module',
            'panel' => 'Panel',
            'box' => 'Box',
            'type_body_id' => 'Type Body',
            'unity_conservation' => 'Conservation unit',

            'title1' => 'Building data',
            'title2' => 'Storage data',
            'add_ubi' => 'Agregar +',

            'error' => [
                'floor' => 'No floor field was entered'
            ]
        ],
        'table' => [
            'name' => 'Building',
            'floor' => 'Floor',
            'file_area' => 'File area',
            'rack' => 'Shelf',
            'module' => 'Modules',
            'type_body_id' => 'Body',
            'created_at' => 'Date created',

            'state' => [
                'pending' => 'Pending filing',
                'archived' => 'Archived'
            ]
        ],
        'detail' => [
            'process' => 'Procedure',
            'type_documents' => 'Document types',
            'expiration' => 'Expiration',
        ]
    ],
    'exp_files' => [
        'detail' => [
            // 'dep_id' => '',
            // 'ciu_id' => '',
            'building' => 'Building',
            'floor' => 'Floor',
            'file_area_id' => 'Archive area',
            'type' => 'Conservation unit',
            'rack' => 'Rack',
            'module' => 'Module',
            'panel' => 'Spacer',
            'box' => 'Box',
            'type_body_id' => 'Body',
            'creado_por_id' => 'User',
            'created_at' => 'File date',
            // 'updated_at' => '',
            // 'deleted_at' => '',

            'not_found' => 'Not specified'
        ],
        'export' => [
            'title' => 'Box label',
            'box_num' => 'Box number',
            'total_unity' => 'Total unit no.',
            '1_unity' => '1 unit no.',
            'last_no_unity' => '1 unit no.',
            'dependency' => 'Dependency',
            'content' => 'Content',
            'name' => 'Name',
            'code' => 'Code',
            'series_subseries' => 'Series / Subseries',
            'responsible_signature' => 'Responsible signature',
            'extreme_date' => 'Extreme date',
        ]
    ],
    'disposition_final' => [
        'items_dispo_final_e' => 'Documentary series and subseries for elimination (E)',
        'items_dispo_final_s' => 'Documentary selection series and subseries (S)',
        'items_dispo_final_ct' => 'Total conservation series and subseries (TC))',
        'items_dispo_final_md' => 'Microfilming/Digitization (MD) documentary series and subseries',
        'table' => [
            'id' => 'ID',
            'number' => 'File number',
            'name' => 'File name',
            'time_g' => 'Time in management',
            'time_c' => 'Weather in central',
            'destroy_agn' => 'Approval of elimination AGN',
            'state' => 'State',
            'dials' => [
                'select' => 'Select',
                'total_con' => 'Total conservation',
                'approve_delete' => 'Approve elimination',
                'approve_con' => 'Approve conservation',
            ],
            'states' => [
                'approve_con' => 'In process of approval (conservation)',
                'approve_el' => 'In process of approval (elimination)',
                'el' => 'Deleted',
                'con' => 'Preserved',
            ]
        ],
        'modal_con' => 'Conservation',
        'modal_delete' => [
            'title' => 'Deleted',
            'type_delete' => 'Type of disposal',
            'types_delete' => [
                'tru' => 'Shredding',
                'in' => 'Incineration',
                'delete_dig' => 'Digital Secure Erasure',
                'other' => 'Another',
            ],
            'observation' => '',
        ],
        'validate' => [
            'are_sure' => 'Are you sure?',
            'are_sure2' => '¿Do you wish to approve this request?',
        ]
    ],
    'accumulated_fund' => [
        'form' => [
            'number' => 'Number',
            'remi_desti_id' => 'Sender or recipient of the document',
            'subject' => 'Subject of the filing',
            'word' => 'Word',
            'type_document' => 'Document type',
            'serie' => 'Documentary series',
            'physical_location' => 'Physical location',
            'subserie' => 'Documentary subseries',
            'clasification_id' => 'Classification',
            'dep_id' => 'Department',
            'ciu_id' => 'City',
            'building' => 'Name of the physical space',
            'floor' => 'Floor number',
            'file_area_id' => 'Location of the physical space',
            'type' => 'Type',
            'rack' => 'Shelf',
            'module' => 'Module',
            'panel' => 'Shelf',
            'box' => 'Box',
            'type_body_id' => 'Body type',
            'creado_por_id' => 'Created by',
            'created_at' => 'Creation date',
            'state' => 'State',
        ],
        'show' => [
            'document' => 'Document',
            'document_number' => 'Document',
            'created_at' => 'Created',
            'id' => 'ID',
            'subject' => 'Subject',
            'serie' => 'Series',
            'subserie' => 'Subseries',
            'code' => 'Code',

            // General Information
            'general_info' => 'General Information',
            'keyword' => 'Keyword',
            'document_type' => 'Document Type',
            'classification' => 'Classification',
            'unity_conservation' => 'Conservation Unit',
            'type' => 'Type',

            // Document Retention
            'retention_info' => 'Retention Information',
            'physical_support' => 'Physical Support',
            'electronic_support' => 'Electronic Support',
            'years_in_management' => 'Years in Management',
            'years_in_central' => 'Years in Central',
            'final_disposition_s' => 'Final Disposition S',
            'final_disposition_md' => 'Final Disposition MD',

            // Location
            'location' => 'Location',
            'geo_location' => 'Geographical Location',
            'department' => 'Department',
            'city' => 'City',
            'building' => 'Building',
            'physical_location' => 'Physical Location',
            'floor' => 'Floor',
            'rack' => 'Rack',
            'module' => 'Module',
            'panel' => 'Panel',
            'box' => 'Box',
            'body_type' => 'Body Type',

            // Sender
            'sender' => 'Sender',
            'social_reason' => 'Social Reason',
            'representative' => 'Representative',
            'document_nit' => 'Document/NIT',
            'address' => 'Address',
            'email' => 'Email',
            'phone' => 'Phone',

            // Processes
            'processes' => 'Processes',
            'subseries_processes' => 'Subseries Processes',
            'scanned_filing' => 'Attach Filing Document',

            // Metadata
            'metadata' => 'Metadata',
            'creator_info' => 'Creator Information',
            'last_login' => 'Last Login',
            'last_login_ip' => 'Last Login IP',
            'status' => 'Status',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'super_admin' => 'Super Administrator',
            'timestamps' => 'Timestamps',
            'created' => 'Created',
            'updated' => 'Updated',
            'deleted' => 'Deleted',
            'not_deleted' => 'Not Deleted',
        ]
    ]
];
