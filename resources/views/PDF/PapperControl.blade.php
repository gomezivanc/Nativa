<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoja de Control</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --border-color: #ddd;
            --header-bg: #f8f9fa;
            --table-stripe: #f5f7fa;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
            padding: 20px;
        }
        
        .container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            padding: 15px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-section {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--primary-color);
        }
        
        .header-row {
            display: table-row;
        }
        
        .header-cell {
            display: table-cell;
            padding: 8px;
            vertical-align: middle;
        }
        
        .logo-cell {
            width: 20%;
            padding-right: 15px;
        }
        
        .title-cell {
            text-align: center;
        }
        
        .info-cell {
            width: 25%;
            text-align: right;
        }
        
        .document-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--primary-color);
            margin: 10px 0;
            text-align: center;
            text-transform: uppercase;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
        }
        
        th, td {
            border: 1px solid var(--border-color);
            padding: 8px 10px;
            text-align: left;
        }
        
        th {
            background-color: var(--header-bg);
            font-weight: 500;
            color: var(--primary-color);
            text-transform: uppercase;
            font-size: 11px;
        }
        
        tr:nth-child(even) {
            background-color: var(--table-stripe);
        }
        
        .label {
            font-weight: 700;
            color: var(--primary-color);
            display: block;
            margin-bottom: 3px;
        }
        
        .value {
            color: #555;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .company-name {
            font-weight: 700;
            color: var(--primary-color);
            font-size: 14px;
        }
        
        .system-name {
            font-size: 12px;
            color: var(--secondary-color);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .info-box {
            border: 1px solid var(--border-color);
            padding: 10px;
            background-color: #fff;
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .documents-table th {
            text-align: center;
        }
        
        .documents-table td {
            vertical-align: top;
        }
        
        .footer-section {
            margin-top: 30px;
            border-top: 1px solid var(--border-color);
            padding-top: 15px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border: none;
                padding: 0;
            }
        }
        
        @media (max-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Encabezado -->
    <div class="header-section">
        <div class="header-row">
            {{-- <div class="header-cell logo-cell">
                <img src="logo.png" alt="Logo" width="100">
            </div> --}}
            {{-- <div class="header-cell title-cell">
                <div class="company-name">SKINA TECHNOLOGIES S.A.S</div>
                <div class="system-name">SISTEMA DE GESTIÓN DE CALIDAD</div>
            </div> --}}
            <div class="header-cell info-cell">
            </div>
        </div>
        <div class="header-row">
            <div class="header-cell logo-cell"></div>
            <div class="header-cell title-cell">
                <div class="document-title">Hoja de Control</div>
            </div>
            <div class="header-cell info-cell">
                <div><strong>VERSIÓN:</strong> 1</div>
                <div><strong>FECHA:</strong> {{ date('d-m-Y') }}</div>
            </div>
        </div>
        <div class="header-row">
            <div class="header-cell logo-cell"></div>
            <div class="header-cell title-cell"></div>
            <div class="header-cell info-cell">
                <div><strong>CÓDIGO:</strong>{{ $expFile->dependency?->code }}</div>
            </div>
        </div>
    </div>

    <!-- Información General -->
    <div class="section">
        <div class="info-box">
            <span class="label">FECHA</span>
            <span class="value">2024-05-02 14:22:04</span>
        </div>
    </div>

    <!-- Información General usando tablas en lugar de grid -->
    <div class="section">
        <table class="info-table">
            <tr>
                <td width="50%">
                    <div class="info-box">
                        <span class="label">NOMBRE DE LA UNIDAD ADMINISTRATIVA</span>
                        <span class="value">DEPENDENCIA PRUEBAS SKINATECH</span>
                    </div>
                </td>
                <td width="50%">
                    <div class="info-box">
                        <span class="label">NOMBRE DE LA OFICINA PRODUCTORA</span>
                        <span class="value">DEPENDENCIA PRUEBAS SKINATECH</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="info-box">
                        <span class="label">SERIE</span>
                        <span class="value">{{ $expFile->serie['name'] }}</span>
                    </div>
                </td>
                <td>
                    <div class="info-box">
                        <span class="label">CÓDIGO</span>
                        <span class="value">{{ $expFile->serie['code'] }}</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="info-box">
                        <span class="label">SUBSERIE</span>
                        <span class="value">{{ $expFile->subserie['name'] }}</span>
                    </div>
                </td>
                <td>
                    <div class="info-box">
                        <span class="label">CÓDIGO</span>
                        <span class="value">{{ $expFile->subserie['code'] }}</span>
                    </div>
                </td>
            </tr>
            {{-- <tr>
                <td colspan="2">
                    <div class="info-box">
                        <span class="label">TÍTULO</span>
                        <span class="value">Pruebas de orfeo 3356</span>
                    </div>
                </td>
            </tr> --}}
        </table>
    </div>

    <!-- Tabla de Documentos -->
    <div class="section">
        <table class="documents-table">
            <thead>
                <tr>
                    <th width="5%">NO.</th>
                    <th width="20%">FECHA</th>
                    <th width="35%">TIPO DOCUMENTAL</th>
                    <th width="10%">FOLIOS</th>
                    <th width="30%">TIPO DE SOPORTE (DIGITAL/FÍSICO)</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($expFile->files as $key => $item)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>{{ $item->created_at->format('d-m-Y H:i') }}</td>
                        <td>{{ $item->type_documental?->{'name_'.session('locale','es')} }}</td>
                        <td></td>
                        <td>{{ $item->type_doc_id == 3 ? 'Digitalizada':'Fisica'}}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Firmas -->
    <div class="footer-section">
        <table>
            <tr>
                <td width="40%"><strong>Nombre de quién elaboró:</strong></td>
                <td>{{ Auth::user()->persona?->nombre }} {{ Auth::user()->persona?->apellido }}</td>
            </tr>
            {{-- <tr>
                <td><strong>Nombre de quién revisó:</strong></td>
                <td></td>
            </tr> --}}
        </table>
    </div>
</div>

</body>
</html>