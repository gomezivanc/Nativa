import { usePage } from '@inertiajs/react';
import { formatDate } from '../../../hooks/useDate'
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

function ExpFileClassReport({ data }) {
    const { translations, current_language } = usePage()?.props;
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)

    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })

    useEffect(() => {
        getData()
    },[])

    async function getData(page = 1,filters) {
        setLoading(true)
        let res = await axios.get(route("files-exp.list"),{
            params: {
                page: page,
                onlyExp: true,
                ...filters
            }
        })
        setAData({
            data: res.data.data,
            filters: res.data.filters,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        })
        if(filters) {
            setFiltersVals(filters)
        }
        setLoading(false)
    }

    function header() {
        return (
            <>
                <div className="flex md:justify-between">
                    <div className="flex gap-2 flex-wrap mt-2">
                        <div>
                            <Button onClick={() => exportI('csv')} size='small' label='CSV'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('excel')} size='small' label='EXCEL'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('pdf')} size='small' label='PDF'></Button>
                        </div>
                        <div>
                            <Button onClick={() => exportI('pdf')} size='small' label={translations.auth.exports.print}></Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const exportI = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('filing.export'), {
            params: {
                type: type,  // Parámetro para el tipo de archivo
                ...filtersVals
            },
            responseType: 'blob',  // Importante para descargar el archivo como blob
        })
        .then(response => {
            // Obtener el nombre del archivo desde el header
            const fileName = response.headers['x-file-name'] || 'default.csv'; // Si no hay header, usa un nombre predeterminado

            // Crea un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);  // Usar el nombre del archivo obtenido desde el header
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error al exportar el archivo:', error);
            // Opcionalmente, puedes mostrar un mensaje de error aquí.
        });
    };

    function page(data) {
        getData(data.page + 1,data.rows)
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-center mb-6">{ translations.menu.report.exp_file }</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((i, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                    <h2 className="text-lg font-medium text-gray-700">{i.name}</h2>
                    <div className="text-3xl font-bold text-blue-500 mt-4">{i.total}</div>
                </div>
                ))}
            </div>

            <DataTable loading={ loading } value={ AData?.data } header={header} selectionMode="multiple" className='mt-4'
            currentPageReportTemplate="{first} to {last} of {totalRecords}" lazy onPage={page} first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
            size='small' emptyMessage={ translations.auth.not_found } paginator rows={10} totalRecords={AData?.lastPage}>
                <Column header={ translations.documental_gestion.exp_files.table.number } field="number"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.name } field="name"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.serie } field="serie.name"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.subserie } field="subserie.name"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.date_init } field="date_init"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.dependency_id } field="dependency.name"></Column>
                <Column header={ translations.documental_gestion.exp_files.table.creado_por_id } field={ i => `${i.create_by?.persona?.nombre} ${i.create_by?.persona?.apellido ? i.create_by?.persona?.apellido : ''}` }></Column>
                <Column header={ translations.documental_gestion.exp_files.table.clasification_id } field={i => i.clasification ? i.clasification['name_' + current_language] ?? '' : ''}></Column>
                <Column header={ translations.auth.state_table } field={ (item) => item.deleted_at ? translations.documental_gestion.exp_files.form.state.inactive : translations.documental_gestion.exp_files.form.state.active }></Column>
            </DataTable>
        </div>
    );
}

export default ExpFileClassReport;
