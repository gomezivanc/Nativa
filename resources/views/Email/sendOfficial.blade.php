<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Nuevo radicado asignado</title>
    </head>
    <body style="background-color: #fbfbfb; font-family: Roboto, sans-serif, Trebuchet MS; margin: 0; font-size: 16px; line-height: 1.4; color: #4a4a4a;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td align="center">
                    <!-- Contenedor principal -->
                    <table style="width: 100%; max-width: 570px; background-color: #ffffff; border: 1px solid #eaeeee; border-radius: 5px;" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td style="border-top: 2px solid #2b80ff; text-align: center; padding: 20px;">
                                <div style="font-size: 18px; font-weight: bold; color: #084095;">
                                    Notificación de Radicado
                                </div>

                                <p style="font-size: 14px; margin-top: 15px; line-height: 1.6;">
                                    Estimado(a) Usuario(a),
                                    <br><br>
                                    Le informamos que se le ha asignado un nuevo radicado en el sistema de gestión documental.
                                    <br><br>
                                    A continuación encontrará el número de radicado asignado, el cual le permitirá realizar seguimiento al trámite.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center; padding: 0 20px 20px 20px;">
                                <div style="font-size: 22px; color: #084095; font-weight: bold; margin-bottom: 5px;">
                                    Numero De Radicado
                                </div>
                                <div style="font-size: 20px; color: #2F4E7C;">
                                    {{ $data['filing_number'] ?? ''}}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding: 0 20px 20px 20px;">
                                <div style="font-size: 22px; color: #084095; font-weight: bold; margin-bottom: 5px;">
                                    Observación
                                </div>
                                <div style="font-size: 20px; color: #2F4E7C;">
                                    {{$data['observation'] ?? ''}}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center; padding: 0 20px 20px 20px;">
                                <div style="font-size: 10px; color: #084095; font-weight: bold; margin-bottom: 5px;">
                                    http://181.49.45.246:8085/cortolima/public/
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center; padding: 0 20px 20px 20px; border-top: 1px solid #eaeeee;">
                                <p style="font-size: 12px; color: rgba(0,0,0,0.6);">
                                    la respuesta de este documento se aproxima en {{ $data['fechaRespuesta'] ?? '' }}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
