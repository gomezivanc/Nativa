<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
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
            'title' => 'required',
            'uri' => 'required',
            'type' => 'required',
            'target' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Se necesita el Título',
            'uri.required' => 'Se necesita la URL/Ruta',
            'type.required' => 'Se necesita el Tipo',
            'target.required' => 'Se necesita el Destino',
        ];
    }
}
