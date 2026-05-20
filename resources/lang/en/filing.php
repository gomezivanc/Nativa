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

    'standard_filing' => [
        'type_document_id' => 'Document type',
        'dependency' => 'Dependency',
        'Enter' => 'Enter',
        'Has_Acknowledgment' => 'Has Acknowledgment',
        'acknowledgment' => 'no Acknowledgment',
        'Observation' => 'Observation',
        'Cancellation_rejected' => 'Cancellation rejected',
        'job_title' => 'Job title',
        'document' => 'Document',
        'official' => 'Official',
        'official_details' => 'Official details',
        'sending_official' => 'Sending official',
        'response_data' => 'Response data',
        'generated_filing' => 'Generated filing',
        'successfully_uploaded_template' => 'Successfully uploaded template',
        'docs_sing' => 'Docs to sign',
        'signed_documents' => 'Signed documents',
        'already_signed_documents' => 'Already signed documents',
        'incorrect_password' => 'Incorrect password. Unable to sign the file.',
        'title' => 'Standard filing',
        'titleofficial' => 'titleo fficial',
        'additional_information' => 'Additional Information',
        'documet_information' => 'Attach Document',
        'responssible' => 'Responssible',
        'filing_information' => 'Filing information',
        'detail_filing' => 'Detail filing',
        'main_documents' => 'Main documents',
        'filing_documents' => 'Filing documents',
        'no_documents' => 'No files available for viewing.',
        'add_correo' => 'Add mail',
        'enter_email' => 'Enter email address',
        'copy_to' => 'Copy to',
        'save' => 'Save',
        'finish_filing' => 'Filing successfully completed',
        'finish_detail' => 'Finish detail',
        'signature_type' => 'Signature type',
        'confirm_signature' => 'Confirm signature',
        'file_number' => 'File number',
        'file_name' => 'File name',
        'find_file' => 'Find file',
        'exp_files_already' => 'Exp Files already included in',
        'exp_files_success' => 'Successfully completed files exp',
        'cancellation_request_successfully' => 'Cancellation request successfully submitted of ',
        'completed_file' => 'Completed file',
        'no_response_required' => 'Are you sure you want to mark this file as “No response required”?',
        'no_response_required_success' => 'Status successfully changed',
        'traceability' => 'Traceability',
        'canceled'=>'canceled',
        'table' => [
            'types_filing' => 'Types filing',
            'number_filing' => 'Number filing',
            'creation_date' => 'Creation date',
            'client' => 'Client',
            'subject' => 'Subject',
            'documental_type' => 'Documental type',
            'due_date' => 'Due date',
            'priority' => 'Priotity',
            'document' => 'Document',
            'permission_file' => 'Permission file',
        ],
        'form' => [
            'processing_data' => 'Processing data',
            'types_filing' => 'Types filing',
            'Reference' => 'Reference',
            'filling_origin' => 'Filling origin',
            'document_date' => 'Document date',
            'classification' => 'Classification',
            'dependency' => 'Dependency',
            'official' => 'Official',
            'no_serie' => 'Serie',
            'serie' => 'Serie',
            'sub_serie' => 'Sub serie',
            'documental_type' => 'Documental type',
            'reception_medium' => 'Reception medium',
            'priority' => 'Priority',
            'subject' => 'Subject',
            'expiration_date' => 'Expiration date',
            'remaining_days' => 'Remaining days',
            'number_pages' => 'Number pages',
            'annex_description' => 'Annex description',
            'observation' => 'Observation',
            'type_person' => 'Type person',
            'name_social_reason_sender' => 'Name or social reason',
            'first_surname_legal_representative_sender' => 'Last name / Legal representative',
            'legal_representative_sender' => 'Legal representative',
            'first_surname_sender' => 'Last name',
            'document_nit_sender' => 'Document or NIT',
            'nit_sender' => 'NIT',
            'document_sender' => 'Document',
            'response_request' => 'Receive response',
            'address_sender' => 'Address',
            'country_id' => 'Country ',
            'department_id' => 'State ',
            'city_id' => 'City ',
            'phone_sender' => 'Phone ',
            'email_sender' => 'Email ',
            'user' => 'User processor',
            'users' => 'Users',
            'informate_user_ext' => 'Inform external user',
            'target_dependency' => 'Target dependency',
            'target_user' => 'Target user',
            'template_name' => 'Template name',
            'template' => 'Template',
            'finish_observation' => 'Finish observation',
            'finish_date' => 'Finish date',
            'associated_filings' => 'Associated filings',
        ],
        'options_speed_dial' => [
            'associate_template' => 'Associate template',
            'res_template' => 'res template',
            'Cancel_filing' => 'Cancel filing',   
            'workflow' => 'Workflow',
            'print_sticker' => 'Print sticker',
            'copy_informed' => 'Copy to',
            'charge_docs' => 'Charge docs',
            'mail_reply' => 'Mail reply',
            'reassign' => 'Reassign',
            'finish' => 'Finish Filing',
            'sign' => 'Sign',
            'include_expedient_file' => 'Include expedient',
            'cancellation_request' => 'Cancellation request',
            'no_response' => 'No response required',
        ],
        'table_document' => [
            'name' => 'Name',
            'description' => 'Description',
            'type_documental' => 'Type documental',
            'user' => 'User',
        ],
        'signature_types' =>[
            'qr_signature' => 'QR signature',
            'mechanical_signature' => 'Mechanical signature',
            'physical_signature' => 'Physical signature',
            'preview_signature'=>'Preview signature'
        ]
    ],

    'filing_official' => [
        'table' => [
            'filing_consecutive' => 'Registration number / consecutive',
            'affair' => 'affair',
            'Sender' => 'Sender',
            'date_filed' => 'date filed',
            'Half_reception' => 'Half reception',
        ],
    ],

    'email_filing' => [
        'table' => [

        ],
        'form' => [
            'to' => 'To',
            'subject' => 'Subject',
            'message' => 'Message',
            'attachments' => 'Attacments',
            'send' => 'Send',

            'alert' => [
                'to_error' => 'Choose at least one recipient',
                'cofirm_subject' => 'Are you sure you want to send without a subject?',
                'demiss' => 'Cancel',

            ],
        ]
    ]
];
