<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sticker</title>
    <style>
        * {
            font-family: Arial, sans-serif;
            font-size: 9px;
            text-align: center;
        }

        .sticker {
            width: 300px;
            border: 1px solid #000;
            padding: 10px;
        }

        .barcode {
            text-align: center;
            margin-bottom: 10px;
            /* Espacio entre el código de barras y la información */
        }

        .barcode img {
            max-width: 100%;
            height: auto;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;            
            text-align: center;
        }
    </style>
</head>

<body>
    <!-- Código de barras en una fila completa -->
    <div class="barcode">
        <img src="data:image/png;base64,{{ $barcode }}" alt="Código de barras">
    </div>
    <table class="info-table">
        <tr>
            <td><strong>Rad N°:</strong> {{ $filingNumber }}</td>
            <td><strong>Fecha rad:</strong> {{ $filing->created_at }}</td>
        </tr>
        <tr>
            <td><strong>Usu radicador:</strong> {{ $filing->user->persona['nombre']." ".$filing->user->persona['apellido'] }}</td>
            <td><strong>Dependencia:</strong> {{ $filing->dependency['name'] }}</td>
        </tr>
        <tr>
            <td><strong>Remitente:</strong> {{ $filing->name_social_reason_sender }} - {{ $filing->first_surname_legal_representative_sender }}</td>
            <td><strong>Asunto:</strong> {{ $filing->subject }}</td>
        </tr>       
    </table>
</body>

</html>