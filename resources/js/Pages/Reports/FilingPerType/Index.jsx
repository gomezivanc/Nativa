import { usePage } from '@inertiajs/react';
import { formatDate } from '../../../hooks/useDate'
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

function RadicadoReport({ data }) {
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
        let res = await axios.get(route("filing.list"),{
            params: {
                page: page,
                null_is_approval: true,
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
    const getStateLabel = (item) => {
        if (item.deleted_at) return translations.auth.state.inactive;
        if (item.finished) return translations.filing.standard_filing.completed_file;
        if (item.cancelation_request) return translations.filing.standard_filing.options_speed_dial.cancellation_request;
        return translations.auth.state.active;
    };

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
            <h1 className="text-2xl font-semibold text-center mb-6">{ translations.menu.report.filing_type }</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((i, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                    <h2 className="text-lg font-medium text-gray-700">{i.name}</h2>
                    <div className="text-3xl font-bold text-blue-500 mt-4">{i.total}</div>
                </div>
                ))}
            </div>

            <DataTable loading={ loading } value={ AData?.data } header={header} selectionMode="multiple" className='mt-4'
            currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)} lazy onPage={page}
            size='small' emptyMessage={ translations.auth.not_found } paginator rows={10} totalRecords={AData?.lastPage}>
                <Column header={ translations.filing.standard_filing.table.types_filing } field="types_filings.name"></Column>
                <Column header={ translations.filing.standard_filing.table.number_filing } field="filing_number"></Column>
                <Column header={ translations.filing.standard_filing.table.creation_date } field={ item => formatDate(item.created_at,true) }></Column>
                <Column header={ translations.filing.standard_filing.table.client } field={ item => item.name_social_reason_sender +" "+item.first_surname_legal_representative_sender}></Column>
                <Column header={ translations.filing.standard_filing.table.subject } field="subject"></Column>
                <Column header={ translations.filing.standard_filing.table.documental_type } field={(item) => item?.documental_type?.['name_'+current_language] || 'N/A' }></Column>
                <Column header={ translations.filing.standard_filing.table.due_date } field={ item => formatDate(item.expiration_date,false,true)}></Column>
                <Column header={ translations.filing.standard_filing.table.priority } field={(item) => item?.priority?.['name_'+current_language] || 'N/A' } ></Column>
                <Column header={ translations.filing.standard_filing.table.document } field=""></Column>
                <Column header={ translations.filing.standard_filing.table.permission_file } field={(item)=> item?.clasification?.['name_'+current_language] || 'N/A' }></Column>
                <Column header={ translations.auth.state_table } field={getStateLabel} ></Column>
            </DataTable>
        </div>
    );
}

export default RadicadoReport;
