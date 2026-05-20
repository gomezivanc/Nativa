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
    'validation' => [
        'attributes' => [
          'field_required'=> "Este campo es obligatorio",
          'email_invalid'=> "Por favor ingrese un correo electrónico válido",
          'password_min_length'=> "La contraseña debe tener al menos 8 caracteres",
          'password_pattern'=> "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales",
          'password_mismatch'=> "Las contraseñas no coinciden",
          'password_requirements'=> "La contraseña debe contener:",
          'password_uppercase'=> "Al menos una letra mayúscula",
          'password_lowercase'=> "Al menos una letra minúscula",
          'password_number'=> "Al menos un número",
          'password_special'=> "Al menos un carácter especial (@$!%*?&)",
          'password_length'=> "Al menos 8 caracteres",
        ],
    ],
    'permission' => [
        'title' => 'Permisos',
        'save' => 'Guardar',
        'return' => 'Volver',
        'form' => [
            'name' => 'Permiso',
            'name_module' => 'Nombre del modulo',
            'menu' => 'Nombre del menu',
        ],
        'table' => [
            'name' => 'Permiso',
            'name_module' => 'Nombre del modulo',
            'rol' => 'Rol',
        ],
    ],
    'role' => [
        'title' => 'Roles',
        'titleassign' => 'Asignación de Permisos',
        'module' => 'Modulo :',
        'form' => [
            'name' => 'Rol',
            'description' => 'Descripción'
        ],
        'table' => [
            'name' => 'Rol',
            'description' => 'Descripción'
        ],
    ],
    'menu' =>[
        'title' => 'Menu',
        'titleassign' => 'Assignment of Permits',
        'form' => [
            'title' => 'Titulo',
            'url' => 'URL/Ruta',
            'parent' => 'Padre',
            'type' => 'Tipos',
            'target' => 'Destino',
            'icon' => 'Icono',
        ],
        'table' => [
            'title' => 'Titulo',
            'url' => 'URL/Ruta',
            'parent' => 'Padre',
        ],
    ],
    'user' =>[
        'title' => 'Usuarios',
        'titleassign' => 'Assignment of Permits',
        'clean_signature' => 'Limpiar firma',
        'user_profile'=>'Perfil de usuario',
        'change_Password'=>'Cambio de contraseña',
        'upload'=>'Sube una imagen de tu firma',
        'draw'=>'Dibuja tu firma con el ratón o la pantalla táctil',
        'signatures'=>'Firmas',
        'current_signature'=>'Firma actual:',
        'select_user' => 'Debe seleccionar un usuario para realizar esta acción',
        'form' => [
            'first_name' => 'Nombres',
            'last_name' => 'Apellidos',
            'user' => 'Usuario',
            'role' => 'Rol',
            'email' => 'Correo electronico',
            'person' => 'Persona',
            'document_type' => 'Tipo de documento',
            'id_number' => 'Numero de documento',
            'dependency' => 'Dependencia',
            'password' => 'Contraseña',
            'charge' => 'Cargo',
            'confirm_password' => 'Confirmar contraseña',
            'observations' => 'Observaciones',
            'mechanical_signature' => 'Firma mecánica',
            'physical_signature' => 'Firma física',
            'current_password'=>'Contraseña actual',
            'new_password'=>'Nueva contraseña',
            'regional' => 'Regional',
            'security' => 'Seguridad',
            'access_information' => 'Información de acceso',
            'personal_information' => 'Información personal',
            'edit_user' => 'Editar Usuario',
            'update_user_information' => 'Actualiza la información del usuario'
        ],
        'table' => [
            'name' => 'Nombres',
            'user' => 'Usuario',
            'role' => 'Rol',
            'email' => 'Correo electonico',
            'dependency' => 'Dependencia',
            'regional' => 'Regional'
        ],
    ],



];
