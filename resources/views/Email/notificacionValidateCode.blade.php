<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento Contraseña {{ $data['aplicacion']}}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Estilos base */
        body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f9fc;
            color: #4a4a4a;
            line-height: 1.6;
        }
        
        /* Contenedor principal */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        /* Cabecera */
        .header {
            background-color: #001e51;
            padding: 25px 0;
            text-align: center;
        }
        
        .header img {
            max-width: 180px;
            height: auto;
        }
        
        /* Contenido */
        .content {
            padding: 30px;
        }
        
        .title {
            color: #001e51;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #29a47e;
            padding-bottom: 15px;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #555;
        }
        
        .highlight {
            font-weight: 600;
            color: #001e51;
        }
        
        /* Código de verificación */
        .verification-code-container {
            background-color: #f7f9fc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            border: 1px solid #e0e5eb;
        }
        
        .verification-code-label {
            font-size: 16px;
            color: #001e51;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .verification-code {
            font-size: 32px;
            letter-spacing: 5px;
            color: #29a47e;
            font-weight: 700;
            background-color: #ffffff;
            padding: 15px 25px;
            border-radius: 6px;
            display: inline-block;
            border: 1px dashed #29a47e;
        }
        
        /* Nota */
        .note {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 15px;
            font-size: 14px;
            color: #856404;
            margin-top: 25px;
            border-radius: 4px;
        }
        
        /* Pie de página */
        .footer {
            background-color: #f7f9fc;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #e0e5eb;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                border-radius: 0;
            }
            
            .content {
                padding: 20px;
            }
            
            .verification-code {
                font-size: 24px;
                letter-spacing: 3px;
                padding: 10px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- <img src="https://i.postimg.cc/L8JzQGZ5/security-lock.png" alt="{{ $data['aplicacion'] }} Logo"> -->
        </div>
        
        <div class="content">
            <h1 class="title">Código de Verificación</h1>
            
            <div class="message">
                <p>Estimado(a) <span class="highlight">{{ $data['usuario'] }}</span>,</p>
                
                <p>Hemos recibido una solicitud para restablecer su contraseña. Para continuar con el proceso, por favor ingrese el siguiente código de verificación en el campo solicitado:</p>
            </div>
            
            <div class="verification-code-container">
                <div class="verification-code-label">Su código de verificación es:</div>
                <div class="verification-code">{{ $data['codigo'] }}</div>
            </div>
            
            <p><strong>Importante:</strong> Este código tiene una validez de <span class="highlight">2 minutos</span>. Después de este tiempo, el código quedará inactivo y se generará uno nuevo.</p>
            
            <div class="note">
                <strong>Nota de seguridad:</strong> Si usted no ha solicitado este código, por favor comuníquese inmediatamente con nuestro equipo de soporte técnico.
            </div>
        </div>
        
        <div class="footer">
            <p>Todos los derechos reservados &copy; {{ date('Y') }} {{ $data['aplicacion'] }}</p>
            <p>Turrisystem SAS</p>
        </div>
    </div>
</body>
</html>