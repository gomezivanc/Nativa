<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'nombres'       => 'required|string|max:100',
            'usuario'       => 'required|max:100',
            'email'         => 'required|email',
            'roles'         => 'required',
        ];
    }

    public function messages()
    {
        return [
            'nombres.required'      => 'El nombre es requerido.',
            'nombres.string'        => 'El campo nombres debe ser una cadena de caracteres.',
            'nombres.max'           => 'El campo nombres no puede tener más de 100 caracteres.',
            'usuario.required'      => 'El usuario es requerido.',
            'usuario.max'           => 'El campo usuario no puede tener más de 100 caracteres.',
            'email.required'        => 'El email requiredo.',
            'email.email'           => 'El email no es un correo valido.',
            'roles.required'        => 'El rol requiredo.',
        ];
    }
}
