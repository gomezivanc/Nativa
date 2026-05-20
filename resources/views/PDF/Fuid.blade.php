@php
    use Illuminate\Support\Facades\Auth;
    use App\Models\ModelHasRol;
@endphp

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formato Único de Inventario Documental</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            font-size: 0.85em; /* Ajusta el tamaño de fuente */
        }
        .container {
            width: 95%;
            margin: 20px auto;
            border: 1px solid #333;
            padding: 10px;
            background-color: #fff;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 1.2em; /* Fuente más pequeña */
            margin-bottom: 10px;
            text-transform: uppercase;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 0.85em; /* Fuente más pequeña */
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px; /* Espaciado más pequeño */
            text-align: left;
        }
        th {
            background-color: #f1f1f1;
            font-weight: bold;
        }
        td {
            background-color: #fafafa;
        }
        td:empty {
            background-color: #fff;
        }
        .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 0.8em;
            color: #555;
        }
        .footer table {
            width: 50%;
            margin-top: 15px;
        }
        .footer th {
            text-align: left;
            padding-bottom: 6px;
        }
        .footer td {
            padding-bottom: 6px;
        }
        .total-info {
            font-weight: bold;
            color: #2d8f2d;
        }
        .signature-row {
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Formato Único de Inventario Documental
        </div>

        <table>
            <thead>
                <tr>
                    <th rowspan="2" colspan="3"></th>
                    <th colspan="10">Formato</th>
                </tr>
                <tr>
                    <th colspan="10">Formato Único de inventario documental</th>
                </tr>
                <tr>
                    <th colspan="7"><strong>Entidad productora</strong>: naaaaa</th>
                    <th colspan="6"><strong>Fecha de elaboración</strong>: {{ date('Y-m-d H:i') }}</th>
                </tr>
                <tr>
                    <th colspan="7">Unidad administrativa: {{ $expFile->dependency?->gdDependency?->name ? $expFile->dependency?->gdDependency?->name : 'N/A' }}</th>
                    <th colspan="6">Hoja: 1</th>
                </tr>
                <tr>
                    <th colspan="7">Oficina productora: {{ $expFile->dependency?->name }}</th>
                    <th colspan="6"></th>
                </tr>
                <tr>
                    <th colspan="7">Objeto: Inventario documental individual por dependencia</th>
                    <th colspan="6"></th>
                </tr>
                <tr>
                    <th colspan="13"></th>
                </tr>
                <tr>
                    <th rowspan="2">No orden</th>
                    <th rowspan="2">Expediente</th>
                    <th rowspan="2">Código serie - subserie</th>
                    <th rowspan="2">Identificación carpeta</th>
                    <th colspan="2">Fechas extremas</th>
                    <th colspan="4">Unidad de conservación</th>
                    <th rowspan="2">Número de folios</th>
                    <th rowspan="2">Soporte documental</th>
                    <th rowspan="2">Observaciones</th>
                </tr>
                <tr>
                    <th>Inicial</th>
                    <th>Final</th>
                    <th>Caja</th>
                    <th>Carpeta</th>
                    <th>Tomo</th>
                    <th>Otro</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>{{ $expFile->number }}</td>
                    <td>{{ $expFile->serie['name'] }} - {{ $expFile->subserie['name'] }}</td>
                    <td>{{ $expFile->expFilesArchived()->latest()->first()?->unity_conservation }}</td>
                    <td>{{ $expFile->created_at->format('Y-m-d H:i') }}</td>
                    <td></td>
                    <td>{{ $expFile->expFilesArchived()->latest()->first()?->type == 'AR' ? 'x' : '' }}</td>
                    <td>{{ $expFile->expFilesArchived()->latest()->first()?->type == 'CAR' ? 'x' : '' }}</td>
                    <td>{{ $expFile->expFilesArchived()->latest()->first()?->type == 'LB' ? 'x' : '' }}</td>
                    <td>{{ $expFile->expFilesArchived()->latest()->first()?->type == 'A-Z' ? 'x' : '' }}</td>
                    <td>{{ $expFile->files()->count() }}</td>
                    <td></td>
                    <td>
                        Formato realizado
                        automáticamente
                        por el sistema de
                        gestión
                        documental.
                    </td>
                </tr>
            </tbody>
        </table>

        <table >
            <tr>
                <th><strong>Elaborado y entregado por:</strong></th>
                <th><strong class="total-info"></strong></th>
            </tr>
            <tr>
                <th>Nombre: {{ Auth::user()->persona?->nombre }} {{ Auth::user()->persona?->apellido }}</th>
                <th></th>
            </tr>
            <tr>
                @php
                    $roles = ModelHasRol::where('model_id',Auth::user()->id)->where('model_type','App\Models\User')->get()->map(function ($item) {
                        return $item->roles->name;
                    });
                @endphp
                <th>Cargo: {{ implode(', ',  $roles->toArray()) }} </th>
                <th></th>
            </tr>
            <tr>
                <th>Fecha: {{ date('Y-m-d') }}</th>
                <th></th>
            </tr>
        </table>
    </div>
</body>
</html>
