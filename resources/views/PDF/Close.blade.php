<style>
    table {
        width: 100%;
        border-collapse: collapse; /* Elimina espacios extra entre celdas */
    }

    th, td {
        border: 1px solid #ccc;
        padding: 4px 8px; /* Reduce el padding */
        text-align: left;
        vertical-align: top; /* Asegura que el contenido esté alineado al tope */
        word-wrap: break-word; /* Divide el texto largo */
        word-break: break-word; /* Asegura división en palabras largas */
    }

    /* Estilo específico para la celda del token */
    .token {
        max-width: 800px; /* Define un ancho máximo */
    }
</style>

<table>
    <!-- Encabezado Principal -->
    <tr>
        <td rowspan="4" colspan="5"></td>
        <td colspan="7">ÍNDICE ELECTRÓNICO</td>
    </tr>
    <tr>
        <td colspan="7">EXPEDIENTE: {{ $data->name }} - {{ $data->number }}</td>
    </tr>
    <tr>
        <td colspan="7">SERIE-SUBSERIE: {{ $data->serie['name'] ?? null}} - {{ $data->subserie['name'] ?? null}}</td>
    </tr>
    <tr>
        <td colspan="7">FECHA GENERACIÓN: {{ date('Y-m-d H:i:s') }}</td>
    </tr>
    <!-- Encabezado de Columnas -->
    <tr>
        <th>Índice contenido</th>
        <th>Nombre documento</th>
        <th>Tipo documental</th>
        <th>Fecha documento</th>
        <th>Fecha de inclusión</th>
        <th class="token">Valor de huella</th>
        <th>Orden documento</th>
        <th>Pág. Inicio</th>
        <th>Pág. Final</th>
        <th>Formato</th>
        <th>Tamaño</th>
        <th>Origen</th>
    </tr>
    @foreach ($data->files as $key => $file)
        <tr>
            <td>{{ $data->number }}{{$key++}}TD</td>
            <td>{{ explode('.',json_decode($file->file_detail)->name)[0] ?? null }}</td>
            <td>{{ $file->type_documental?->name }}</td>
            <td>{{ $file->created_at->format('Y-m-d H:i:s') }}</td>
            <td>{{ $file->created_at->format('Y-m-d H:i:s') }}</td>
            <td class="token">{{ $file->token }}</td>
            <td>{{ $key++ }}</td>
            <td>1</td>
            <td>{{ readLastPage(storage_path().'/app/public/'.$file->file) }}</td>
            <td>{{ explode('.', json_decode($file->file_detail)->name)[1] ?? null }}</td>
            <td>{{ number_format(json_decode($file->file_detail)->size) }} KB</td>
            <td>Electrónico</td>
        </tr>
    @endforeach
</table>

<table style="width: 50%;margin-top: 30px">
    <tr>
        <td><b>Persona que cerró el expediente:</b> {{ $data->deleted_user->persona->nombre }} {{ $data->deleted_user->persona->apellido }}</td>
        <td rowspan="3"><b>Firma responsable:</b> 
            @if (!empty($data->createBy?->signature)) 
                <img src="{{ storage_path('app/public/' . $data->createBy?->signature) }}" width="150">
            @endif
        </td>
    </tr>
    <tr>
        <td><b>Dependencia cerró expediente:</b> {{ $data->dependency->name }}</td>
    </tr>
    <tr>
        <td><b>Fecha de cierre del expediente:</b> {{ $data->deleted_at }}</td>
    </tr>
</table>
