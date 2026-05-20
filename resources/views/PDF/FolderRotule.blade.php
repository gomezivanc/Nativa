<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rótulo de Carpeta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .container {
            width: 100%;
            border: 1px solid #000;
            padding: 10px;
        }
        .header {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .section {
            border: 1px solid #000;
            margin-bottom: 10px;
            padding: 5px;
        }
        .section-title {
            background: #eee;
            font-weight: bold;
            padding: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        .logo {
            width: 100px;
        }
        .firma {
            height: 60px;
            text-align: center;
            font-weight: bold;
            padding-top: 20px;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Encabezado -->
    {{-- <div class="header">
        <img src="logo.png" alt="Logo" class="logo"><br>
        <p>SKINA TECHNOLOGIES S.A.S</p>
        <p>Rótulo de Carpeta</p>
    </div> --}}

    <!-- Datos Generales -->
    <div class="section">
        <div class="section-title">{{ $expFile->expFilesArchived?->type }} 1</div>
        <p><strong>NÚMERO DE FOLIOS:</strong> 2</p>
        <p><strong>{{ __('archive_gestion.exp_files.export.code') }}:</strong> {{ $expFile->dependency?->code }}</p>
        <p><strong>{{ __('archive_gestion.exp_files.export.dependency') }}:</strong> {{ $expFile->dependency?->name }}</p>
    </div>

    <!-- Serie/Subserie -->
    <div class="section">
        <div class="section-title">SERIE/SUBSERIE</div>
        <table>
            <tr>
                <th>{{ __('archive_gestion.exp_files.export.code') }}</th>
                <th>{{ __('documental_gestion.exp_files.table.name') }}</th>
            </tr>
            <tr>
                <td>{{ $expFile->serie['code'] }}/{{ $expFile->subserie['code'] }}</td>
                <td>{{ $expFile->serie['name'] }} / {{ $expFile->subserie['name'] }}</td>
            </tr>
        </table>
    </div>

    <!-- Asunto -->
    <div class="section">
        <div class="section-title">ASUNTO: EXPEDIENTE {{ $expFile->files->count() }}</div>
        <table>
            <tr>
                <th>#</th>
                <th>CONTENIDO</th>
                <th>TIPO DOCUMENTAL</th>
            </tr>
            @foreach ($expFile->files as $key => $item)
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $expFile->number }}{{$key++}}TD</td>
                    <td>{{ explode('.',json_decode($item->file_detail)->name)[0] ?? null }}</td>
                </tr>
            @endforeach
        </table>
    </div>

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
