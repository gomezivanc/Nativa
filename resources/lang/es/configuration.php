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
        'title' => 'Listado de configuración de cargas TRD',
        'head1' => 'Configuración inicial carga TRD',
        'save' => 'Guardar',
        'dispatch' => 'Despachar',
        'update' => 'Actualizar',
        'form' => [
            'conf_mask_trd_id' => 'Seleccion de mascara',
            'dependency_code' => 'Celda Codigo de la Dependencia',
            'dependency_name' => 'Celda Nombre de la Dependencia',
            'unity_admin' => 'Celda Unidad Administrativa',
            'has_regional' => 'Tiene regional',
            'regional' => 'Celda Regional',
            'init_data' => 'Celda Inicio de Datos',
            'code_trd' => 'Celda Codigo de trd o dependencia',
            'series_sub_series_t_doc' => 'Celda Nombre serie, subserie y tipo documental',
            'items_year_gestion' => 'Celda Años en el archivo de Gestión',
            'items_year_central' => 'Celda Años en el archivo central',
            // 'items_dispo_final' => 'Item disposición final',
            'items_dispo_final_ct' => 'Celda Disposición final Conservación Total',
            'items_dispo_final_e' => 'Celda Disposición final Eliminación',
            'items_dispo_final_s' => 'Celda Disposición final Selección',
            'items_dispo_final_md' => 'Celda Disposición final Microfilmación/ Digitalización',
            'items_pro_subseries' => 'Celda Procedimientos de subserie',
            'conf_days_term' => 'Configuracion dias de termino',
            'days_conf_days_term' => 'Celda Dias Termino Tipo Documental',
            'has_standard' => 'Tiene norma',
            'Has_standard' => 'Tiene norma',
            'item_standard' => 'Celda Items Normas',
            'Has_support' => 'Tiene soporte',
            'item_support_p' => 'Celda Soporte-papel',
            'item_support_e' => 'Celda Soporte-electrónico',
            'item_support_o' => 'Celda Soporte-otro',
            'serie' => 'Celda Serie',
            'subserie' => 'Celda Subserie',

            //////////
            'mask_name' => 'Nombre mascara',
        ],
        'table' => [
            'mask' => 'Máscara',
            'dependency_code' => 'Codigo de la Dependencia',
            'unity_admin' => 'Unidad Administrativa',
            'dependency_name' => 'Nombre de la Dependencia',
            'regional' => 'Regional',
            'init_data' => 'Inicio de Datos',
            'code_trd' => 'Columna código de dependecia',
            'series_sub_series_t_doc' => 'Columna código serie',
            'series_sub_series_t_doc' => 'Columna código subserie',
            'series_sub_series_t_doc' => 'Columna Nombre de la Dependencia',
            'item_standard' => 'Columna norma',
            'item_support_p' => 'Columna soporte P',
            'item_support_e' => 'Columna soporte E',
            'item_support_o' => 'Columna soporte O',
        ],
    ],
    'provider' => [
        'title' => 'Configuración Proveedores de Envio',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre del proveedor',
            'conf_services_provider_id' => 'Servicio',
            'regional_id' => 'Regional',
            'ciu_id' => 'Ciudad',
        ],
        'table' => [
            'name' => 'Nombre del proveedor',
            'conf_services_provider_id' => 'Servicio',
            'regional_id' => 'Regional',
            'dep_id' => 'Departamento',
            'ciu_id' => 'Ciudad',
        ],
        'show' => [
            'title' => 'Detalles del Registro',
            'id' => 'ID',
            'basic_info' => 'Información Básica',
            'name' => 'Nombre',
            'provider_id' => 'ID Proveedor de Servicios',
            'created_by' => 'Creado por',
            'regional_id' => 'ID Regional',
            'temporal_info' => 'Información Temporal',
            'created_at' => 'Fecha de Creación',
            'updated_at' => 'Última Actualización',
            'deleted_at' => 'Fecha de Eliminación',
            'not_deleted' => 'No eliminado',
            'service_panel' => 'Servicio',
            'service_name' => 'Nombre del Servicio',
            'service_id' => 'ID del Servicio',
            'service_created_at' => 'Fecha de Creación',
            'service_updated_at' => 'Última Actualización',
            'regional_panel' => 'Información Regional',
            'regional_sigla' => 'Sigla',
            'regional_name' => 'Nombre Regional',
            'regional_id_text' => 'ID',
            'country_id' => 'País ID',
            'departament_id' => 'Departamento ID',
            'city_id' => 'Ciudad ID',
            'regional_created_by' => 'Creado por',
            'regional_created_at' => 'Fecha de Creación',
        ]
    ],
    'users_group' => [
        'title' => 'Grupos de Usuarios',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre del grupo',
            'g_d_dependency_id' => 'Dependencia',
            'users_group' => 'Seleccionar usuarios',
            'created_at' => 'Creado el',
        ],
        'table' => [
            'name' => 'Nombre del grupo',
            'g_d_dependency_id' => 'Dependencia',
            'created_at' => 'Creado el',
            'users_group' => 'Usuarios',
        ],
        'show' => [
            'title' => 'Grupo',
            'group_id' => 'Grupo ID',
            'basic_info' => 'Información Básica',
            'group_name' => 'Nombre del Grupo',
            'created_by' => 'Creado por',
            'total_users' => 'Total Usuarios',
            'total_dependencies' => 'Total Dependencias',
            'temporal_info' => 'Información Temporal',
            'created_at' => 'Fecha de Creación',
            'updated_at' => 'Última Actualización',
            'deleted_at' => 'Fecha de Eliminación',
            'not_deleted' => 'No eliminado',
            'users_tab' => 'Usuarios',
            'dependencies_tab' => 'Dependencias',
            'no_users_found' => 'No se encontraron usuarios',
            'no_dependencies_found' => 'No se encontraron dependencias',
            'user_details' => 'Detalles del Usuario',
            'close' => 'Cerrar',
            'email' => 'Email',
            'status' => 'Estado',
            'active' => 'Activo',
            'inactive' => 'Inactivo',
            'last_login' => 'Último Login',
            'last_login_ip' => 'IP Último Login',
            'login_attempts' => 'Intentos de Login',
            'dependency_id' => 'ID Dependencia',
            'observations' => 'Observaciones',
        ]
    ],
    'hours_work' => [
        'title' => 'Horario laboral',
        'save' => 'Guardar',
        'form' => [
            'day_of_week_init' => 'Día inicio',
            'day_of_week_end' => 'Día fin',
            'init_work_hour' => 'Horario inicio',
            'end_work_hour' => 'Horario finalización',
        ],
        'table' => [
            'day_of_week_init' => 'Día inicio',
            'day_of_week_end' => 'Día fin',
            'init_work_hour' => 'Horario inicio',
            'end_work_hour' => 'Horario finalización',
            'created_at' => 'Creado el',
        ],
        'show' => [
            'title' => 'Horario Laboral',
            'id' => 'ID',
            'current_status' => 'Estado Actual',
            'within_schedule' => 'Dentro del horario laboral',
            'outside_schedule' => 'Fuera del horario laboral',
            'active' => 'Activo',
            'inactive' => 'Inactivo',
            'progress' => 'Progreso de la jornada laboral',
            'working_days' => 'Días Laborales',
            'working_days_range' => 'Días laborales:',
            'schedule' => 'Horario',
            'total_duration' => 'Duración total:',
            'additional_info' => 'Datos Del Remitente',
            'created_by' => 'Creado por',
            'created_at' => 'Fecha de Creación',
            'updated_at' => 'Última Actualización',
            'json_dialog_title' => 'Datos JSON del Horario',
            'close' => 'Cerrar',
        ]
    ],
    'hours_not_work' => [
        'title' => 'Días no laborales',
        'create_title' => 'Crear día no laboral',
        'edit_title' => 'Editar día no laboral',
        'form' => [
            'date' => 'Fecha del día no laboral',
            'day_of_week' => 'Día de la semana',
            'reason' => 'Motivo del día no laboral',
            'is_recurring' => '¿Se repite cada año?',
        ],
        'fields' => [
            'date' => 'Fecha',
            'day_of_week' => 'Día de la semana',
            'is_recurring' => 'Recurrente',
            'reason' => 'Motivo',
            'created_by' => 'Creado por',
            'created_at' => 'Creado el',
            'updated_at' => 'Actualizado el',
            'deleted_at' => 'Eliminado el',
            'not_deleted' => 'No eliminado',
        ],
        'yes' => 'Yes',
        'no' => 'No',
        'table' => [
            'date' => 'Fecha',
            'day_of_week' => 'Día de la semana',
            'reason' => 'Motivo',
        ]
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
    'payroll_management' => [
        'title' => 'Gestión de planillas',
        'code' => 'Codigo',
        'regional' => 'Regional',
        'dependence' => 'Dependencia',
        'worksheet' => 'Planilla',
        'template_code' => 'Codigo plantilla',
        'version' => 'Version',
        'creation_date' => 'Fecha De Creación',
        'template_name' => 'Nombre Plantilla',
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
    'procedure_management' => [
        'title' => 'Gestión de Tramites',
        'create_title' => 'Crear tramite',
        'edit_title' => 'Editar tramite',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre Tramite',
            'response_time' => 'Tiempo de respuesta',
        ],
        'table' => [
            'name' => 'Nombre Tramite',
            'response_time' => 'Tiempo de respuesta',
        ],
        'fields' => [
            'days'        => 'Días Habiles',
            'created_at'  => 'Creado el',
            'updated_at'  => 'Actualizado el',
            'deleted_at'  => 'Eliminado el',
            'not_deleted' => 'No eliminado',
        ],
        'error' => [
            'same_name'  => 'Ya existe un trámite activo con ese nombre'
        ]
    ],
    'variables_templates' => [
        'title' => 'Variables de planillas',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre variable ${xxx}',
            'description' => 'Descripción variable',
        ],
        'table' => [
            'name' => 'Nombre variable ${xxx}',
            'description' => 'Descripción',
        ],
    ],
    'user_interoperability' => [
        'title' => 'Usuario interoperabilidad',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre',
            'email' => 'Correo electronico',
            'document' => 'Documento o NIT',
            'type_document_id' => 'Seleccione tipo de identificación',
            'token' => 'Token',
            'dependency_id' => 'Dependencia',
        ],
        'table' => [
            'name' => 'Nombre',
            'email' => 'Correo electronico',
            'document' => 'Documento o NIT',
            'token' => 'Token',
            'type_document_id' => 'Tipo de identificación',
            'created_at' => 'Fecha de creación',
            'dependency_id' => 'Dependencia',
        ],
    ],
    'satisfaction_survey' => [
        'title' => 'Encuesta de satisfacción',
        'save' => 'Guardar',
        'form' => [
            'name' => 'Nombre',
            'add' => 'Agregar',
            'questions_count' => 'Numero de preguntas',
        ],
        'table' => [
            'name' => 'Nombre',
            'num_questions' => 'Numero de preguntas',
            'questions_count' => 'Numero de preguntas',
        ],
    ],
    'regional' => [
        'title' => 'Regional',
        'save' => 'Guardar',
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
        'title' => 'Tipo de radicado',
        'save' => 'Guardar',
        'form' => [
            'code' => 'Código de tipo radicado',
            'name' => 'Nombre de tipo radicado',
            'creator_date' => 'Fecha de creación',
            'description' => 'Descripción',
        ],
        'table' => [
            'code' => 'Código de tipo radicado',
            'name' => 'Nombre de tipo radicado',
            'creator_date' => 'Fecha de creación',
        ],
    ],
    'filling_setting' => [
        'title' => 'Configuración del radicado',
        'save' => 'Guardar',
        'form' => [
            'dependency_length' => 'Longitud de dependencia',
            'filling_structure' => 'Estructura del radicado',
            'consecutive_length' => 'Longitud de consecutivo',
        ],
        'table' => [
            'dependency_length' => 'Longitud de dependencia',
            'filling_structure' => 'Estructura del radicado',
            'consecutive_length' => 'Longitud de consecutivo',
            'creator_date' => 'Fecha de creación',

        ],
    ],
    'radication_label' => [
        'title' => 'Etiquetas de radicación',
        'save' => 'Guardar',
        'form' => [
            'label' => 'Etiqueta',
            'description' => 'Descripción',
            'date' => 'Fecha',
        ],
        'table' => [
            'label' => 'Etiqueta',
            'description' => 'Descripción',
            'date' => 'Fecha',
        ],
    ],
    'dashboard_survey' => [
        'title' => 'Reporte de Encuestas',
        'subtitle' => 'Visualización de datos de encuestas de satisfacción',

        'surveys' => [
            'title' => 'Encuestas y Respuestas',
            'survey_id' => 'ID Encuesta',
            'total_responses' => 'Respuestas Totales',
        ],

        'questions' => [
            'title' => 'Respuestas Agrupadas por Pregunta',
            'question_id' => 'ID Pregunta',
            'response' => 'Respuesta',
            'count' => 'Cantidad',
        ],

        'average' => [
            'title' => 'Promedio de Respuestas por Encuesta',
            'avg_responses' => 'Promedio de Respuestas',
        ],

        'charts' => [
            'responses_by_survey' => 'Gráfico de Respuestas por Encuesta',
            'responses_by_question' => 'Gráfico de Respuestas por Pregunta',
        ],

        'users' => [
            'title' => 'Encuestas Respondidas por Usuario',
            'user_id' => 'ID Usuario',
            'total_surveys' => 'Total Encuestas Respondidas',
        ],
    ]
];
