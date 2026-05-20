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
        'title' => 'Listado de espacio físico',
        'save' => 'Guardar',
        'form' => [
            'title1' => 'Datos del edificio',
            'is_exist' => '¿Existe edificio?',
            'name' => 'Edificio',
            'dep_id' => 'Departamento',
            'ciu_id' => 'Municipio',
            'title2' => 'Datos de almacenamiento',

            'floor' => 'Piso',
            'file_area' => 'Area de archivo',
            'rack' => 'Estante',
            'module' => 'Módulo',
            'panel' => 'Entrepaño',
            'box' => 'Caja',
            'type_body_id' => 'Cuerpo',
            'unity_conservation' => 'Unidad de conservación',
            'add_ubi' => 'Agregar +',

            'error' => [
                'floor' => 'No se digito el campo piso'
            ]
        ],
        'table' => [
            'name' => 'Edificio',
            'floor' => 'Piso',
            'file_area' => 'Area de archivo',
            'rack' => 'Estante',
            'module' => 'Módulos',
            'type_body_id' => 'Cuerpo',
            'created_at' => 'Fecha creación',

            'state' => [
                'pending' => 'Pendiente por archivar',
                'archived' => 'Archivado'
            ]
        ],
        'detail' => [
            'process' => 'Procedimiento',
            'type_documents' => 'Tipos documentales',
            'expiration' => 'Vencimiento',
        ]
    ],
    'exp_files' => [
        'detail' => [
            // 'dep_id' => '',
            // 'ciu_id' => '',
            'building' => 'Edificio',
            'floor' => 'Piso',
            'file_area_id' => 'Área de archivo',
            'type' => 'Unidad de conservación',
            'rack' => 'Estante',
            'module' => 'Módulo',
            'panel' => 'Entrepaño',
            'box' => 'Caja',
            'type_body_id' => 'Cuerpo',
            'creado_por_id' => 'Usuario',
            'created_at' => 'Fecha archivo',
            // 'updated_at' => '',
            // 'deleted_at' => '',

            'not_found' => 'Sin especificar',
        ],
        'export' => [
            'title' => 'Rótulo de Caja',
            'box_num' => 'Caja numero',
            'total_unity' => 'No. total unidades',
            '1_unity' => '1 No. unidad',
            'last_no_unity' => '1 No. unidad',
            'dependency' => 'Dependencia',
            'content' => 'Contenido',
            'name' => 'Nombre',
            'code' => 'Código',
            'serie_subserie' => 'Serie / Subserie',
            'responsible_signature' => 'Firma responsable',
            'extreme_date' => 'Fechas extremas',
        ]
    ],
    'disposition_final' => [
        'items_dispo_final_e' => 'Series y subseries documentales de eliminación (E)',
        'items_dispo_final_s' => 'Series y subseries documentales de selección (S)',
        'items_dispo_final_ct' => 'Series y subseries de conservación total (CT)',
        'items_dispo_final_md' => 'Series y subseries documentales de Microfilmación/Digitalización (DM)',
        'table' => [
            'id' => 'ID',
            'number' => 'Número de expediente',
            'name' => 'Nombre de expediente',
            'time_g' => 'Tiempo en gestión',
            'time_c' => 'Tiempo en central',
            'destroy_agn' => 'Aprobación eliminación AGN',
            'state' => 'Estado',
            'dials' => [
                'select' => 'Seleccionar',
                'total_con' => 'Conservación total',
                'approve_delete' => 'Aprobar eliminación',
                'approve_con' => 'Aprobar conservación',
            ],
            'states' => [
                'approve_con' => 'En proceso de aprobación (conservación)',
                'approve_el' => 'En proceso de aprobación (eliminación)',
                'el' => 'Eliminado',
                'con' => 'Conservado',
            ]
        ],
        'radicate_aviable' => 'Este expediente tiene un radicado activo',
        'modal_con' => 'Conservación',
        'modal_delete' => [
            'title' => 'Eliminación',
            'type_delete' => 'Tipo de eliminación',
            'types_delete' => [
                'tru' => 'Trituración',
                'in' => 'Incineración',
                'delete_dig' => 'Borrado Seguro Digital',
                'other' => 'Otro',
            ],
            'observation' => 'Observación',
        ],
        'validate' => [
            'are_sure' => '¿Estás seguro?',
            'are_sure2' => '¿Deseas aprobar esta petición?',
        ]
    ],
    'accumulated_fund' => [
        'form' => [
            'number' => 'Numero',
            'remi_desti_id' => 'Remitente o destinatario del documento',
            'physical_location' => 'Lugar fisico',
            'word' => 'Palabra clave',
            'subject' => 'Asunto del radicado',
            'type_document' => 'Tipo de documento',
            'serie' => 'Serie documental',
            'subserie' => 'Subserie documental',
            'clasification_id' => 'Clasificación',
            'dep_id' => 'Departamento',
            'ciu_id' => 'Ciudad',
            'building' => 'Nombre del espacio fisico',
            'floor' => 'Numero de piso',
            'file_area_id' => 'Ubicación del espacio fisico',
            'type' => 'Tipo',
            'rack' => 'Estante',
            'module' => 'Modulo',
            'panel' => 'Entrepaño',
            'box' => 'Caja',
            'type_body_id' => 'Tipo de cuerpo',
            'creado_por_id' => 'Creado por',
            'created_at' => 'Fecha de creación',
            'state' => 'Estado',
        ],
        'show' => [
            'document' => 'Documento',
            'document_number' => 'Documento',
            'created_at' => 'Creado',
            'id' => 'ID',
            'subject' => 'Asunto',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'code' => 'Código',

            // Información general
            'general_info' => 'Información General',
            'keyword' => 'Palabra Clave',
            'document_type' => 'Tipo de Documento',
            'classification' => 'Clasificación',
            'unity_conservation' => 'Unidad de Conservación',
            'type' => 'Tipo',

            // Retención documental
            'retention_info' => 'Información de Retención',
            'physical_support' => 'Soporte Físico',
            'electronic_support' => 'Soporte Electrónico',
            'years_in_management' => 'Años en Gestión',
            'years_in_central' => 'Años en Central',
            'final_disposition_s' => 'Disposición Final S',
            'final_disposition_md' => 'Disposición Final MD',

            // Ubicación
            'location' => 'Ubicación',
            'geo_location' => 'Ubicación Geográfica',
            'department' => 'Departamento',
            'city' => 'Ciudad',
            'building' => 'Edificio',
            'physical_location' => 'Ubicación Física',
            'floor' => 'Piso',
            'rack' => 'Estante',
            'module' => 'Módulo',
            'panel' => 'Panel',
            'box' => 'Caja',
            'body_type' => 'Tipo de Cuerpo',

            // Remitente
            'sender' => 'Remitente',
            'social_reason' => 'Razón Social',
            'representative' => 'Representante',
            'document_nit' => 'Documento/NIT',
            'address' => 'Dirección',
            'email' => 'Correo Electrónico',
            'phone' => 'Teléfono',

            // Procesos
            'processes' => 'Procesos',
            'subseries_processes' => 'Procesos de Subseries',
            'scanned_filing' => 'Adjuntar Radicado',

            // Metadatos
            'metadata' => 'Metadatos',
            'creator_info' => 'Información del Creador',
            'last_login' => 'Último Login',
            'last_login_ip' => 'IP Último Login',
            'status' => 'Estado',
            'active' => 'Activo',
            'inactive' => 'Inactivo',
            'super_admin' => 'Super Administrador',
            'timestamps' => 'Fechas y Timestamps',
            'created' => 'Creado',
            'updated' => 'Actualizado',
            'deleted' => 'Eliminado',
            'not_deleted' => 'No Eliminado',
        ]
    ]
];
