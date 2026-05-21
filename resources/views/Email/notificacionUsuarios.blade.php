<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Correo</title>
</head>

<body class="body">
    <table
        style="width:100%;background-color:#ffffff;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;margin:0;font-size:16px;line-height:17px;color:#4a4a4a;"
        border="0" cellspacing="0" cellpadding="0" align="center">
        <tbody>
            <tr>
                <td style="text-align:center;background:#fbfbfb">
                    <table style="width:100%;max-width:520px" border="0" cellspacing="0" cellpadding="0"
                        align="center">
                        <tbody>
                            <tr>
                                <td style="width:100px;padding:20px 0px 20px 0px" align="center">
                                    <img src="https://i.postimg.cc/m2P2DSxY/logo3.png" class="img"
                                        style="width: 40%; text-align:center;">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table
                        style="margin-bottom:40px;max-width:570px;width:100%;background-color:#ffffff;border:1px solid #eaeeee;border-top:none;border-radius:5px"
                        border="0" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td
                                    style="text-align:center;border-bottom:1px solid #eaeeee;border-top:2px solid #074d87;padding:6px">
                                    <br>
                                    <div style="text-align:center;color:#9c9c9c;font-size:18px">
                                        Notificación De Creacion Usuario
                                    </div>
                                    <div>
                                        <table style="padding:5%;text-align:left" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td style="padding-right:5%;min-width:60px">
                                                        <img src="https://i.postimg.cc/ydpDdWXc/check.png"
                                                            width="50">
                                                    </td>
                                                    <td style="text-align:left">
                                                        <h1 style="font-size:1.1em;line-height:1.2em;font-weight:400">
                                                            <b>Cordial Saludo</b>
                                                        </h1>
                                                        <span style="font-size:12px;color:#000c;line-height:14px;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;">
                                                            Datos de acceso para el aplicativo {{ $dataUser['aplicativo'] }}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table style="text-align:left;width:100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:20px 0px;width:50%">
                                                    <table cellspacing="0" cellpadding="0" align="center">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding-right:3%;min-width:40px">
                                                                    <img src="https://i.postimg.cc/vBbDYkgR/Usuario.png"
                                                                        width="30">
                                                                </td>
                                                                <td style="min-width:120px">
                                                                    <span
                                                                        style="font-size:12px;color:#9c9c9c;line-height:14px;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;">
                                                                        Usuario
                                                                    </span>
                                                                    <br>
                                                                    <span
                                                                        style="font-size:1em;color:#074d87;line-height:20px;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;">
                                                                        {{ $dataUser['usuario'] }}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td style="padding:20px 0px;width:50%">
                                                    <table cellspacing="0" cellpadding="0" align="center">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding-right:10px;min-width:40px">
                                                                    <img src="https://i.postimg.cc/JhN7yxZb/candado.png"
                                                                        width="50" style="vertical-align:bottom">
                                                                </td>
                                                                <td style="min-width:120px">
                                                                    <span
                                                                        style="font-size:12px;color:#9c9c9c;line-height:14px;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;">
                                                                        Contraseña
                                                                    </span>
                                                                    <br>
                                                                    <span
                                                                        style="font-size:1em;color:#074d87;line-height:20px;font-weight:300;font-family:Roboto,sans-serif,rebuchet MS;">
                                                                        {{ $dataUser['password'] }}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="text-align:center;padding:20px;border-top:1px solid #eaeeee;color:rgba(0,0,0,0.54)">
                                    <span style="text-align:center;padding:20px;font-size:10px;color:rgba(0,0,0,0.54)">
                                        * En caso de no haber efectuado restablecimiento de contraseña comunicate inmediatamente con el area de soporte del aplicativo {{ $dataUser['aplicativo'] }}. *
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="background:#fbfbfb; padding-bottom:30px;" align="center">
                    <span
                        style="font-size:12px;color:rgba(0,0,0,0.75);font-weight:200;font-family:Roboto,sans-serif,Trebuchet MS">
                        Todos los derechos Reservados  SA © {{ date('Y') }}
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
