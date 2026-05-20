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

export default function Index() {
    const { translations } = usePage()?.props
    const toastRef = useRef(null)
    const [AData, setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
        totalRecords: 0,
        perPage: 10
    })

    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [optionsTool, setOptionsTool] = useState([
        {
            label: 'Agregar',
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("distribution.create"))
            }
        },
    ])

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
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    router.visit(route("distribution.edit", selectedItem.id))
                }
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => {
                    Idelete(selectedItem.id, selectedItem.deleted_at)
                }
            }
        ])
    }, [selectedItem])

    async function getData(page = 1, query = '', perPage = 10) {
        setLoading(true)
        try {
            const res = await axios.get(route('distribution.list'), {
                params: {
                    page: page,
                    perPage: perPage,
                    searchQuery: query,
                    active: 'true'
                }
            })
            setAData({
                data: res.data.data,
                currentPage: res.data.current_page,
                lastPage: res.data.last_page,
                totalRecords: res.data.total,
                perPage: res.data.per_page
            })
        } catch (error) {
            toast.error('Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    async function Idelete(id, deletedAt) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: deletedAt ? 'Esto restaurará el registro' : 'Esto eliminará el registro',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí'
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(route('distribution.destroy', id))
                toast.success('Operación realizada exitosamente')
                await getData(AData.currentPage, searchQuery)
            } catch (error) {
                toast.error('Error al procesar la solicitud')
            }
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        getData(1, query)
    }

    const handlePageChange = (e) => {
        getData(e.page + 1, searchQuery, e.rows)
    }
    
    const items = [{ label: translations.menu.navbar.administration }, { label: translations.menu.configuration.distribution_unit }];

    return (
        <div className="flex flex-col gap-4 p-4">
            <Toast ref={toastRef} />
            <BreadCrumb model={items}/>
                <div className="card">
                    <DataTable 
                        value={AData.data} 
                        paginator 
                        lazy
                        rows={AData.perPage || 10} 
                        rowsPerPageOptions={[10, 20, 30, 100]} 
                        totalRecords={AData.totalRecords}
                        first={(AData.currentPage - 1) * (AData.perPage || 10)} 
                        onPage={handlePageChange} 
                        loading={loading} 
                        dataKey="id" 
                        selectionMode="single" 
                        selection={selectedItem} 
                        onSelectionChange={(e) => setSelectedItem(e.value)}
                    >
                        <Column field="name" header="Nombre Unidad" />
                        <Column field="dependency.name" header="Dependencia" />
                        <Column field="observation" header="Observación" />
                        <Column 
                            header="Estado" 
                            body={(rowData) => (
                                rowData.deleted_at ? 'Inactivo' : 'Activo'
                            )} 
                        />
                    </DataTable>
                </div>
            <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open' />
        </div>
    )
}
