<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'not_found' => 'No se encuentran registros',
    'back' => 'Atrás',
    'state_table' => 'Estado',
    'search' => 'Buscar',
    'clean' => 'Limpiar',
    'next' => 'Siguiente',
    'start_end' => [
        'start' => 'Incio',
        'cancel' => 'Cancelar',
        'end' => 'Fin',
    ],
    'login' => [
        'login' => 'Iniciar sesión',
        'user' => 'Usuario',
        'password' => 'Contraseña',
        'remember_passsword' => '¿Olvidaste tu contraseña?',
        'enter' => 'Ingresar',
    ],
    'signed_document' => 'Documento firmado correctamente',
    'document_signing_error' => 'Error al firmar el documento',
    'code_verify' => [
        'code_verify' => 'Validación Código de Verificación',
        'validate' => 'Validar codigo',
        'time_code' => 'Tiempo Restante Para Reenviar Código',
        'logout' => 'Cerrar sesión'
    ],
    'filters' => 'Filtros',
    'init_date' => 'Fecha inicio',
    'end_date' => 'Fecha fin',
    'success' => 'Guardado con exito',
    'not_assigned' => 'No asignado',
    'send_mail' => 'Correo enviado satisfactoriamente',
    'error' => 'Ups... ocurrió un error',
    'select_all' => 'Seleccionar todo',
    'select_opcion' => 'Seleccione una opción',
    'no_data' => 'No se encontraron resultados para la búsqueda.',
    'mail_sent' => 'Correo enviado con exito',
    'download' => ' Descargar',
    'description' => 'Descripción',
    'state' => [
        'active' => 'Activo',
        'inactive' => 'Inactivo',
    ],
    'priority' => [
        'high' => 'Alta',
        'low' => 'Baja',
    ],
    'max_length' => 'Limite de caracteres',
    'yes_not' => [
        'yes' => 'Si',
        'no' => 'No',
    ],
    'day_of_weeks' => [
        'monday' => 'Lunes',
        'tuesday' => 'Martes',
        'wednesday' => 'Miércoles',
        'thursday' => 'Jueves',
        'friday' => 'Viernes',
        'saturday' => 'Sábado',
        'sunday' => 'Domingo',
    ],
    'exports' => [
        'print' => 'IMPRIMIR'
    ],
    'confirmation_delete' => [
        'question_deactivate' => '¿Desea desactivar el registro?',
        'question_activate' => '¿Desea activar el registro?',
        'success' => 'Realizado con exito'
    ],
    'company' => [
        'profile_title' => 'Perfil Corporativo',
        'edit_info' => 'Editar información',
        'web' => 'Sitio web',
        'save_changes' => 'Guardar cambios',
        'cancel' => 'Cancelar',
        'update_success' => 'Información actualizada',
        'update_success_detail' => 'Los datos de la empresa han sido actualizados correctamente.',
        'update_logo' => 'Actualizar logotipo',
        'update_logo_success' => 'El logotipo corporativo ha sido actualizado',
        'cancel_operation' => 'Operación cancelada',
        'cancel_operation_detail' => 'No se han realizado cambios en la información.',

        'general_info' => 'Información general de la empresa',
        'contact_info' => 'Información de contacto',
        'location' => 'Ubicación',

        'razon_social' => 'Razón Social',
        'nit' => 'NIT',
        'description' => 'Descripción',
        'data_processing' => 'Politica tratamiento datos',
        'address' => 'Dirección',
        'city' => 'Ciudad',
        'country' => 'País',
        'phone' => 'Teléfono',
        'email' => 'Correo electrónico',
        'website' => 'Sitio web',
        'industry' => 'Industria',
        'foundation' => 'Año de fundación',

        'select_country' => 'Seleccione un país',
        'select_industry' => 'Seleccione una industria',

        'countries' => [
            'colombia' => 'Colombia',
            'mexico' => 'México',
            'argentina' => 'Argentina',
            'spain' => 'España',
            'chile' => 'Chile',
            'peru' => 'Perú',
        ],

        'industries' => [
            'finance' => 'Servicios Financieros',
            'tech' => 'Tecnología',
            'health' => 'Salud',
            'education' => 'Educación',
            'manufacturing' => 'Manufactura',
            'commerce' => 'Comercio',
        ],

        'last_update' => 'Última actualización: :date',
    ],

    // formulario
    'users' => [
        'users' => 'Usuarios',
        'search' => "Buscar",
        'table' => [
            'names' => 'Nombre',
            'user' => 'Usuario',
            'email' => 'Email',
            'rol' => 'Rol',
            'super_admin' => 'Super admin',
            'actions' => 'Acciones',
            'state' => 'Estado',
            'create' => 'Crear',
        ],
        'table_apps' => [
            'app' => 'Tenant',
            'actions' => 'Acciones',
            'type' => 'Tipo de aplicación',
            'state' => 'Estado',
            'add' => 'Agregar',
        ],
        'form' => [
            'person' => 'Persona',
            'user' => 'Usuario',
            'name' => 'Nombre',
            'last_name' => 'Apellidos',
            'type_doc' => 'Tipo de Documento',
            'num_doc' => 'Número de documento',
            'rol' => 'Rol',
            'password' => 'Contraseña',
            'reset_password' => 'Restablecer Contraseña',
            'dependency' => 'Dependencia',
            'email' => 'Email',
            'confirm_password' => 'Confirmar contraseña',
            'obs' => 'Observaciones',
            'create' => 'Crear',
            'edit' => 'Editar',
            'pass_message' => 'La contraseña debe contener',
            'hasMinimumLength' => 'Mínimo 12 caracteres',
            'hasLowercase' => 'Una letra minúscula',
            'hasUppercase' => 'Una letra mayúscula',
            'hasNumber' => 'Un número',
            'hasSpecial' => 'Un carácter especial',
            'change' => 'Cambiar Contraseña'
        ],
        
    ],

    'recovery' => [
        'recovery' => 'Recuperación',
        'recovery_message' => 'Mensaje de recuperación',
        'email' => 'Correo',
        'send' => 'Enviar',
        'back_login' => 'Volver a inciar sesión',
        'click_here' => 'Haga clic aqui',
    ]
];
