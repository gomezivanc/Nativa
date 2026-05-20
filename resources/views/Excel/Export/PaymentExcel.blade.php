<table>
    <thead>
        <tr>
            <th style="width: 180px">Nro radicado</th>
            <th style="width: 180px">Secretaria ordenadora del gasto</th>
            <th style="width: 180px">No. comprobante de egreso</th>
            <th style="width: 180px">Fecha de comprobante de egreso</th>
            <th style="width: 180px">Valor</th>
            <th style="width: 180px">Fecha de orden de pago</th>
            <th style="width: 180px">Fecha de pago</th>
            <th style="width: 180px">Beneficiario</th>
            <th style="width: 180px">Oficio No y fecha de envio soportes a jurídica</th>
            <th style="width: 180px">Persona responsable preparar el pago</th>
            <th style="width: 180px">Enviado a jurídica</th>
            <th style="width: 180px">Fecha envio a jurídica</th>
            <th style="width: 180px">Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $value)
            <tr>
                <td>{{ $value->process?->nro_radicado }}</td>
                <td>{{ $value->secretary->nombre }}</td>
                <td>{{ $value->numero_egreso }}</td>
                <td>{{ $value->fecha_egreso }}</td>
                <td>{{ number_format($value->valor) }}</td>
                <td>{{ $value->fecha_orden_pago }}</td>
                <td>{{ $value->fecha_pago }}</td>
                <td>{{ $value->beneficiario }}</td>
                <td>{{ $value->oficio_fecha_envio }}</td>
                <td>{{ $value->profesional }}</td>
                <td>{{ $value->enviado_juridica ? 'Si' : 'No' }}</td>
                <td>{{ $value->created_at }}</td>
                <td>{{ $value->deleted_at ? 'Si' : 'No' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
