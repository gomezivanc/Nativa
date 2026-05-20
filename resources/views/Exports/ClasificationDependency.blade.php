@php
    $route_lang = 'documental_gestion.dependency.exportTrd.clasification.';   
@endphp
<table>
    <thead>
        <tr></tr>
        <tr>
            <th></th>
            <th colspan="6" align="center" bgcolor="#2138bb" style="color: white">{{ __($route_lang.'document_classification_chart') }}</th>
        </tr>
        <tr>
            <th></th>
            <th colspan="6" align="center">{{ __($route_lang.'document_management_process') }}</th>
            <th>Version: 01</th>
        </tr>
        <tr>
            <th></th>
            <th colspan="6" align="center">{{ __($route_lang.'preparation_document_retention_table') }}</th>
            <th>{{ __($route_lang.'date') }}: {{ date('d/m/Y') }}</th>
        </tr>
        <tr>
            <th></th>
            <th colspan="6"></th>
            <th>{{ __($route_lang.'page') }}: {{ $page }}</th>
        </tr>
        <tr></tr>
        <tr>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'background') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'code_administrative_unit') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'administrative_unit') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'production_office_code') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'production_office') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'serial_code') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'serie') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'subseries_code') }}</th>
            <th bgcolor="#2138bb" width="40" style="color: white">{{ __($route_lang.'subserie') }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $dependency)
            @if ($dependency->current_version)
                @foreach(json_decode($dependency->current_version->data_json) as $item)
                    <tr>
                        <td></td>
                        <td>{{ $dependency->gdDependency->code ?? 'N/A' }}</td>
                        <td>{{ $dependency->gdDependency->name ?? 'N/A' }}</td>
                        <td>{{ $dependency->code ?? 'N/A'}}</td>
                        <td>{{ $dependency->name ?? 'N/A'}}</td>
                        <td>{{ $item->serie->code ?? 'N/A'}}</td>
                        <td>{{ $item->serie->name ?? 'N/A'}}</td>
                        <td>{{ $item->subseries->code ?? 'N/A' }}</td>
                        <td>{{ $item->subseries->name ?? 'N/A'}}</td>
                    </tr>
                @endforeach
            @endif
        @endforeach
    </tbody>
</table>