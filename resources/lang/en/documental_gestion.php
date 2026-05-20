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

    'dependency' => [
        'title' => 'Dependencies',
        'save' => 'Save',
        'form' => [
            'code' => 'Dependency code',
            'name' => 'Name of unit',
            'g_d_parent_id' => 'Administrative unit',
            'dep_id' => 'Department',
            'ciu_id' => 'City',
            'trd_charge' => 'TRD charged',
            'updated_at' => 'Updated at',
            'ofi_prod' => 'Production office',
            'version' => 'Version',
            'saved_successfully' => 'Saved successfully',
            'updated_successfully' => 'Updated successfully',
            'error' => 'Error saving'
        ],
        'table' => [
            'code' => 'Dependency code',
            'name' => 'Unit name',
            'g_d_parent_id' => 'Administrative unit',
            'trd_active' => 'Trd active',
            'regional' => 'Regional',
        ],
        'detail' => [
            'retention_years' => [
                'title' => 'Retention Years',
                'a_g' => 'Years of Management',
                'a_c' => 'Years Central'
            ],
            'support' => [
                'title' => 'Support',
                'p' => 'Paper',
                'e' => 'Electronic',
                'o' => 'Original'
            ],
            'dis_final' => [
                'title' => 'Final Provision',
                'CT' => 'CT',
                'E' => 'E',
                'S' => 'S',
                'M' => 'M'
            ],
            'process' => 'Procedure',
            'type_documents' => 'Documentary types',
            'expiration' => 'Expiration',

        ],
        'dial' => [
            'add' => 'Add',
            'edit' => 'Edit',
            'delete' => 'Change status',
            'd_trd' => 'Download trd',
            'd_c_doc' => 'Download document classification',
            'v_trd' => 'TRD versioning',
            'c_docs' => 'TRD versioning',
            'show_trd' => 'View active TRD',
            'show' => 'View',
            'cash_register' => 'Cash register label',
            'folder_register' => 'Folder label',

        ],
        'exportTrd' => [
            'clasification' => [
                'code' => 'code',
                'series_sub_series_t_doc' => 'Documentary series, subseries and typology',
                'items_pro_subseries' => 'Procedure',
                'document_classification_chart' => 'DOCUMENT CLASSIFICATION CHART',
                'document_management_process' => 'DOCUMENT MANAGEMENT PROCESS',
                'preparation_document_retention_table' => 'PREPARATION OF THE DOCUMENT RETENTION TABLE',
                'date' => 'Date',
                'page' => 'Page',
                'background' => 'Fund',
                'code_administrative_unit' => 'CODE ADMINISTRATIVE UNIT',
                'administrative_unit' => 'ADMINISTRATIVE UNIT',
                'production_office_code' => 'PRODUCTION OFFICE CODE',
                'production_office' => 'PRODUCTION OFFICE',
                'serial_code' => 'SERIAL CODE',
                'serie' => 'SERIES',
                'subseries_code' => 'SUBSERIES CODE',
                'subserie' => 'SUBSERIE'
            ]
        ]
    ],
    'retention' => [
        'title' => 'Retenciones',
        'table' => [
            'dependency' => 'Dependency',
            'code' => 'Code',
            'name' => 'Name',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'type_doc' => 'Type documental',
            'archivo_gestion' => 'Management file',
            'archivo_central' => 'Central file',
            'time_retention' => 'Time retention',
            'support_documental' => 'Documental support',
            'final_disposition' => 'Final disposition',
            'paper' => 'Paper',
            'electronic' => 'Electronic',
            'elimination' => 'Elimination',
            'conservation_total' => 'Total conservation',
            'selection' => 'Selection',
            'digitalization_micro' => 'Digitalization/Microfilming',
            'procedure' => 'Procedure',
            'procedure_description' => 'Procedure description',
            'description' => 'Description',
            'save' => 'Save',
            'saving' => 'Saving',
            'cancel' => 'Cancel',
            'documentary_series' => 'Documentary series',
        ],
    ],
    'charge_trd' => [
        'title' => 'Load of trd',
        'save' => 'Upload',
        'charge' => 'Upload file',
        'messages_success' => [
            'header' => 'File loaded correctly, $pages sheets were processed.',
            'new' => 'A new version of the $num_trd dependency was created.',
            'replace' => 'The unit already has a TRD configured and active since $date_trd. A new version of the unit will be created, which must be approved by the management responsible.',
        ],
    ],
    'trd_versioning' => [
        'title' => 'List of temporary TRD versioning',
        'table' => [
            'dependency' => 'Dependency',
            'serie' => 'Serie',
            'Subserie' => 'Subserie',
            'type_doc' => 'Documentary type',
            'created_at' => 'Date created',
        ],
        'save' => 'Upload',
    ],
    'exp_files' => [
        'title' => 'List of files',
        'save' => 'Save',
        'add' => 'Save',
        'confirm_dialog_lock' => 'Are you sure?',
        'confirm_dialog_lock_text' => 'Remember that the retention time starts to run when the file is closed - are you sure you want to close it?',
        'dialogs' => [
            'reference' => 'Cross reference',
            'reference_form' => [
                'name_middle' => 'Name of media',
                'quantity' => 'Quantity',
                'anex' => 'Select the type of physical attachment',
                'ubication' => 'Location',
            ],
            'close' => 'Close file',
            'charge_doc' => 'Upload document',
            'close_form' => [
                'observation' => 'Observation',
                'password' => 'Password',
                'message_error_login' => 'The password is incorrect',
            ],
            'charge_docs' => [
                'charge_docs' => 'Document upload',
                // 'type_doc_id' => 'Document type',
                'support_type_id' => 'Support type',
                'date' => 'Document date',
                'description' => 'Description',
                'error_format_file' => 'The file is not a PDF',
                'is_public' => 'Is it public?',
                'file' => 'Select file',
                'classification' => [
                    'page_classification' => 'Page classification',
                    'page_start' => 'Start page',
                    'page_end' => 'End page',
                    'add_classification' => 'Add classification',
                    'remove_classification' => 'Remove classification',
                    'type_doc_id' => 'Document type',
                    'validation_page_range' => 'End page cannot be less than start page',
                    'error_min_classification' => 'File :index must have at least one classification.'
                ],
                'segment_page_end_less_start' => "The ending page cannot be less than the starting page.",
                'segment_page_start_less_one' => "The starting page cannot be less than 1.",
                'segment_page_end_exceeds_total' => "The PDF only has :total_pages pages.",
                'segment_pages_overlap' => "Page ranges overlap."
            ]
        ],
        'success_messages' => [
            'transfer' => 'Updated status of file {num_exp} - Reports',
            '' => '',
            '' => '',
        ],

        'table_control' => [
            'code' => 'Producing office code',
            'name' => 'Production office',
            'code_serie' => 'Serial code',
            'serie' => 'series',
            'Código subserie' => 'Sub-series code',
            'subserie' => 'Subseries',
            'access' => 'Access',
            'rol' => 'Role',
            'state' => 'State',
        ],
        'table' => [
            'number' => 'File No.',
            'name' => 'Name',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'date_init' => 'File start date',
            'dependency_id' => 'Dependency',
            'creado_por_id' => 'User creator',
            'clasification_id' => 'Classification',
            'description' => 'Description',
            'actions' => 'Actions',
            'index' => 'Index',
            'type_archive' => 'Tipo de archivo',
            'type_archive_state' => [
                'first' => 'Management - first location',
                'second' => 'Central - second location',
            ],
            'space_states' => [
                'not_assigned' => 'Espacio fisico no asignado',
                'assigned' => 'Espacio fisico asignado',
            ],

            'dials' => [
                'reference_crusade' => 'Cross reference',
                'close' => 'Close file',
                'charge_docs' => 'Upload documents',
                'sub_exp' => 'Add sub file',
                'historic_export' => 'Export history',
                'control_papper' => 'Control sheet',
                'package_files' => 'Download document package',
                'archive_exp' => 'File archiving',
                'transfer' => 'Transfer',
                'transfer_accept' => 'Accept transfer',
                'reject_accept' => 'Reject transfer',
                'download_fuid' => 'Download FUID',
            ],
            'modal_transfer' => [
                'title' => 'Manual transfer',
                'title_reject' => 'Reject transfer',
                'observation' => 'Observation',
            ],

            'state_transfer' => [
                0 => 'Active',
                1 => 'Pending transfer',
                2 => 'Transfer accepted',
                3 => 'Transfer reject',
            ],
        ],
        'detail' => [
            'index_elec' => 'Electronic index',
            'documents_exp' => 'File documents',
            'detail_exp' => 'File detail',
            'code' => 'Code',
            'support' => 'Support',
            'state' => 'State',
            'name' => 'File name',
            'final_disposition' => 'Final_disposition',
            'ubication' => 'Location',
            'subject_administrative_matter' => 'Administrative subject or matter',
            'years_retention' => 'Years in retention',
            'administrative_unit_responsible' => 'Administrative unit responsible',
            'last_loan' => 'Last loan',
            'file_start_date' => 'File start date',
            'physically_exist' => 'Does it physically exist',
            'serie' => 'Series',
            'created_at' => 'Date created',
            'units_involved_file_management' => 'Units that are part of file management',
            'Subserie' => 'Subseries',
            'responsible_issuer' => 'Responsible_issuer(s)',
            'ranking' => 'Classification',

            'filters_documents' => [
                'description' => 'Document description',
                'type_doc' => 'Document type',
            ],

            'table_documents' => [
                'index' => 'Index',
                'content_index' => 'Index content',
                'document_name' => 'Document name',
                'document_type' => 'Document type',
                'document_date' => 'Document date',
                'date_inclusion' => 'Date of inclusion',
                'document_support' => 'Support type',
                'document_responsible' => 'Responsible person',
                'document_sequential' => 'Document sequential number',
                'without_segments' => 'Without segments',
                'document_segments' => 'Document segments',
                'fingerprint_value_document' => 'Fingerprint value',
                'document_order_pg' => 'Document order',
                'start_page' => 'Start_page',
                'end_page_format' => 'End_page',
                'format' => 'Format',
                'size' => 'Size',
                'origin' => 'Origin',

                // PRIMERA TABLA
                'num_radicate' => 'File number',
                'document' => 'Document',
                'description' => 'Description',
                'date_document' => 'Document date',

                'dials' => [
                    'download' => 'Download',
                    'show' => 'See',
                    'exclude_files' => 'Exclude documents',
                    'question_deactivate' => 'Do you wish to exclude documents from the file?',
                    'question_deactivate_body' => 'Documents will be removed from the file'
                ]
            ],
        ],
        'form' => [
            'name' => 'File name',
            'date_init' => 'File start date',
            'exist_p' => 'Does it physically exist?',
            'name_generated' => 'Generated file name',
            'not_generated' => 'The name has not yet been generated',            
            'book' => 'Book',
            'shelf' => 'Shelf',
            'file_box' => 'File box',
            'description' => 'Description',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'clasification_id' => 'Classification',
            'types_control' => 'Tipos de control',

            'dependency' => 'Units involved in file management',
            'dependency_id' => 'Dependency',
            'responsible' => 'Responsible',
            'responsible_id' => 'Staff member',

            'new_sub_exp' => 'New Sub-file',
            'add_subfile' => 'Add Sub-File',
            'sub_exp' => 'Add Sub-File',

            'state' => [
                'inactive' => 'Close',
                'active' => 'Open'
            ],
        ]
    ],
];
