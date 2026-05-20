<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        /* CSS Nativo Optimizado y Compacto para PDF (1 sola página) */
        @page { margin: 0; }
        body {
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            color: #334155;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px; /* Reducido para dar más espacio al contenido */
            line-height: 1.4; /* Interlineado más apretado */
        }
        .container {
            width: 100%;
            max-width: 750px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        
        /* Header Institucional Compacto */
        .header {
            background-color: #0f172a; 
            color: #ffffff;
            padding: 20px 25px; /* Altura del header reducida drásticamente */
            text-align: left;
            border-bottom: 3px solid #3b82f6; 
        }
        .header h1 {
            margin: 0;
            font-size: 20px; /* Letra más pequeña */
            font-weight: 300;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .header h1 strong { font-weight: 700; color: #ffffff; }
        .header p {
            margin: 2px 0 0;
            color: #94a3b8;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content { padding: 20px 25px; } /* Padding general reducido */

        /* Alerta de éxito elegante y delgada */
        .status-banner {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 5px solid #22c55e;
            padding: 12px 15px; /* Más delgada */
            margin-bottom: 20px; /* Margen inferior reducido */
            border-radius: 4px;
            color: #166534;
            font-size: 13px; /* Letra más pequeña */
        }

        /* Tabla de Detalles Ultra Compacta */
        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-grid td {
            padding: 8px 10px; /* Menos espacio entre celdas */
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        .info-grid .label {
            color: #64748b;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: bold;
            display: block;
            margin-bottom: 2px;
        }
        .info-grid .value {
            color: #0f172a;
            font-size: 13px;
            font-weight: 600;
            word-wrap: break-word;
        }
        .info-grid .value-highlight {
            color: #2563eb;
            font-size: 15px;
            font-weight: 700;
        }

        /* Bloque de Observaciones Compacto */
        .observation-box {
            background-color: #fffbeb;
            border: 1px solid #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .observation-box h4 {
            margin: 0 0 4px 0;
            color: #b45309;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Sección de Correos Lista para Múltiples Filas */
        .section-title {
            margin: 0 0 10px 0;
            color: #0f172a;
            font-size: 14px;
            font-weight: 600;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }

        .emails-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px; /* Letra pequeña para encajar todo */
        }
        .emails-table th {
            background-color: #f8fafc;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
            padding: 8px; /* Celdas bajitas */
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .emails-table td {
            padding: 6px 8px; /* Celdas bajitas */
            border-bottom: 1px solid #f1f5f9;
            color: #475569;
        }
        
        /* Badges de Estado Pequeños */
        .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 50px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-success { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-pending { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

        /* Advertencia de Rebotes Compacta */
        .alert-box {
            background-color: #fef2f2;
            border: 1px dashed #fca5a5;
            padding: 10px;
            border-radius: 4px;
            margin-top: 15px;
            color: #991b1b;
            font-size: 11px;
        }

        /* Footer Legal Comprimido */
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 15px 25px; /* Menos padding */
            text-align: justify;
        }
        .institution-name {
            color: #0f172a;
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 6px;
            text-align: center;
        }
        .legal-text {
            color: #64748b;
            font-size: 9px; /* Letra pequeña legal */
            line-height: 1.3;
            margin: 0 0 10px 0;
        }
        .uuid-code {
            text-align: center;
            font-family: 'Courier New', Courier, monospace;
            color: #94a3b8;
            font-size: 9px;
            background: #ffffff;
            padding: 5px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Acuse de <strong>Recibo</strong></h1>
        <p>Certificado de Entrega de Correspondencia</p>
    </div>

    <div class="content">
        <div class="status-banner">
            Se certifica formalmente que la correspondencia referente al asunto <strong>"{{ $filing->filing_number ?? 'Asunto General' }}"</strong> ha sido <strong>RECIBIDA</strong> de manera exitosa.
        </div>

        <table class="info-grid">
            <tr>
                <td style="width: 50%;">
                    <span class="label">Número de Radicado</span>
                    <span class="value value-highlight">{{ $filing->filing_number ?? 'N/A' }}</span>
                </td>
                <td style="width: 50%;">
                    <span class="label">Fecha y Hora de Proceso</span>
                    <span class="value">{{ now()->format('d/m/Y H:i') }}</span>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <span class="label">Remitente Registrado</span>
                    <span class="value">{{ $recipient_name ?? 'N/A' }}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="label">Correo Electrónico Destino</span>
                    <span class="value">{{ $recipient_email ?? 'N/A' }}</span>
                </td>
                <td>
                    <span class="label">Método / Tipo de Envío</span>
                    <span class="value">{{ $type ?? 'General' }}</span>
                </td>
            </tr>
        </table>

        @if($observation)
        <div class="observation-box">
            <h4>Observaciones del Documento</h4>
            <div style="color: #92400e; font-size: 12px;">{{ $observation }}</div>
        </div>
        @endif

        @if(isset($emails) && count($emails) > 0)
        <div>
            <h3 class="section-title">Registro de Trazabilidad de Correos</h3>
            <table class="emails-table">
                <thead>
                    <tr>
                        <th>Destinatario</th>
                        <th>Estado</th>
                        <th>Fecha de Registro</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($emails as $email)
                    <tr>
                        <td style="font-weight: 500;">{{ $email->email }}</td>
                        <td>
                            @if($email->status === 'success')
                                <span class="badge badge-success">✓ Enviado</span>
                            @elseif($email->status === 'bounced')
                                <span class="badge badge-error">✗ Rebotado</span>
                            @elseif($email->status === 'failed')
                                <span class="badge badge-error">✗ Error</span>
                            @else
                                <span class="badge badge-pending">⏱ Pendiente</span>
                            @endif
                        </td>
                        <td style="color: #64748b;">
                            @if($email->sent_at)
                                {{ $email->sent_at->format('d/m/Y H:i') }}
                            @elseif($email->bounced_at)
                                {{ $email->bounced_at->format('d/m/Y H:i') }}
                            @else
                                ---
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            @if($emails->whereIn('status', ['bounced', 'failed'])->count() > 0)
            <div class="alert-box">
                <strong>⚠ Nota de Incidencia:</strong> {{ $emails->whereIn('status', ['bounced', 'failed'])->count() }} 
                correo(s) registraron un estado de {{ $emails->where('status', 'bounced')->count() > 0 ? 'rebote' : 'falla' }} durante el proceso.
            </div>
            @endif
        </div>
        @endif
    </div>

    <div class="footer">
        <div class="institution-name">CORTOLIMA</div>
        <p class="legal-text">
            <strong>Exención de Responsabilidad:</strong> Este documento es un comprobante automático de entrega generado por el sistema de información. 
            El presente acuse tiene fines estrictamente informativos de trazabilidad sistémica, carece de peso jurídico vinculante y no podrá ser utilizado 
            como evidencia probatoria legal de recibimiento formal o aceptación de términos.
        </p>
        <div class="uuid-code">Ref. Seguimiento: {{ md5($filing->filing_number . now()) }}</div>
    </div>
</div>

</body>
</html>