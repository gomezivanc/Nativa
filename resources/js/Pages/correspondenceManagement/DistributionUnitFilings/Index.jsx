import { Link, router, usePage } from '@inertiajs/react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Tag } from 'primereact/tag' // Importante para el estado
import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function Index() {
    const { translations } = usePage()?.props
    const [AData, setAData] = useState([]) 
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            setLoading(true)
            const res = await axios.get(route('distribution.listFull'));
            setAData(res.data) 

        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }

    const actionBodyTemplate = (rowData) => (
        <div className='flex gap-2 justify-center'>
            <Button
                icon='pi pi-eye'
                className="p-button-rounded p-button-text"
                onClick={() => 
                    router.visit(
                        rowData.central_bool != '1'
                            ? route('distribution-unit.show-filings', rowData.id)
                            : route('distribution-unit.other-view', {id: rowData.id_mail, id2: rowData.id})
                    )
                }
                tooltip={translations?.auth?.view_filings || 'Ver radicados'}
            />
        </div>
    )

    const dependencyTemplate = (rowData) => (
        <span>{rowData.dependency?.name || 'N/A'}</span>
    )

    const centralTemplate = (rowData) => (
        <span className={rowData.central_bool ? 'text-green-600 font-bold' : 'text-gray-400'}>
            {rowData.central_bool ? 'Central' : 'Normal'}
        </span>
    )

    const breadcrumbItems = [
        { label: 'Inicio', command: () => router.visit(route('dashboard.index')) },
        { label: 'Unidades de Distribución' },
    ]

    return (
        <div className='p-4'>
            <BreadCrumb model={breadcrumbItems} home={{ icon: 'pi pi-home' }} />

            <div className='card mt-4 bg-white p-4 shadow-sm rounded-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Unidades de Distribución
                    </h1>
                </div>

                <DataTable 
                    value={AData} // Usamos AData directamente (es el array)
                    loading={loading} 
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[10, 20, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                    className='p-datatable-sm'
                    emptyMessage='No se encontraron unidades'
                >
                    <Column field='name' header='Nombre' sortable />
                    
                    <Column header='Dependencia' body={dependencyTemplate} sortable />
                    
                    <Column field='observation' header='Observación' />

                    <Column 
                        header='Radicados' 
                        body={(rowData) => <span className='font-bold text-blue-600'>{rowData.filing_count || 0}</span>} 
                        sortable 
                    />
                    
                    <Column header='Tipo' body={centralTemplate} />

                    <Column body={actionBodyTemplate} header='Acciones' style={{ width: '100px' }} />
                </DataTable>
            </div>

            <SpeedDial 
                model={[
                    {
                        label: 'Crear',
                        icon: 'pi pi-plus',
                        command: () => router.visit(route('distribution.create'))
                    }
                ]} 
                direction='up' 
                className='fixed right-6 bottom-6' 
            />
        </div>
    )
}