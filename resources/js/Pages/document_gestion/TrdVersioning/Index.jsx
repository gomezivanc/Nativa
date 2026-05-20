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
import Show from './Show'
import { Filters } from './Filters'

export default function Index() {
    const { translations } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [visibleShow, setVisibleShow] = useState(false);
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [optionsTool, setOptionsTool] = useState([]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(!selectedItem) {
            return
        }
        setOptionsTool([
            {
                label: 'Add',
                icon: 'pi pi-check',
                command: async () => {
                    const { value: inputValue } = await Swal.fire({
                        title: 'Observación',
                        input: 'text',
                        inputLabel: 'Observación',
                        inputPlaceholder: 'Observación',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        inputValidator: (value) => {
                            if (!value) {
                            return '¡Debes escribir algo!';
                            }
                        },
                    });
                    if (inputValue) {
                        try {
                            await axios.post(route('trd-versioning.activeH'),{
                                id: selectedItem.id,
                                is_approval: 1,
                                observation: inputValue
                            })
                            getData(1)
                            toast.success(translations.auth.success)
                        } catch (error) {
                            console.error(error);

                            toast.error(translations.auth.error)
                        }
                    }
                }
            },
            {
               label: translations.menu.options_speed_dial.delete,
                icon: 'pi pi-trash',
                command: async () => {
                    const res = await Swal.fire({
                        title: '¿Desea realizar la acción?',
                        icon: 'question',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                    });

                    if(!res.isConfirmed) {
                        return
                    }

                    try {
                        await axios.post(route('trd-versioning.store'),{
                            id: selectedItem.id,
                            is_approval: 0,
                        })
                        getData(1)
                        toast.success(translations.auth.success)
                    } catch (error) {
                        console.error(error);

                        toast.error(translations.auth.error)
                    }
                }
            },
            {
                label: translations.menu.options_speed_dial.detail,
                icon: 'pi pi-eye',
                command: () => {
                    router.visit('/documental-gestion/trd-versioning-show-view/'+selectedItem.id)
                }
            },
        ])
    },[selectedItem])

    async function getData(page = 1,filters) {
        setLoading(true)
        let res = await axios.get(route("trd-versioning.list"),{
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
    const exportI = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('trd-verioning.export'), {
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

    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations.documental_gestion.trd_versioning.title }</h1>
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
        getData(data.page + 1)
    }
    function search(e) {
        getData(1,e)
    }

    return (
        <>
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="single"
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)} lazy onPage={page}
                    size='small' emptyMessage={ translations.auth.not_found } paginator rows={10} totalRecords={AData?.lastPage}>
                        <Column header={ translations.documental_gestion.trd_versioning.table.dependency } field={ i => `${i?.dependency?.code || 'N/A' } ${i?.dependency?.name || 'N/A' }` }></Column>
                        <Column header={ translations.documental_gestion.trd_versioning.table.serie } field={ i => `${ i?.serie?.code || 'N/A'  } ${i.serie.name}` }></Column>
                        <Column header={ translations.documental_gestion.trd_versioning.table.Subserie } field={ i => `${ i?.subserie?.code || 'N/A'  } ${i.subserie.name}` }></Column>
                        <Column header={ translations.documental_gestion.trd_versioning.table.type_doc } field="name"></Column>
                        <Column header={ translations.documental_gestion.trd_versioning.table.created_at } field="created_at"></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.deleted_at ? translations.auth.state.inactive : translations.auth.state.active }></Column>
                    </DataTable>
                </div>
                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => {if (!visibleShow) return; setVisibleShow(false); }}>
                    <Show data={selectedItem} />
                </Dialog>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters filters={AData.filters} onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            </div>
        </>
    )
}
