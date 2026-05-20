import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { BreadCrumb } from 'primereact/breadcrumb'
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
    const [visibleShow, setVisibleShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [optionsTool, setOptionsTool] = useState([
        {
           label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("satisfaction-survey.create"))
            }
        },
    ]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(!selectedItem) {
            return
        }


        setOptionsTool([
            optionsTool[0],
            {
                label: translations.menu.options_speed_dial.see_graph,
                icon: 'pi pi-chart-pie',
                command: () => {
                    if(selectedItem) {
                        router.visit(route('satisfaction-survey.response.resume',{ survey_id: selectedItem.id}))
                        return
                    }
                    router.visit(route("satisfaction-survey.response.resume"))
                }
            },
            {
               label: translations.menu.options_speed_dial.edit,
                icon: 'pi pi-pencil',
                command: () => {
                    router.visit(route("satisfaction-survey.edit",selectedItem.id))
                }
            },
            {
               label: translations.menu.options_speed_dial.delete,
                icon: 'pi pi-trash',
                command: () => {
                    Idelete(selectedItem.id,selectedItem.deleted_at)
                }
            },
            {
                label: translations.menu.options_speed_dial.detail,
                icon: 'pi pi-eye',
                command: () => {
                    setVisibleShow(true)
                }
            },
            {
                label: translations.menu.options_speed_dial.response,
                icon: 'pi pi-reply',
                command: () => {
                    router.visit(route('satisfaction-survey.response',selectedItem.id))
                }
            },
        ])
    },[selectedItem])

    async function getData(page = 1,rows = 10,filters = {}) {
        setLoading(true)
        let res = await axios.get(route("satisfaction-survey.list"),{
            params: {
                page: page,
                perPage: rows,
                ...filters
            }
        })
        setAData({
            data: res.data.data,
            per_page: res.data.per_page,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        })
        setLoading(false)
    }
    const exportI = (type) => {
        axios.get(route('satisfaction-survey.export'), {
            params: {
                type: type,
                ...filtersVals,
            },
            responseType: 'blob',
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
                    <h1 className='text-xl'>{translations.configuration.satisfaction_survey.title }</h1>
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

    async function Idelete(id,deleted_at) {
        const res = await Swal.fire({
            icon: 'question',
            text: !deleted_at ? translations.auth.confirmation_delete.question_deactivate : translations.auth.confirmation_delete.question_activate,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no
            ,confirmButtonText: translations.auth.yes_not.yes
        })

        if(!res.isConfirmed) {
            return
        }
        try {
            await axios.delete(route("satisfaction-survey.destroy",id))
            toast.success(translations.auth.confirmation_delete.success)
            getData(1)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }

    function search(e) {
        setSelectedItem([])
        getData(1,AData.per_page,e)
    }
    const items = [{ label: translations.menu.configuration.configuration }, { label: translations.menu.configuration.satisfaction_survey }];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)} value={ AData?.data } header={ header } selectionMode="single" rows={ AData?.per_page }
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column header={ translations.configuration.satisfaction_survey.table.name } field="name"></Column>
                        <Column header={ translations.configuration.satisfaction_survey.table.num_questions } field="questions_count"></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.deleted_at ? translations.auth.state.inactive : translations.auth.state.active }></Column>
                    </DataTable>
                </div>
                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => {if (!visibleShow) return; setVisibleShow(false); }}>
                    <Show data={selectedItem} />
                </Dialog>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            </div>
        </>
    )
}
