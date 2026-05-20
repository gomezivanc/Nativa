<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermisosSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Ver Configuración', 'id_menu' => 1, 'name_module' => 'Principales'],
            ['name' => 'Ver Carga de trd', 'id_menu' => 2, 'name_module' => 'Configuración'],
            ['name' => 'Ver Proveedores', 'id_menu' => 3, 'name_module' => 'Configuración'],
            ['name' => 'Ver Gestion documental', 'id_menu' => 4, 'name_module' => 'Principales'],
            ['name' => 'Ver Dependencias', 'id_menu' => 5, 'name_module' => 'Gestion documental'],
            ['name' => 'Ver Grupos de Usuarios', 'id_menu' => 6, 'name_module' => 'Configuración'],
            ['name' => 'Ver Horario laboral', 'id_menu' => 7, 'name_module' => 'Configuración'],
            ['name' => 'Ver Horario no laboral', 'id_menu' => 8, 'name_module' => 'Configuración'],
            ['name' => 'Ver Gestion de planillas', 'id_menu' => 9, 'name_module' => 'Configuración'],
            ['name' => 'Ver Variables Plantillas', 'id_menu' => 10, 'name_module' => 'Configuración'],
            ['name' => 'Ver Usuario interoperabilidad', 'id_menu' => 11, 'name_module' => 'Configuración'],
            ['name' => 'Ver Encuesta de Satisfaccion', 'id_menu' => 12, 'name_module' => 'Configuración'],
            ['name' => 'Ver Principal y Regionales', 'id_menu' => 13, 'name_module' => 'Configuración'],
            ['name' => 'Ver Carga de TRD', 'id_menu' => 14, 'name_module' => 'Gestion documental'],
            ['name' => 'Ver Versionamiento de TRD', 'id_menu' => 15, 'name_module' => 'Gestion documental'],
            ['name' => 'Ver Expedientes', 'id_menu' => 16, 'name_module' => 'Gestion documental'],
            ['name' => 'Ver Tipos de Radicado', 'id_menu' => 33, 'name_module' => 'Configuración'],
            ['name' => 'Ver Configuración del radicado', 'id_menu' => 34, 'name_module' => 'Configuración'],
            ['name' => 'Ver Etiquetas de radicado', 'id_menu' => 35, 'name_module' => 'Configuración'],
            ['name' => 'Ver Gestion de archivo', 'id_menu' => 36, 'name_module' => 'Principales'],
            ['name' => 'Ver Espacio fisico', 'id_menu' => 37, 'name_module' => 'Gestion de archivo'],
            ['name' => 'Ver Archivar expediente', 'id_menu' => 38, 'name_module' => 'Gestion de archivo'],
            ['name' => 'Ver Transferencias documentales', 'id_menu' => 39, 'name_module' => 'Gestion de archivo'],
            ['name' => 'Ver Radicación', 'id_menu' => 40, 'name_module' => 'Principales'],
            ['name' => 'Ver Radicación estándar', 'id_menu' => 41, 'name_module' => 'Radicación'],
            ['name' => 'Ver Tabla de control', 'id_menu' => 42, 'name_module' => 'Gestion documental'],
            ['name' => 'Ver Workflow', 'id_menu' => 43, 'name_module' => 'Principales'],
            ['name' => 'Ver Prestamos documentales', 'id_menu' => 44, 'name_module' => 'Principales'],
            ['name' => 'Ver Solicitar prestamos', 'id_menu' => 45, 'name_module' => 'Prestamos documentales'],
            ['name' => 'Ver Administrar prestamos', 'id_menu' => 46, 'name_module' => 'Prestamos documentales'],
            ['name' => 'Ver Prestamo de expedientes', 'id_menu' => 47, 'name_module' => 'Prestamos documentales'],
            ['name' => 'Ver Administrar prestamo de expedientes', 'id_menu' => 48, 'name_module' => 'Prestamos documentales'],
            ['name' => 'Ver Radicación correo electronico', 'id_menu' => 49, 'name_module' => 'Radicación'],
            ['name' => 'Ver Radicación masiva', 'id_menu' => 50, 'name_module' => 'Radicación'],
            ['name' => 'Ver Reportes', 'id_menu' => 51, 'name_module' => 'Principales'],
            ['name' => 'Ver Permisos', 'id_menu' => 52, 'name_module' => 'Reportes'],
            ['name' => 'Ver Registro de actividades', 'id_menu' => 53, 'name_module' => 'Reportes'],
            ['name' => 'Ver Gestión de correspondencia', 'id_menu' => 54, 'name_module' => 'Principales'],
            ['name' => 'Ver Distribución y Envío', 'id_menu' => 55, 'name_module' => 'Gestión de correspondencia'],
            ['name' => 'Ver Reasignación masiva', 'id_menu' => 56, 'name_module' => 'Gestión de correspondencia'],
            ['name' => 'Ver Anulación', 'id_menu' => 57, 'name_module' => 'Gestión de correspondencia'],
            ['name' => 'Ver Disposición final', 'id_menu' => 58, 'name_module' => 'Gestion de archivo'],
            ['name' => 'Ver Radicados por tiempos de finalización', 'id_menu' => 59, 'name_module' => 'Reportes'],
            ['name' => 'Ver Radicados por tipo de radicado', 'id_menu' => 60, 'name_module' => 'Reportes'],
            ['name' => 'Ver Radicados por cliente', 'id_menu' => 61, 'name_module' => 'Reportes'],
            ['name' => 'Ver Expedientes por tipo de clasificación', 'id_menu' => 62, 'name_module' => 'Reportes'],
            ['name' => 'Ver Configuración de terceros', 'id_menu' => 63, 'name_module' => 'Configuración'],
            ['name' => 'Ver Fondo acumulado', 'id_menu' => 65, 'name_module' => 'Gestion de archivo'],
        ];

        foreach ($data as $item) {
            \DB::table('permissions')->insert([
                'name' => $item['name'],
                'guard_name' => 'web',
                'id_menu' => $item['id_menu'],
                'name_module' => $item['name_module'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
