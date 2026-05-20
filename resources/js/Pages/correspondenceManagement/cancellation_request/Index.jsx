import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatDate } from '../../../hooks/useDate'
import { BreadCrumb } from 'primereact/breadcrumb'
import { CancellationRequest } from './Dialogs/CancellationRequest'
import { Badge } from 'primereact/badge'



export default function Index() {
    const { translations,current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedOptionItem, setSelectedOptionItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([]);
    //Modales
    const [updateStateCanllation, setUpdateStateCanllation] = useState(false);


    useEffect(() => {
        getData()
    },[])
    useEffect(() => {

        if(selectedItem.length == 1) {
            let optionsDia = []

            if (selectedItem[0].request_status==null) {
                optionsDia.push(
                    {
                        label: translations.correspondence_management.cancellation_request.options_speed_dial.acept,
                        icon: 'pi pi-check-circle',
                        command: () => {
                            setSelectedOptionItem(1);
                            setUpdateStateCanllation(true);
                        }
                    },
                    {
                        label: translations.correspondence_management.cancellation_request.options_speed_dial.deny,
                        icon: 'pi pi-times',
                        command: () => {
                            setSelectedOptionItem(2);
                            setUpdateStateCanllation(true)
                        }
                    },
                )
            }
            setOptionsTool([
                ...optionsDia
            ])
        }else{
            setOptionsTool([])
        }

        },[selectedItem])

    async function getData(page = 1,rows = 10,filters) {
        setLoading(true)
        let res = await axios.get(route("cancellation-request.list"),{
            params: {
                page: page,
                perPage: rows,
                null_is_approval: true,
                ...filters
            }
        })
        setAData({
            data: res.data.data,
            per_page: res.data.per_page,
            currentPage: res.data.from,
            lastPage: res.data.total
        })
        if(filters) {
            setFiltersVals(filters)
        }
        setLoading(false)
    }


    const exportI = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('cancellation-request.export'), {
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
    const getStateLabel = (item) => {
        let statusText;
        let badgeSeverity;


        switch (item.request_status) {
            case 1:
                statusText = translations.correspondence_management.cancellation_request.cancellation_request_status.acepted;
                badgeSeverity = 'success'; // Amarillo para "pendiente"
                break;
            case 2:
                statusText = translations.correspondence_management.cancellation_request.cancellation_request_status.rejection;
                badgeSeverity = 'danger'; // Rojo para "devuelto"
                break;
            default:
                statusText = translations.correspondence_management.cancellation_request.cancellation_request_status.waiting_answer;
                badgeSeverity = 'warning'; // Verde para "entregado"
                break;
        }
        return <Badge
                    value={statusText}
                    severity={badgeSeverity}
                    className="custom-badge"
                    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                />;
      };


    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations.correspondence_management.cancellation_request.title }</h1>
                </div>
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
                    <div>
                        <Button icon="pi pi-search" onClick={() => setFilterShow(true)} size='small' label={translations.auth.filters}></Button>
                    </div>
                </div>
            </>
        )
    }

    function page(data) {
        getData(data.page + 1,data.rows)
    }
    function search(e) {
        getData(1,e)
    }
    const items = [{ label: translations.menu.correspondence_management.correspondence_management }, { label: translations.menu.correspondence_management.cancellation_request }];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="single" rows={ AData?.per_page }
                        selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"  first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                        size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column selectionMode='multiple'></Column>
                        <Column header={ translations.correspondence_management.cancellation_request.table.types_filing } field="filing.types_filings.name"></Column>
                        <Column header={ translations.correspondence_management.cancellation_request.table.number_filing } field="filing.filing_number"></Column>
                        <Column header={ translations.correspondence_management.cancellation_request.table.date_request } field={ item => formatDate(item.created_at,true) }></Column>
                        <Column header={ translations.correspondence_management.cancellation_request.table.observation } field="request_observation"></Column>
                        <Column header={translations.correspondence_management.cancellation_request.table.user} field={item=> item.user?.persona?.nombre + ' ' + item.user?.persona?.apellido}/>
                        <Column header={translations.correspondence_management.cancellation_request.table.cancellation_request_status} body={(rowData) => getStateLabel(rowData)}/>

                    </DataTable>
                </div>
                <Dialog modal={true} position='center' visible={updateStateCanllation}
                    header={
                        selectedOptionItem === 1
                            ? translations.correspondence_management.cancellation_request.cancellation_request_status.acepted
                            : translations.correspondence_management.cancellation_request.cancellation_request_status.rejection
                    }
                    style={{ width: '70vw' }} onHide={() => {if (!updateStateCanllation) return; setUpdateStateCanllation(false); }}>

                    <CancellationRequest filing={selectedItem[0]} option={selectedOptionItem} onFinish={() => {setUpdateStateCanllation(false); getData(1);setSelectedItem([]);}} />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className=" speeddial-bottom-right  right-4 bottom-4 " buttonClassName='btn-open' />
            </div>
        </>
    )
}
