<!DOCTYPE html>
<html>
<head>
    <title>Reasionación de radicado</title>
</head>
<body> 

    <h1>Numero de radicado, {{ $data['filing']['filing_number'] }}</h1>
    <p>Proveedor: {{$data['provider']}}</p>
    <p>Regional: {{$data['regional']}}</p>
    <p>Número de guía: {{$data['tracking_number']}}</p>
    <p>Observacion: {{$data['observatio_send']}}</p>
</body>
</html>