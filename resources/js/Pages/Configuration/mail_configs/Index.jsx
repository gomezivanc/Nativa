import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import React, { useRef } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import axios from 'axios'
import { toast } from 'react-toastify'
// import Show from './Show'

export default function Index() {
    const { translations } = usePage()?.props
    const [AData, setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [visibleShow, setVisibleShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations?.menu?.options_speed_dial?.add || 'Agregar',
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route('mail_configs.create'))
            }
        },
    ])

    const toastRef = useRef(null)

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (!selectedItem) {
            return
        }
        setOptionsTool([
            optionsTool[0],
            {
                label: translations?.menu?.options_speed_dial?.edit || 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    router.visit(route('mail_configs.edit', selectedItem.id))
                }
            },
            {
                label: 'Asociar',
                icon: 'pi pi-user-plus',
                command: () => {
                    const url = `/api/google/redirect/${selectedItem.id}`;
                    window.location.href = url;
                }
            },
            {
                label: translations?.menu?.options_speed_dial?.delete || 'Eliminar',
                icon: 'pi pi-trash',
                command: () => {
                    Swal.fire({
                        title: translations?.general?.sure || '¿Estás seguro?',
                        text: translations?.general?.not_undo || 'No podrás deshacer esta acción',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: translations?.general?.yes_delete || 'Sí, eliminar',
                        cancelButtonText: translations?.general?.cancel || 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.delete(route('mail_configs.destroy', selectedItem.id))
                                .then(() => {
                                    toast.success(translations?.general?.deleted_successfully || 'Eliminado correctamente')
                                    getData()
                                    setSelectedItem(null)
                                })
                                .catch((error) => {
                                    toast.error(error.response?.data?.message || translations?.general?.error || 'Error')
                                })
                        }
                    })
                }
            }
        ])
    }, [selectedItem])

    const getData = () => {
        setLoading(true)
        axios.get(route('mail_configs.list'))
            .then((response) => {
                setAData({
                    data: response.data.data,
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page
                })
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || translations?.general?.error || 'Error')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onPage = (event) => {
        setLoading(true)
        axios.get(route('mail_configs.list'), {
            params: { page: event.page + 1, per_page: event.rows }
        })
            .then((response) => {
                setAData({
                    data: response.data.data,
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const breadcrumb = [
        { label: translations?.menu?.configuration || 'Configuración' },
        { label: translations?.menu?.mail_configs || 'Configuración de Correos' }
    ]

    return (
        <>
            <Tooltip target=".custom-target-icon" />
            <Toast ref={toastRef} />
            {/* <BreadCrumb model={breadcrumb} home={{ icon: 'pi pi-home', url: route('dashboard') }} style={{ marginBottom: '20px' }} /> */}

            <div className="card">
                <DataTable
                    value={AData.data}
                    paginator
                    rows={15}
                    totalRecords={AData.lastPage * 15}
                    first={(AData.currentPage - 1) * 15}
                    onPage={onPage}
                    loading={loading}
                    dataKey="id"
                    selection={selectedItem}
                    onSelectionChange={(e) => setSelectedItem(e.value)}
                    selectionMode="single"
                    responsive
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="ID" sortable style={{ width: '10%' }}></Column>
                    <Column field="email" header={translations?.fields?.email || 'Correo'} sortable style={{ width: '35%' }}></Column>
                    <Column field="watch_expiration" header={translations?.fields?.expiration || 'Expiración'} sortable style={{ width: '25%' }} body={(rowData) => {
                        if (!rowData.watch_expiration) return '-'
                        const date = new Date(rowData.watch_expiration * 1000)
                        return date.toLocaleString()
                    }}></Column>
                    <Column field="created_at" header={translations?.fields?.created_at || 'Creado'} sortable style={{ width: '25%' }} body={(rowData) => {
                        return new Date(rowData.created_at).toLocaleString()
                    }}></Column>
                </DataTable>
            </div>

            {/* <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => setVisibleShow(false)}>
                <Show id={selectedItem?.id} />
            </Dialog> */}

            {/* <SpeedDial model={optionsTool} direction="up" type="semi-circle" radius={120} showIcon="pi pi-bars" hideIcon="pi pi-times" /> */}
            <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
            <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
        </>
    )
}
