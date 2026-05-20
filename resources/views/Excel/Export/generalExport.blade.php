<style>
    table {
        width: 100%;
        font-size: 6px;  /* Ajusta el tamaño de la fuente para que quepa todo */
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        page-break-inside: auto;  /* Evita que la tabla se rompa entre páginas */
    }

    th, td {
        padding: 4px;  /* Ajusta el padding para que quepa más contenido */
        text-align: left;
        border: 1px solid #ddd;
        word-wrap: break-word; /* Permite que el contenido largo se ajuste dentro de la celda */
    }

    th {
        background-color: #8a8a8a;
        color: white;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }

    tfoot {
        background-color: #f9f9f9;
        font-weight: bold;
    }

    caption {
        font-size: 1.5em;
        margin-bottom: 10px;
    }

    /* Ajuste para que el contenido largo no se desborde */
    td {
        max-width: 120px;  /* Ajusta el ancho máximo de las celdas */
        overflow: hidden;
        text-overflow: ellipsis; /* Muestra "..." si el contenido es demasiado largo */
        white-space: nowrap;  /* Evita que el texto se rompa en varias líneas */
    }
</style>



<table>
    @if (!empty($data))
    <thead>
        <tr>
            @foreach ($data[0] as $key => $value)
                <th> {{ __($translate . '.' . $key) }} </th>
            @endforeach
        </tr>
    </thead>
    @endif
    <tbody>
        @foreach ($data as $row)
            <tr>
                @foreach ($row as $cell)
                    <td>
                        @if(is_array($cell) || is_object($cell))
                            {{ json_encode($cell) }}
                        @else
                            {{ $cell }}
                        @endif
                    </td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>
