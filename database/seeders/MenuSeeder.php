<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Menu::create([
            'id' => 1,
            'title' => 'Maestros',
            'parent_id' => 0,
            'type' => 3,
            'uri' => 'main',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-04 11:56:47',
            'updated_at' => '2024-04-04 11:56:47',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 5,
            'title' => 'Pagos sentencias',
            'parent_id' => 0,
            'type' => 3,
            'uri' => 'main',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-04 13:50:51',
            'updated_at' => '2024-04-04 13:50:51',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 6,
            'title' => 'Nuevo pago',
            'parent_id' => 5,
            'type' => 1,
            'uri' => 'payments.create',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-04 14:29:05',
            'updated_at' => '2024-04-04 14:29:05',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 7,
            'title' => 'Procesos judiciales',
            'parent_id' => 0,
            'type' => 3,
            'uri' => 'main',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-05 12:18:09',
            'updated_at' => '2024-04-05 12:18:09',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 4,
            'title' => 'Salario minimo legal vigente',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'smlv.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-04 13:25:23',
            'updated_at' => '2024-04-22 11:14:48',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 25,
            'title' => 'Fallo/Archivo de la conciliación prejudicial',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-failArchive.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-11 10:38:11',
            'updated_at' => '2024-04-22 16:05:23',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 8,
            'title' => 'Procesos judiciales',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-05 12:21:16',
            'updated_at' => '2024-04-05 14:48:51',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 10,
            'title' => 'Apoderados externos',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'externa-representants.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 11:35:49',
            'updated_at' => '2024-04-08 11:35:49',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 11,
            'title' => 'Categorias de documentos',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'documents-category.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:39:12',
            'updated_at' => '2024-04-08 13:39:12',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 12,
            'title' => 'Demandantes',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'plaintiffs.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:39:59',
            'updated_at' => '2024-04-08 13:39:59',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 13,
            'title' => 'Demandados',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'defendants.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:40:31',
            'updated_at' => '2024-04-08 13:40:31',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 14,
            'title' => 'Despachos judiciales',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'judicial-offices.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:41:07',
            'updated_at' => '2024-04-08 13:41:07',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 15,
            'title' => 'Estados del proceso',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'process-state.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:41:41',
            'updated_at' => '2024-04-08 13:41:41',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 16,
            'title' => 'Juez',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'judge.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:42:24',
            'updated_at' => '2024-04-08 13:42:24',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 17,
            'title' => 'Secreatrias',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'secretary.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:42:56',
            'updated_at' => '2024-04-08 13:42:56',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 18,
            'title' => 'Tipos de proceso',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'type-process.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:43:32',
            'updated_at' => '2024-04-08 13:43:32',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 19,
            'title' => 'Temas',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'themes.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:43:57',
            'updated_at' => '2024-04-08 13:43:57',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 20,
            'title' => 'Unidades',
            'parent_id' => 1,
            'type' => 1,
            'uri' => 'unities.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-08 13:44:44',
            'updated_at' => '2024-04-08 13:44:44',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 23,
            'title' => 'Audiencias de conciliación',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-conciliation.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-10 11:30:48',
            'updated_at' => '2024-04-10 11:30:48',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 24,
            'title' => 'Fallo archivo del proceso',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-fail.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-10 17:17:51',
            'updated_at' => '2024-04-10 17:17:51',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 26,
            'title' => 'Registros datos PDA',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-public-politic.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-15 16:07:06',
            'updated_at' => '2024-04-15 16:07:06',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 27,
            'title' => 'Informe Formato de contabilidad',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-format-contraloria',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-17 16:31:35',
            'updated_at' => '2024-04-17 16:31:35',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 22,
            'title' => 'Actuaciones del proceso',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-actuation.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-09 08:50:07',
            'updated_at' => '2024-04-22 16:05:43',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 28,
            'title' => 'Contraloria formato f21',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-format.f21',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-18 14:07:59',
            'updated_at' => '2024-04-18 14:07:59',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 29,
            'title' => 'Informe de contingencias',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process.contingencies',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-18 15:15:13',
            'updated_at' => '2024-04-19 08:02:37',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 30,
            'title' => 'Comite',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'judicial-process-comittee.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-19 09:22:52',
            'updated_at' => '2024-04-19 09:22:52',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 31,
            'title' => 'Estudio de repetición',
            'parent_id' => 7,
            'type' => 1,
            'uri' => 'study-repetittion.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-20 08:35:02',
            'updated_at' => '2024-04-20 08:35:02',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 32,
            'title' => 'Utilidades',
            'parent_id' => 0,
            'type' => 3,
            'uri' => 'main',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-22 08:02:17',
            'updated_at' => '2024-04-22 08:02:17',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 33,
            'title' => 'Traslado de procesos',
            'parent_id' => 32,
            'type' => 1,
            'uri' => 'translate-process.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-22 08:08:53',
            'updated_at' => '2024-04-22 08:08:53',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 34,
            'title' => 'Traslado de procesos en estudio de repetición',
            'parent_id' => 32,
            'type' => 1,
            'uri' => 'translate-process-repetitions.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-22 09:31:52',
            'updated_at' => '2024-04-22 09:31:52',
            'deleted_at' => NULL
        ]);

        Menu::create([
            'id' => 35,
            'title' => 'Manuales de usuario',
            'parent_id' => 32,
            'type' => 1,
            'uri' => 'manual-usuario.index',
            'target' => '_self',
            'icon' => 'fa-solid fa-bars-progress',
            'method' => NULL,
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 0,
            'deleted_by' => 0,
            'created_at' => '2024-04-30 08:15:00',
            'updated_at' => '2024-04-30 08:15:00',
            'deleted_at' => NULL
        ]);
    }
}
