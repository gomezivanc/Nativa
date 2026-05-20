<table>
    <thead>
    <tr>
        <th style="width: 180px">Año proceso</th>
        <th style="width: 180px">Carpeta No</th>
        <th style="width: 180px">Despacho</th>
        <th style="width: 180px">No. rad.</th>
        <th style="width: 180px">Tipo Proceso</th>
        <th style="width: 180px">Fecha Admisión</th>
        <th style="width: 180px">Juez</th>
        <th style="width: 180px">Clase de Proceso</th>
        <th style="width: 180px">Tema</th>
        <th style="width: 180px">Demandante</th>
        <th style="width: 180px">Cedula o nit</th>
        <th style="width: 180px">Dirección</th>
        <th style="width: 180px">Demandado</th>
        <th style="width: 180px">Apoderado Depto</th>
        <th style="width: 180px">Valor Pretetensión</th>
        <th style="width: 180px">% Ganar o Perder</th>
        <th style="width: 180px">Valor Provisión</th>
        <th style="width: 180px">Creado el</th>
    </tr>
    </thead>
    <tbody>
    @foreach($data as $value)
        <tr>
            <td>{{ $value->a_proceso }}</td>
            <td>{{ $value->nro_carpeta }}</td>
            <td>{{ $value->office?->nombre }}</td>
            <td>{{ $value->nro_radicado }}</td>
            <td>{{ $value->type_process?->nombre }}</td>
            <td>{{ $value->fecha_admision }}</td>
            <td>{{ $value->judges?->nombre }}</td>
            <td>{{ $value->type_process?->nombre }}</td>
            <td>{{ $value->theme?->nombre }}</td>
            <td>{{ $value->plaintiffs?->nombre }}</td>
            <td>{{ $value->plaintiffs?->cc ? $value->plaintiffs->cc : $value->plaintiffs?->nit }}</td>
            <td>{{ $value->plaintiffs?->direccion }}</td>
            <td>{{ $value->defendant?->nombre }}</td>
            <td>{{ $value->responsable?->persona?->nombre }}</td>
            <td>{{ number_format($value->cuantia) }}</td>
            <td>%{{ number_format($value->probg) }}</td>
            <td>{{ number_format(($value->probg/100)*$value->cuantia) }}</td>
            <td>{{ $value->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>