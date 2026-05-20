<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Notificación de Vencimiento</title>
    <style>
        /* Estilos básicos para asegurar compatibilidad */
        .body { margin: 0; padding: 0; background-color: #f4f7f9; }
        .card { border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .button { 
            background-color: #074d87; 
            color: #ffffff !important; 
            padding: 12px 25px; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
            display: inline-block;
        }
    </style>
</head>

<body class="body" style="background-color: #f4f7f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
        <tbody>
            <tr>
                <td style="padding: 40px 0;" align="center">

                    <table class="card" style="width:100%; max-width:600px; background-color: #ffffff; border: 1px solid #e1e8ed;" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td style="background-color: #074d87; height: 4px;"></td>
                            </tr>

                            <tr>
                                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                                    <h2 style="color: #2c3e50; font-size: 24px; margin: 0; font-weight: 700;">
                                        Aviso de Finalización
                                    </h2>
                                    <p style="color: #7f8c8d; font-size: 16px; margin-top: 10px;">
                                        Estado contractual del colaborador
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 0 40px 20px 40px;">
                                    <table width="100%" style="background-color: #f8fbff; border-radius: 8px; border: 1px dashed #adcce9;" cellspacing="0" cellpadding="20">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td>
                                                                <span style="font-size: 12px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px;">Contratista</span><br>
                                                                <span style="font-size: 18px; color: #2c3e50; font-weight: bold;">
                                                                    {{ $data['nombre_contratista'] }} {{ $data['apellido_contratista'] }}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 0;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e1e8ed; padding-top: 20px;">
                                                        <tr>
                                                            <td>
                                                                <span style="font-size: 12px; color: #7f8c8d;">FECHA DE FIN</span><br>
                                                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600;">{{ $data['fecha_Finalizacion'] }}</span>
                                                            </td>
                                                            <td align="right">
                                                                <span style="font-size: 12px; color: #7f8c8d;">TIEMPO RESTANTE</span><br>
                                                                <span style="font-size: 15px; background-color: #e74c3c; color: #ffffff; padding: 2px 10px; border-radius: 20px; font-weight: bold;">
                                                                    {{ $data['tiempo_restante'] }} días
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 40px 40px 40px; text-align: center;">
                                    <p style="color: #4a4a4a; font-size: 14px; line-height: 22px; margin-bottom: 25px;">
                                        Le sugerimos revisar la documentación en el aplicativo <strong>{{ $data['aplicacion'] }}</strong> para gestionar la renovación o el cierre del contrato.
                                    </p>
                                    <a href="#" class="button">Gestionar en {{ $data['aplicacion'] }}</a>
                                </td>
                            </tr>

                            <tr>
                                <td style="background-color: #fafafa; padding: 20px; border-top: 1px solid #eeeeee; text-align: center;">
                                    <span style="font-size: 11px; color: #95a5a6; line-height: 18px;">
                                        Este es un mensaje automático generado por Turrisystem.<br>
                                        Si tiene dudas, contacte al área de soporte técnico.
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="width:100%; max-width:600px;" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 30px 0;" align="center">
                                    <span style="font-size: 12px; color: #bdc3c7;">
                                        Todos los derechos Reservados Turrisystem SA © {{ date('Y') }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>