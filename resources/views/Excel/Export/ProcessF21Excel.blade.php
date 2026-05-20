<table>
    <thead>
    <tr>
        <th style="width: 180px">Despacho</th>
        <th style="width: 180px">Nombre municipio</th>
        <th style="width: 180px">Demandante</th>
        <th style="width: 180px">No. rad.</th>
        <th style="width: 180px">Tema</th>
        <th style="width: 180px">Motivo de la acción</th>
        <th style="width: 180px">Valor Demanda</th>
        <th style="width: 180px">Estado</th>
    </tr>
    </thead>
    <tbody>
    @foreach($data as $value)
        <tr>
            <td>{{ $value->office?->nombre }}</td>
            <td>{{ $value->city?->nombre }}</td>
            <td>{{ $value->plaintiffs?->nombre }}</td>
            <td>{{ $value->nro_radicado }}</td>
            <td>{{ $value->theme?->nombre }}</td>
            <td>{{ $value->type_process?->nombre }}</td>
            <td>{{ number_format($value->cuantia) }}</td>
            <td></td>
        </tr>
    @endforeach
    </tbody>
</table>