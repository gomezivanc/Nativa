<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rótulo de Caja</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            margin: 0;
            background: #fff; /* Fondo blanco para PDF */
            color: #6b6b6b; /* Texto negro para mejor impresión */
        }
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 8px;
            border: 2px solid #6b6b6b   ;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        .logo {
            text-align: center;
            margin-bottom: 10px;
        }
        .logo img {
            width: 200px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table, th, td {
            border: 1px solid #6b6b6b   ;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background: #e0e0e0;
            text-transform: uppercase;
            font-weight: bold;
        }
        .section-title {
            font-weight: bold;
            background: #e0e0e0;
            text-align: center;
            padding: 6px;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .firma {
            height: 60px;
            text-align: center;
            font-weight: bold;
            padding-top: 20px;
        }
    </style>
</head>
@php
    $expFile = $expFiles->loadCount('files')->reduce(function ($max, $item) {
        return ($max === null || $item->files_count > $max->files_count) ? $item : $max;
    });   
@endphp
<body>
    <div class="container">
        <div class="logo">
            {{-- <img src="logo.png" alt="Logo de la empresa"> --}}
        </div>
        <div class="header">
            {{ __('archive_gestion.exp_files.export.title') }}
        </div>

        <table>
            <tr>
                <td><strong>{{ __('archive_gestion.exp_files.export.box_num') }}:</strong> 1</td>
                <td><strong>{{ __('archive_gestion.exp_files.export.total_unity') }}:</strong> {{ count($expFiles) }}</td>
            </tr>
            <tr>
                <td><strong>{{ __('archive_gestion.exp_files.export.1_unity') }}:</strong> 1</td>
                <td><strong>{{ __('archive_gestion.exp_files.export.last_no_unity') }}:</strong> {{
                    $expFiles->loadCount('files')->reduce(function ($max, $item) {
                        return ($max === null || $item->files_count > $max) ? $item->files_count : $max;
                    }, 0)
                }}</td>

            </tr>
        </table>

        <table>
            <tr>
                <td><strong>{{ __('archive_gestion.exp_files.export.code') }}:</strong></td>
                <td>{{ $expFile->dependency?->code }}</td>
            </tr>
            <tr>
                <td><strong>{{ __('archive_gestion.exp_files.export.dependency') }}:</strong></td>
                <td>{{ $expFile->dependency?->name }}</td>
            </tr>
        </table>

        <div class="section-title">{{ __('archive_gestion.exp_files.export.content') }}</div>
        <table>
            <tr>
                <th>#</th>
                <th>{{ __('archive_gestion.exp_files.export.code') }}</th>
                <th>SERIE / SUBSERIE</th>
            </tr>
            @foreach ($expFiles as $key => $item)
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $item->serie['code'] }}/{{ $item->subserie['code'] }}</td>
                    <td>{{ $item->serie['name'] }} / {{ $item->subserie['name'] }}</td>
                </tr>
            @endforeach
        </table>

        <div class="section-title">{{ __('archive_gestion.exp_files.export.extreme_date') }}</div>
        <table>
            <tr>
                <td>2024-05-02</td>
                <td>2024-05-02</td>
            </tr>
        </table>

        <div class="section-title">{{ __('archive_gestion.exp_files.export.responsible_signature') }}</div>
        <div class="firma">______________________________________</div>
    </div>
</body>
</html>
