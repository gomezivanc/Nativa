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
            'field_required' => 'This field is required',
            'email_invalid' => 'Please enter a valid email address',
            'password_min_length' => 'Password must be at least 8 characters',
            'password_pattern' => 'Password must include uppercase, lowercase, number and special character',
            'password_mismatch' => 'Passwords do not match',
            'password_requirements' => 'Password must contain:',
            'password_uppercase' => 'At least one uppercase letter',
            'password_lowercase' => 'At least one lowercase letter',
            'password_number' => 'At least one number',
            'password_special' => 'At least one special character (@$!%*?&)',
            'password_length' => 'At least 8 characters',
        ],
    ],
    'permission' => [
        'title' => 'Permissions',
        'save' => 'Save',
        'return' => 'Return',
        'form' => [
            'name' => 'Permission',
            'name_module' => 'Name module',
            'menu' => 'Name menu',
        ],
        'table' => [
            'name' => 'Permission',
            'name_module' => 'Name module',
            'menu' => 'Name menu',
        ],
    ],
    'role' => [
        'title' => 'Role',
        'titleassign' => 'Assignment of Permits',
        'module' => 'Module :',
        'form' => [
            'name' => 'Role',
            'description' => 'Description'
        ],
        'table' => [
            'name' => 'Role',
            'description' => 'Description'
        ],
    ],
    'menu' =>[
        'title' => 'Menu',
        'titleassign' => 'Assignment of Permits',
        'form' => [
            'title' => 'Title',
            'url' => 'URL/Route',
            'parent' => 'Parent',
            'type' => 'Type',
            'target' => 'Target',
            'icon' => 'Icon',
        ],
        'table' => [
            'title' => 'Title',
            'url' => 'URL/Route',
            'parent' => 'Parent'
        ],
    ],
    'user' =>[
        'title' => 'User',
        'titleassign' => 'Assignment of Permits',
        'clean_signature' => 'Clean signature',
        'user_profile'=>'User Profile',
        'change_Password'=>'Change Password',
        'upload'=>'Upload an image of your signature',
        'draw'=>'Draw your signature using your mouse or touch screen',
        'signatures'=>'Signatures',
        'current_signature'=>'Current Signature',
        'select_user' => 'You must select a user to perform this action.',
        'form' => [
            'first_name' => 'First name',
            'last_name' => 'Last name',
            'user' => 'User',
            'role' => 'Role',
            'email' => 'Email',
            'person' => 'Person',
            'document_type' => 'Document type',
            'id_number' => 'ID number',
            'dependency' => 'Dependency',
            'password' => 'Password',
            'charge' => 'Charge',
            'confirm_password' => 'Confirm password',
            'observations' => 'Observations',
            'mechanical_signature' => 'Mechanical signature',
            'physical_signature' => 'Physical signature',
            'current_password'=>'Current Password',
            'new_password'=>'New Password',
            'regional' => 'Regional',
            'security' => 'Security',
            'access_information' => 'Access information',
            'personal_information' => 'Personal information',
            'edit_user' => 'Edit User',
            'update_user_information' => 'Update user information'
        ],
        'table' => [
            'name' => 'Name',
            'user' => 'User',
            'role' => 'Role',
            'email' => 'Email',
            'dependency' => 'Dependencia',
            'regional' => 'Regional'
        ],
    ]
];
