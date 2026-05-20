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
        'title' => 'Distribution and shippings',
        'status_successfully_changed'=> 'Status successfully changed',
    

       
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
            'permission_file' => 'Confidentiality classification',
        ],
        'form' => [
            'regional' => 'Regional',
            'provider' => 'Provider',
            'active_service' => 'Active service',
            'tracking_number'=>'Tracking number',
            'observation' => 'Observation',
            'shipping_receipt'=>'Shipping receipt'            
        ],
        'options_speed_dial' => [
            'send_filing' => 'Send filing'           
        ],               
        'distribution_shipping_status'=>[
            'pending_delivery'=>'Pending delivery',
            'returned'=>'Returned',
            'delivered'=>'Delivered',
            'ready_ship'=>'Ready to ship',
        ],
    ],
    'massive_reassignment'=>[
        'title' => 'Massive Reassignment',
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
            'permission_file' => 'Confidentiality classification',
        ],
        'form' => [
            'regional' => 'Regional',
            'provider' => 'Provider',
            'active_service' => 'Active service',
            'tracking_number'=>'Tracking number',
            'observation' => 'Observation',
            'shipping_receipt'=>'Shipping receipt'            
        ],
    ],
    'cancellation_request'=>[
        'title' => 'Cancellation',
        'table' => [
            'types_filing' => 'Types filing',
            'number_filing' => 'Number filing',
            'cancellation_request_status'=>'Cancellation request status',
            'date_request'=>'Date request',
            'observation' => 'Observation',
            'user' => 'Requesting user',
           
        ],
        'form' => [
            'observation' => 'Observation',
                    
        ],
        'options_speed_dial' => [
            'acept' => 'Accept solicitud',
            'deny ' => 'Deny request',
        ],
        'cancellation_request_status' => [
            'acepted' => 'Cancellation acceptance',
            'rejection' => 'Cancellation rejection',
            'waiting_answer' => 'Cancellation request', 
        ]
    ],
   
];
