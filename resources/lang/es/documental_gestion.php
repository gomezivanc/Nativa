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
        'title' => 'Dependencias',
        'save' => 'Guardar',
        'form' => [
            'code' => 'Código de dependencia',
            'name' => 'Nombre dependencia',
            'g_d_parent_id' => 'Unidad administrativa',
            'regional' => 'Regional',
            'trd_charge' => 'TRD cargada',
            'updated_at' => 'Fecha de actualización',
            'ofi_prod' => 'Oficina productora',
            'version' => 'Versión',
            'saved_successfully' => 'Guardado exitosamente',
            'updated_successfully' => 'Actualizado exitosamente',
            'error' => 'Error al guardar',
        ],
        'table' => [
            'code' => 'Código de dependencia',
            'name' => 'Nombre dependencia',
            'g_d_parent_id' => 'Unidad administrativa',
            'trd_active' => 'Trd activa',
            'regional' => 'Regional',
        ],
        'detail' => [
            'retention_years' => [
                'title' => 'Retención Años',
                'a_g' => 'Años de Gestión',
                'a_c' => 'Años Central'
            ],
            'support' => [
                'title' => 'Soporte',
                'p' => 'Papel',
                'e' => 'Electrónico',
                'o' => 'Original'
            ],
            'dis_final' => [
                'title' => 'Disposición Final',
                'CT' => 'CT',
                'E' => 'E',
                'S' => 'S',
                'M' => 'M'
            ],
            'process' => 'Procedimiento',
            'type_documents' => 'Tipos documentales',
            'expiration' => 'Vencimiento',
        ],
        'dial' => [
            'add' => 'Agregar',
            'edit' => 'Editar',
            'delete' => 'Cambiar estado',
            'd_trd' => 'Descargar trd',
            'd_c_doc' => 'Descargar clasificación documental',
            'v_trd' => 'Versionamiento de TRD',
            'c_docs' => 'Carga de documentos',
            'show_trd' => 'Ver TRD activa',
            'show' => 'Ver',
            'cash_register' => 'Rotulo de caja',
            'folder_register' => 'Rotulo de carpeta',

        ],
        'serie' => [
            'clasification' => [
                'code' => 'Código',
                'series_sub_series_t_doc' => 'Series, subseries y tipología documental',
                'items_pro_subseries' => 'Procedimiento',
                'document_classification_chart' => 'CUADRO DE CLASIFICACIÓN DOCUMENTAL',
                'document_management_process' => 'PROCESO GESTIÓN DOCUMENTAL',
                'preparation_document_retention_table' => 'ELABORACIÓN DE TABLA DE RETENCIÓN DOCUMENTAL',
                'date' => 'Fecha',
                'page' => 'Página',

                'background' => 'Fondo',
                'code_administrative_unit' => 'CÓDIGO UNIDAD ADMINISTRATIVA',
                'administrative_unit' => 'UNIDAD ADMINISTRATIVA',
                'production_office_code' => 'CÓDIGO OFICINA PRODUCTORA',
                'production_office' => 'OFICINA PRODUCTORA',
                'serial_code' => 'CÓDIGO SERIE',
                'serie' => 'SERIE',
                'subseries_code' => 'CÓDIGO SUBSERIE',
                'subserie' => 'SUBSERIE'
            ]
        ]
    ],
    'retention' => [
        'title' => 'Retenciones',
        'table' => [
            'dependency' => 'Dependencia',
            'name' => 'Nombre',
            'code' => 'Código',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'type_doc' => 'Tipo documental',
            'archivo_gestion' => 'Archivo de gestión (AG)',
            'archivo_central' => 'Archivo central (AC)',
            'support_documental' => 'Soporte documental',
            'time_retention' => 'Tiempo de retención',
            'final_disposition' => 'Disposición final',
            'paper' => 'Papel',
            'electronic' => 'Electrónico',
            'elimination' => 'Eliminación',
            'conservation_total' => 'Conservación total',
            'selection' => 'Selección',
            'procedure' => 'Procedimiento',
            'digitalization_micro' => 'Digitalización/Microfilmación',
            'procedure_description' => 'Descripción del procedimiento',
            'description' => 'Descripción',
            'save' => 'Guardar',
            'saving' => 'Guardando',
            'cancel' => 'Cancelar',
            'documentary_series' => 'Series documentales',

        ]
    ],
    'charge_trd' => [
        'title' => 'Carga de trd',
        'save' => 'Cargar',
        'charge' => 'Cargar archivo',
        'messages_success' => [
            'header' => 'Archivo cargado de forma correcta, se procesaron $pages hojas.',
            'new' => 'Se creo una nueva version para la dependencia $num_trd',
            'replace' => 'La dependencia ya tiene una TRD configurada y activa desde el dia $date_trd. Se procesedera a crear una nueva versión de la dependencia, la cual debe ser aprobada por el responsable de la gestión por favor dirijase al modulo de versionamiento para aprobar la versión de la TRD.',
        ]
    ],
    'error_change_state' => 'No se puede cambiar de estado ya que la dependencia esta activa en otro registro',
    'trd_versioning' => [
        'title' => 'Listado de versionamientos TRD temporales',
        'table' => [
            'dependency' => 'Dependencia',
            'serie' => 'Serie',
            'Subserie' => 'Subserie',
            'type_doc' => 'Tipo documental',
            'created_at' => 'Fecha creación',
        ],
        'save' => 'Cargar',
    ],
    'exp_files' => [
        'title' => 'Listado de expedientes',
        'title_create' => 'Nuevo expediente',
        'title_edit' => 'Editar expediente',
        'save' => 'Guardar',
        'add' => 'Agregar',
        'dialogs' => [
            'reference' => 'Referencia cruzada',
            'confirm_dialog_lock' => '¿Estás seguro?',
            'confirm_dialog_lock_text' => 'Recuerde que el tiempo de retención empieza a correr cuando se cierra el expediente ¿está seguro que desea cerrarlo?',
            'reference_form' => [
                'name_middle' => 'Nombre del medio',
                'quantity' => 'Cantidad',
                'anex' => 'Seleccione los tipos de anexo fisico',
                'ubication' => 'Ubicación',
            ],
            'close' => 'Cerrar expediente',
            'charge_doc' => 'Cargar documento',
            'close_form' => [
                'observation' => 'Observación',
                'password' => 'Contraseña',
                'message_error_login' => 'La contraseña es incorrecta',
            ],
            'charge_docs' => [
                'charge_docs' => 'Carga de documentos',
                // 'type_doc_id' => 'Tipo documental',
                'support_type_id' => 'Tipo de soporte',
                'date' => 'Fecha de documento',
                'error_format_file' => 'El archivo debe estar en formato PDF',
                'description' => 'Descripción',
                'is_public' => '¿Es público?',
                'file' => 'Seleccione el archivo',
                'classification' => [
                    'page_classification' => 'Clasificación por páginas',
                    'page_start' => 'Página inicial',
                    'page_end' => 'Página final',
                    'add_classification' => 'Agregar clasificación',
                    'remove_classification' => 'Eliminar clasificación',
                    'type_doc_id' => 'Tipo documental',
                    'error_min_classification' => 'El archivo :index debe tener al menos una clasificación.',
                    'validation_page_range' => 'La página final no puede ser menor que la inicial',
                ],
                'segment_page_end_less_start' => "La página final no puede ser menor que la inicial.",
                'segment_page_start_less_one' => "La página inicial no puede ser menor que 1.",
                'segment_page_end_exceeds_total' => "El PDF solo tiene :total_pages páginas.",
                'segment_pages_overlap' => "Los rangos de páginas se cruzan."
            ]
        ],
        'success_messages' => [
            'transfer' => 'Estado actualizado del expediente {num_exp} - {name_exp}',
            'transfer_reject' => 'Estado actualizado del expediente {num_exp} - {name_exp}',
            'transfer_accept' => '',
        ],
        'table_control' => [
            'code' => 'Código de oficina productora',
            'name' => 'Oficina productora',
            'code_serie' => 'Codigo serie',
            'serie' => 'serie',
            'code_subserie' => 'Código subserie',
            'subserie' => 'Subserie',
            'access' => 'Accesos',
            'rol' => 'Rol',
            'state' => 'Estado',
        ],
        'table' => [
            'number' => 'N. expediente',
            'name' => 'Nombre',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'serie_name' => 'Serie',
            'subserie_name' => 'Subserie',
            'date_init' => 'Fecha inicio expediente',
            'created_at' => 'Creación',
            'time_gestion' => 'Tiempo en gestión',
            'time_central' => 'Tiempo en central',
            'space' => 'Espacio fisico',
            'description' => 'Descripción',
            'index' => 'Índices',
            'dependency_id' => 'Dependencia',
            'creado_por_id' => 'Usuario creador',
            'clasification_id' => 'Clasificación',
            'type_archive' => 'Tipo de archivo',
            'type_archive_state' => [
                'first' => 'Gestión - primera ubicación',
                'second' => 'Central - segunda ubicación',
            ],
            'actions' => 'Acciones',

            'state_transfer' => [
                0 => 'Activo',
                1 => 'Pendiente por transferir',
                2 => 'Transferencia aceptada',
                3 => 'Transferencia rechazada',
            ],
            'space_states' => [
                'not_assigned' => 'Espacio fisico no asignado',
                'assigned' => 'Espacio fisico asignado',
            ],

            'modal_transfer' => [
                'title' => 'Transferencia manual',
                'title_reject' => 'Rechazar transferencia',
                'observation' => 'Observación',
            ],

            'dials' => [
                'reference_crusade' => 'Referencia cruzada',
                'close' => 'Cerrar expediente',
                'charge_docs' => 'Cargar documentos',
                'sub_exp' => 'Agregar sub expediente',
                'historic_export' => 'Exportar historico',
                'control_papper' => 'Hoja de control',
                'package_files' => 'Descargar paquete de documentos',
                'archive_exp' => 'Archivar expediente',
                'transfer' => 'Transferir',
                'transfer_accept' => 'Aceptar transferencia',
                'reject_accept' => 'Rechazar transferencia',
                'download_fuid' => 'Descarga de FUID',
            ]
        ],
        'form' => [
            'name' => 'Nombre del expediente',
            'name_generated' => 'Nombre generado del expediente',
            'not_generated' => 'Aún no se genera el nombre',
            'date_init' => 'Fecha de inicio del expediente',
            'exist_p' => '¿Existe fisicamente?',
            'description' => 'Descripción',
            'book' => 'Libro',
            'shelf' => 'Estante',
            'file_box' => 'Caja de archivo',
            'serie' => 'Serie',
            'subserie' => 'Subserie',
            'clasification_id' => 'Clasificación',
            'types_control' => 'Tipos de control',

            'dependency' => 'Dependencias que hacen parte de la gestión del expediente',
            'dependency_id' => 'Dependencia',
            'responsible' => 'Responsable',
            'responsible_id' => 'Funcionario',

            'new_sub_exp' => 'Nuevo Subexpediente',
            'add_subfile' => 'Agregar Subexpediente',
            'sub_exp' => 'Agregar Subexpediente',

            'state' => [
                'inactive' => 'Cerrado',
                'active' => 'Abierto'
            ],
        ],
        'detail' => [
            'index_elec' => 'Documentos cargados',
            'logs' => 'Trazabilidad',
            'documents_exp' => 'Documentos de expediente',
            'detail_exp' => 'Detalle de expediente',
            'code' => 'Código',
            'support' => 'Soporte',
            'state' => 'Estado',
            'name' => 'Nombre del Expediente',
            'final_disposition' => 'Disposición Final',
            'ubication' => 'Ubicación',
            'subject_administrative_matter' => 'Tema o asunto Administrativo',
            'years_retention' => 'Años en retención',
            'administrative_unit_responsible' => 'Unidad administrativa responsable',
            'last_loan' => 'Último préstamo',
            'file_start_date' => 'Fecha inicio del expediente',
            'physically_exist' => '¿Existe físicamente?',
            'serie' => 'Serie',
            'created_at' => 'Fecha de creación',
            'units_involved_file_management' => 'Dependencias que hacen parte de la gestión del expediente',
            'Subserie' => 'Subserie',
            'responsible_issuer' => 'Autor o emisos responsable',
            'ranking' => 'Clasificación',

            'filters_documents' => [
                'description' => 'Descripción del documento',
                'type_doc' => 'Tipo documental',
            ],

            'table_documents' => [
                'index' => 'Indice',
                'content_index' => 'Índice contenido',
                'document_name' => 'Nombre documento',
                'document_type' => 'Tipo documental',
                'document_date' => 'Fecha documento',
                'document_support' => 'Tipo de soporte',
                'document_responsible' => 'Responsable',
                'document_sequential' => 'Consecutivo Documento',
                'without_segments' => 'Sin segmentos',
                'document_segments' => 'Segmentos del documento',
                'date_inclusion' => 'Fecha de inclusión',
                'fingerprint_value_document' => 'Valor de huella',
                'document_order_pg' => 'Orden documento',
                'start_page' => 'Pág. Inicio',
                'end_page_format' => 'Pág. Final',
                'format' => 'Formato',
                'size' => 'Tamaño',
                'origin' => 'Origen',

                // PRIMERA TABLA

                'num_radicate' => 'Numero de radicado',
                'document' => 'Documento',
                'description' => 'Descripción',
                'date_document' => 'Fecha documento',

                'dials' => [
                    'download' => 'Descargar',
                    'show' => 'Ver',
                    'exclude_files' => 'Excluir documentos',
                    'question_deactivate' => '¿Desea excluir los documentos del expediente?',
                    'question_deactivate_body' => 'Se eliminaran los documentos del expediente'
                ]
            ],
        ]
    ],
];
