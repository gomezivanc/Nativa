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

    'distribution_shipping' => [
        'title' => 'Distribución y Envió',
        'status_successfully_changed' => 'Estado cambiado con éxito',
        'table' => [
            'types_filing' => 'Tipo de radicado',
            'number_filing' => 'Numero de radicado',
            'creation_date' => 'Fecha de creación',
            'client' => 'Cliente',
            'subject' => 'Asunto',
            'documental_type' => 'Tipo documental',
            'due_date' => 'Fecha de vencimiento',
            'priority' => 'Prioridad',
            'document' => 'Documento',
            'permission_file' => 'Clasificación de confidencialidad',
        ],
        'form' => [
            'regional' => 'Regional',
            'provider' => 'Proveedor',
            'active_service' => 'Servicio activo',
            'tracking_number' => 'Número de guía',
            'observation' => 'Observación',
            'shipping_receipt' => 'Soporte de envío',
        ],
        'options_speed_dial' => [
            'send_filing' => 'Enviar radicado',
        ],

        'distribution_shipping_status' => [
            'pending_delivery' => 'Pendiente por entregar',
            'pending_delivery_Ac' => 'Pendiente por Acuse',
            'Charged_acknowledgment' => 'Acuse cargado',
            'returned' => 'Devuelto',
            'delivered' => 'Entregado',
            'ready_ship' => 'Listo para enviar',
        ],
    ],
    'massive_reassignment' => [
        'title' => 'Reasgnación masiva',
        'table' => [
            'types_filing' => 'Tipo de radicado',
            'number_filing' => 'Numero de radicado',
            'creation_date' => 'Fecha de creación',
            'client' => 'Cliente',
            'subject' => 'Asunto',
            'documental_type' => 'Tipo documental',
            'due_date' => 'Fecha de vencimiento',
            'priority' => 'Prioridad',
            'document' => 'Documento',
            'permission_file' => 'Clasificación de confidencialidad',
        ],
        'form' => [
            'regional' => 'Regional',
            'provider' => 'Proveedor',
            'active_service' => 'Servicio activo',
            'tracking_number' => 'Número de guía',
            'observation' => 'Observación',
            'shipping_receipt' => 'Soporte de envío',
        ],
    ],
    'cancellation_request' => [
        'title' => 'Anulación',
        'state_succesfully'=>'Estado de radicado cambiado con éxito',
        'table' => [
            'types_filing' => 'Tipo de radicado',
            'number_filing' => 'Numero de radicado',
            'cancellation_request_status'=>'Estado de solicitud de anulación',
            'date_request'=>'Fecha de petición',
            'observation' => 'Observación',
            'user' => 'Usuario solicitante',  
        ],
        'form' => [
            'observation' => 'Observación',
        ],
        'options_speed_dial' => [
            'acept' => 'Aceptar solicitud',
            'deny' => 'Denegar solicitud',
        ],
        'cancellation_request_status' => [       
            'acepted' => 'Aceptación de anulación',
            'rejection' => 'Rechazo de anulación',
            'waiting_answer' => 'Solicitud anulación',
        ]
    ],


];
