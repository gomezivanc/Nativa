<?php
namespace Database\Seeders;

use App\Models\AplicativoUsuario;
use Illuminate\Database\Seeder;
use App\Models\UserCentralizado;
use App\Models\Rol;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $usuarios = [
            [
                [
                    'nombre'              => 'Super Administrador',
                    'apellido'            => 'Admin',
                    'tipo_documento'      => '1',
                    'numero_documento'    => '1',
                    'estado'              => '1'
                ],
                [
                    'id_persona'          => '1',
                    'usuario'             => 'super_administrador',
                    'email'               => 'super_administrador@turrisystem.com',
                    'password'            => bcrypt('123456789'),
                    'observaciones'       => 'Super Administrador General del Sistema',
                    'estado'              => '1',
                    'super_administrador' => '1'
                ],
            ],
            [
                [
                    'nombre'              => 'Administrador',
                    'apellido'            => 'Admin',
                    'tipo_documento'      => '1',
                    'numero_documento'    => '2',
                    'estado'              => '1'
                ],
                [
                    'id_persona'          => '2',
                    'usuario'             => 'administrador',
                    'email'               => 'administrador@turrisystem.com',
                    'password'            => bcrypt('123456789'),
                    'observaciones'       => 'Administrador General del Sistema',
                    'estado'              => '1',
                    'super_administrador' => '0'
                ],
            ],

        ];

        // $aplicativos = [
        //     [
        //         'id_aplicativo' => '1',
        //         'id_usuario'    => '1',
        //         'estado'        => '1',
        //     ],
        //     [
        //         'id_aplicativo' => '1',
        //         'id_usuario'    => '2',
        //         'estado'        => '1',
        //     ]
        // ];

        foreach($usuarios as $usuario => $user)
        {
            //se Guarda la persona
            Persona::create($user[0]);
            //se guarda el usuario
            User::create($user[1]);
            //se registra en el departamento
        }

        // foreach($aplicativos as $aplicativo => $app)
        // {
        //     //se registra en el departamento
        //     AplicativoUsuario::create($app);
        // }
    }
}
