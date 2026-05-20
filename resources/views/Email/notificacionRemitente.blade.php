<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Código Verificación Firma</title>
    </head>
    <body style="background-color: #fbfbfb; font-family: Roboto, sans-serif, Trebuchet MS; margin: 0; font-size: 16px; line-height: 1.4; color: #4a4a4a;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td align="center">
                    <!-- Contenedor principal -->
                    @if($esFuncionario)
                        <table style="width: 100%; max-width: 570px; background-color: #ffffff; border: 1px solid #eaeeee; border-radius: 5px;" cellspacing="0" cellpadding="0" align="center">
                            <tr>
                                <td style="border-top: 2px solid #2b80ff; text-align: center; padding: 20px;">
                                    <div style="font-size: 18px; font-weight: bold; color: #084095;">
                                        Notificación de Radicado
                                    </div>

                                    <p style="font-size: 14px; margin-top: 15px; line-height: 1.6;">
                                        Estimado(a) ciudadano(a),
                                        <br><br>
                                        Le informamos que su solicitud ha sido recibida y registrada exitosamente en nuestro sistema de gestión documental.
                                        <br><br>
                                        A continuación encontrará el número de radicado asignado, el cual le permitirá realizar seguimiento a su trámite y consultar el estado del mismo cuando lo requiera.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: center; padding: 0 20px 20px 20px;">
                                    <div style="font-size: 22px; color: #084095; font-weight: bold; margin-bottom: 5px;">
                                        Numero De Radicado
                                    </div>
                                    <div style="font-size: 20px; color: #2F4E7C;">
                                        {{ $data['numeroRadicado'] ?? '' }}
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
                    @else
                        <table style="width: 100%; max-width: 570px; background-color: #ffffff; border: 1px solid #eaeeee; border-radius: 5px;" cellspacing="0" cellpadding="0" align="center">
                            <tr>
                                <td style="border-top: 2px solid #2b80ff; text-align: center; padding: 20px;">
                                    <div style="font-size: 18px; font-weight: bold; color: #084095;">
                                        Notificación Creacion de Radicado
                                    </div>

                                    <p style="font-size: 14px; margin-top: 15px; line-height: 1.6;">
                                        Estimado(a) Funcionario(a),
                                        <br><br>
                                        Le informamos que su solicitud ha asignado un radicado con fecha de respuesta maxima. {{ $data['radicado']['expiration_date'] ?? '' }}
                                        <br><br>
                                        A continuación encontrará el número de radicado asignado
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: center; padding: 0 20px 20px 20px;">
                                    <div style="font-size: 22px; color: #084095; font-weight: bold; margin-bottom: 5px;">
                                        Informacion del radicado
                                    </div>
                                    <tr>
                                    <td style="padding: 0 20px 30px 20px;">
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
                                            
                                            <tr style="background-color: #f4f6f9;">
                                                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">
                                                    Número de Radicado
                                                </td>
                                                <td style="padding: 10px; border: 1px solid #e0e0e0;">
                                                    {{ $data['numeroRadicado'] ?? '' }}
                                                </td>
                                            </tr>

                                            <tr style="background-color: #f4f6f9;">
                                                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">
                                                    Días restantes
                                                </td>
                                                <td style="padding: 10px; border: 1px solid #e0e0e0;">
                                                    {{ $data['radicado']['remaining_days'] ?? '' }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">
                                                    Asunto
                                                </td>
                                                <td style="padding: 10px; border: 1px solid #e0e0e0;">
                                                    {{ $data['radicado']['annex_description'] ?? '' }}
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>
                                </td>
                            </tr>

                        </table>
                    @endif
                </td>
            </tr>
        </table>
    </body>
</html>
