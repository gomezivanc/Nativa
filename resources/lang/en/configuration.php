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

    'trd' => [
        'title' => 'Trd load configuration',
        'head1' => 'Initial configuration TRD load',
        'save' => 'Save',
        'update' => 'update',
        'form' => [
            'conf_mask_trd_id' => 'Mask',
            'dependency_code' => 'Dependency code',
            'dependency_name' => 'Dependency name',
            'unity_admin' => 'Administrative unit',
            'has_regional' => 'Indicator if it is regional',
            'regional' => 'Regional',
            'init_data' => 'Data start',
            'code_trd' => 'TRD or dependency code',
            'series_sub_series_t_doc' => 'Series, Sub-series, and document types name',
            'items_year_gestion' => 'Management file years',
            'items_year_central' => 'Central archive year items',
            'items_dispo_final' => 'Final disposition item',
            'items_dispo_final_ct' => 'Final disposition CT item',
            'items_dispo_final_e' => 'Final disposition E item',
            'items_dispo_final_s' => 'Final disposition S item',
            'items_dispo_final_md' => 'Final disposition MD item',
            'items_pro_subseries' => 'Sub-series procedure item',
            'conf_days_term' => 'Term days configuration',
            'days_conf_days_term' => 'Term days configuration',
            'Has_standard' => 'Has standard',
            'item_standard' => 'Standard item',
            'Has_support' => 'Has support',
            'item_support_p' => 'Support P item',
            'item_support_e' => 'Support E item',
            'item_support_o' => 'Support O item',
            'serie' => 'Cell Serie',
            'subserie' => 'Cell Subserie',
        ],
        'table' => [
            'mask' => 'Mask',
            'dependency_code' => 'Unit Code',
            'unity_admin' => 'Administrative Unit',
            'dependency_name' => 'Unit Name',
            'regional' => 'Regional',
            'init_data' => 'Data Home',
            'code_trd' => 'Dependency code column',
            'series_sub_series_t_doc' => 'Serial code column',
            'series_sub_series_t_doc' => 'Sub-series code column',
            'series_sub_series_t_doc' => 'Column Unit Name',
            'item_standard' => 'Standard column',
            'item_support_p' => 'Support column P',
            'item_support_e' => 'Support column E',
            'item_support_o' => 'Support column O',
        ],
    ],
    'provider' => [
        'title' => 'Configuration provider',
        'save' => 'Save',
        'form' => [
            'name' => 'Name of supplier',
            'conf_services_provider_id' => 'Service',
            'regional_id' => 'Regional',
            'ciu_id' => 'City',
        ],
        'table' => [
            'name' => 'Name of supplier',
            'conf_services_provider_id' => 'Service',
            'regional_id' => 'Regional',
            'dep_id' => 'Department',
            'ciu_id' => 'City',
        ],
        'show' => [
            'title' => 'Record Details',
            'id' => 'ID',
            'basic_info' => 'Basic Information',
            'name' => 'Name',
            'provider_id' => 'Service Provider ID',
            'created_by' => 'Created by',
            'regional_id' => 'Regional ID',
            'temporal_info' => 'Temporal Information',
            'created_at' => 'Creation Date',
            'updated_at' => 'Last Updated',
            'deleted_at' => 'Deletion Date',
            'not_deleted' => 'Not deleted',
            'service_panel' => 'Service',
            'service_name' => 'Service Name',
            'service_id' => 'Service ID',
            'service_created_at' => 'Creation Date',
            'service_updated_at' => 'Last Updated',
            'regional_panel' => 'Regional Information',
            'regional_sigla' => 'Abbreviation',
            'regional_name' => 'Regional Name',
            'regional_id_text' => 'ID',
            'country_id' => 'Country ID',
            'departament_id' => 'Department ID',
            'city_id' => 'City ID',
            'regional_created_by' => 'Created by',
            'regional_created_at' => 'Creation Date',
        ]
    ],
    'users_group' => [
        'title' => 'User Groups',
        'save' => 'Save',
        'form' => [
            'name' => 'Group name',
            'g_d_dependency_id' => 'Dependency',
            'users_group' => 'Select users',
        ],
        'table' => [
            'name' => 'Group name',
            'g_d_dependency_id' => 'Dependency',
            'users_group' => 'Users',
        ],
        'show' => [
            'title' => 'Group',
            'group_id' => 'Group ID',
            'basic_info' => 'Basic Information',
            'group_name' => 'Group Name',
            'created_by' => 'Created by',
            'total_users' => 'Total Users',
            'total_dependencies' => 'Total Dependencies',
            'temporal_info' => 'Temporal Information',
            'created_at' => 'Creation Date',
            'updated_at' => 'Last Updated',
            'deleted_at' => 'Deletion Date',
            'not_deleted' => 'Not deleted',
            'users_tab' => 'Users',
            'dependencies_tab' => 'Dependencies',
            'no_users_found' => 'No users found',
            'no_dependencies_found' => 'No dependencies found',
            'user_details' => 'User Details',
            'close' => 'Close',
            'email' => 'Email',
            'status' => 'Status',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'last_login' => 'Last Login',
            'last_login_ip' => 'Last Login IP',
            'login_attempts' => 'Login Attempts',
            'dependency_id' => 'Dependency ID',
            'observations' => 'Observations',
        ]
    ],
    'hours_work' => [
        'title' => 'Working hours',
        'save' => 'Save',
        'form' => [
            'day_of_week_init' => 'Start day',
            'day_of_week_end' => 'Day end',
            'init_work_hour' => 'Start time',
            'end_work_hour' => 'Timetable end',
        ],
        'table' => [
            'day_of_week_init' => 'Start day',
            'day_of_week_end' => 'Day end',
            'init_work_hour' => 'Start time',
            'end_work_hour' => 'Timetable end',
            'created_at' => 'Created at',
        ],
        'show' => [
            'title' => 'Work Schedule',
            'id' => 'ID',
            'current_status' => 'Current Status',
            'within_schedule' => 'Within working hours',
            'outside_schedule' => 'Outside working hours',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'progress' => 'Workday Progress',
            'working_days' => 'Working Days',
            'working_days_range' => 'Working days:',
            'schedule' => 'Schedule',
            'total_duration' => 'Total duration:',
            'additional_info' => 'Sender Details',
            'created_by' => 'Created by',
            'created_at' => 'Creation Date',
            'updated_at' => 'Last Updated',
            'json_dialog_title' => 'Schedule JSON Data',
            'close' => 'Close',
        ]
    ],
    'hours_not_work' => [
        'title' => 'Non-working days',
        'create_title' => 'Create non-working day',
        'edit_title' => 'Edit non-working day',
        'form' => [
            'date' => 'Non-working date',
            'day_of_week' => 'Day of the week',
            'reason' => 'Reason for the non-working day',
            'is_recurring' => 'Repeats every year?',
        ],
        'fields' => [
            'date' => 'Date',
            'day_of_week' => 'Day of the Week',
            'is_recurring' => 'Recurring',
            'reason' => 'Reason',
            'created_by' => 'Created by',
            'created_at' => 'Created at',
            'updated_at' => 'Updated at',
            'deleted_at' => 'Deleted at',
            'not_deleted' => 'Not deleted',
        ],
        'yes' => 'Sí',
        'no' => 'No',
        'table' => [
            'date' => 'Date',
            'day_of_week' => 'Day of the week',
            'reason' => 'Reason',
        ]
    ],
    'payroll_management' => [
        'title' => 'Gestión de planillas',
        'code' => 'Codigo',
        'Regional' => 'Regional',
        'Dependence' => 'Dependencia',
        'Worksheet' => 'Planilla',
        'Template_code' => 'Codigo plantilla',
        'Version' => 'Version',
        'Creation_date' => 'Fecha De Creación',
        'Template_name' => 'Template Name',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre planilla',
            'file' => 'Seleccionar planilla',
        ],
        'table' => [
            'name' => 'Nombre planilla',
            'file' => 'Planilla',
        ],
    ],
    'charges' => [
        'headquarters_Regional' => 'Sede o Regional',
        'dependence' => 'Dependencia',
        'post' => 'Cargo',
        'form'=> [
            'regional' => 'Seleccionar regional',
            'dependence' => 'Seleccionar dependencia',
        ]
    ],
    'procedure_management' => [
        'title' => 'Procedure management',
        'create_title' => 'Create procedure',
        'edit_title' => 'Edit procedure',
        'save' => 'Save',
        'form' => [
            'name' => 'Procedure Name',
            'response_time' => 'Response Time',
        ],
        'table' => [
            'name' => 'Procedure Name',
            'response_time' => 'Response Time',
        ],
        'fields' => [
            'days'        => 'Business days',
            'created_at'  => 'Created at',
            'updated_at'  => 'Updated at',
            'deleted_at'  => 'Deleted at',
            'not_deleted' => 'Not deleted',
        ],
        'error' => [
            'same_name' => 'There is already an active procedure with this name'
        ]
    ],
    'variables_templates' => [
        'title' => 'Templates variables',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Variable name ${xxx}',
            'description' => 'Variable description',
        ],
        'table' => [
            'name' => 'Variable name ${xxx}',
            'description' => 'Description',
        ],
    ],
    'user_interoperability' => [
        'title' => 'Usuario interoperabilidad',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Name',
            'email' => 'Email',
            'document' => 'Document or NIT',
            'type_document_id' => 'Select type of identification',
            'dependency_id' => 'Dependency',
        ],
        'table' => [
            'name' => 'Name',
            'email' => 'Email',
            'token' => 'Token',
            'document' => 'Document or NIT',
            'type_document_id' => 'Type of identification',
            'created_at' => 'Fecha creación',
            'dependency_id' => 'Dependency',
        ],
    ],
    'satisfaction_survey' => [
        'title' => 'Satisfaction survey',
        'save' => 'Save',
        'form' => [
            'name' => 'Name',
            'add' => 'Add',
            'questions_count' => 'Questions Count',
        ],
        'table' => [
            'name' => 'Name',
            'num_questions' => 'Number questions',
            'questions_count' => 'Questions Count',
        ],
    ],
    'regional' => [
        'title' => 'Regional',
        'save' => 'Save',
        'form' => [
            'name' => 'Regional',
            'sigla' => 'Sigla',
            'country_id' => 'Pais',
            'departament_id' => 'Departamento',
            'city_id' => 'Ciudad',
        ],
        'table' => [
            'name' => 'Regional',
            'sigla' => 'Sigla',
            'country_id' => 'Pais',
            'departament_id' => 'Departamento',
            'city_id' => 'Ciudad',
        ],
    ],
    'types_of_filings' => [
        'title' => 'Types of filings',
        'save' => 'Save',
        'form' => [
            'code' => 'Filing types code',
            'name' => 'Filing types name',
            'creator_date' => 'Creator date',
            'description' => 'Description',
        ],
        'table' => [
            'code' => 'Filing types code',
            'name' => 'Filing types name',
            'creator_date' => 'Creator date',
        ],
    ],
    'filling_setting' => [
        'title' => 'Filing setting',
        'save' => 'Save',
        'form' => [
            'dependency_length' => 'Dependency length',
            'filling_structure' => 'Filling structure',
            'consecutive_length' => 'Consecutive length',
        ],
        'table' => [
            'dependency_length' => 'Dependency length',
            'filling_structure' => 'Filling structure',
            'consecutive_length' => 'Consecutive length',
            'creator_date' => 'Creator date',
        ],
    ],
    'radication_label' => [
        'title' => 'Radication labels',
        'save' => 'Guardar',
        'form' => [
            'label' => 'Label',
            'description' => 'Description',
            'date' => 'Date',
        ],
        'table' => [
            'label' => 'Label',
            'description' => 'Description',
            'date' => 'Date',
        ],
    ],
    'dashboard_survey' => [
        'title' => 'Survey Report',
        'subtitle' => 'Visualization of satisfaction survey data',

        'surveys' => [
            'title' => 'Surveys and Responses',
            'survey_id' => 'Survey ID',
            'total_responses' => 'Total Responses',
        ],

        'questions' => [
            'title' => 'Responses Grouped by Question',
            'question_id' => 'Question ID',
            'response' => 'Response',
            'count' => 'Count',
        ],

        'average' => [
            'title' => 'Average Responses per Survey',
            'avg_responses' => 'Average Responses',
        ],

        'charts' => [
            'responses_by_survey' => 'Responses by Survey Chart',
            'responses_by_question' => 'Responses by Question Chart',
        ],

        'users' => [
            'title' => 'Surveys Answered by User',
            'user_id' => 'User ID',
            'total_surveys' => 'Total Surveys Answered',
        ],
    ]
];
