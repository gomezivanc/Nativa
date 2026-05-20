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
import { BreadCrumb } from 'primereact/breadcrumb'

import axios from 'axios'
import { toast } from 'react-toastify'
import Show from './Show'

export default function Index() {
    const { translations } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })

    const [visibleShow, setVisibleShow] = useState(false);
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [optionsTool, setOptionsTool] = useState([
        {
           label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("trd.create"))
            }
        },
    ]);
    //Para inicializar la vista
    useEffect(() => {
        getData()
    },[])
    //Para hacer reactivo un useState() [WATCH en vue]
    useEffect(() => {
        if(!selectedItem) {
            return
        }
        setOptionsTool([
            optionsTool[0],
            {
               label: translations.menu.options_speed_dial.edit,
                icon: 'pi pi-pencil',
                command: () => {
                    router.visit(route("trd.edit",selectedItem.id))
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
                    // Idelete(selectedItem.id,selectedItem.deleted_at)
                }
            },
        ])
    },[selectedItem])

    async function getData(page = 1) {
        setLoading(true)
        let res = await axios.get(route("trd.list"),{
            params: {
                page: page
            }
        })
        setAData({
            data: res.data.data,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        })
        setLoading(false)
    }
    const exportI = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('trd.export'), {
            params: {
                type: type,  // Parámetro para el tipo de archivo
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
                    <h1 className='text-xl'>{translations.configuration.trd.title }</h1>
                </div>
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
            </>
        )
    }

    function page(data) {
        getData(data.page + 1)
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
            await axios.delete(route("trd.destroy",id))
            toast.success(translations.auth.confirmation_delete.success)
            getData(1)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }
    const items = [{ label: translations.menu.configuration.configuration }, { label: translations.menu.configuration.trd }];
    const home = { icon: 'pi pi-home', url: '/main' }

    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="single"
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator rows={10} totalRecords={AData?.lastPage}>
                        <Column header={ translations.configuration.trd.table.mask } field="mask.name"></Column>
                        <Column header={ translations.configuration.trd.table.dependency_code } field="dependency_code"></Column>
                        <Column header={ translations.configuration.trd.table.unity_admin } field="unity_admin"></Column>
                        <Column header={ translations.configuration.trd.table.dependency_name } field="dependency_name"></Column>
                        <Column header={ translations.configuration.trd.table.regional } field="regional"></Column>
                        <Column header={ translations.configuration.trd.table.init_data } field="init_data"></Column>
                        <Column header={ translations.configuration.trd.table.code_trd } field="code_trd"></Column>
                        <Column header={ translations.configuration.trd.table.series_sub_series_t_doc } field="series_sub_series_t_doc"></Column>
                        <Column header={ translations.configuration.trd.table.series_sub_series_t_doc } field="series_sub_series_t_doc"></Column>
                        <Column header={ translations.configuration.trd.table.series_sub_series_t_doc } field="series_sub_series_t_doc"></Column>
                        <Column header={ translations.configuration.trd.table.item_standard } field="item_standard"></Column>
                        <Column header={ translations.configuration.trd.table.item_support_p } field="item_support_p"></Column>
                        <Column header={ translations.configuration.trd.table.item_support_e } field="item_support_e"></Column>
                        <Column header={ translations.configuration.trd.table.item_support_o } field="item_support_o"></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.deleted_at ? translations.auth.state.inactive : translations.auth.state.active }></Column>
                    </DataTable>
                </div>
                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => {if (!visibleShow) return; setVisibleShow(false); }}>
                    <Show data={selectedItem} />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            </div>
        </>
    )
}
