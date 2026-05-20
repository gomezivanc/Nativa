import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import axios from 'axios'
import { toast } from 'react-toastify'

export default function Index() {
    const [ Acategories,setACategories] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        getData()
    },[])

    async function getData(page = 1) {
        // setLoading(true)
        // let res = await axios.get(route("documents-category.list"),{
        //     params: {
        //         page: page
        //     }
        // })
        // setACategories({
        //     data: res.data.data,
        //     currentPage: res.data.current_page,
        //     lastPage: res.data.total
        // })
        // setLoading(false)
    }
    function header() {
        return (
            <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Listado de categorias de documentos</h1>
                <Link href={route("documents-category.create")}>
                    <Button label='Crear'/>
                </Link>
            </div>
        )
    }

    function page(data) {
        getData(data.page + 1)
    }

    function actions(data) {
        return (
            <div className='flex gap-2'>
                <Link href={route("documents-category.edit",data.id)}>
                    <Button icon="pi pi-pencil" size='small' severity='warning' rounded text/>
                </Link>
                <Button icon="pi pi-trash" size='small' severity='danger' rounded text onClick={() => Idelete(data.id)}/>
            </div>
        )
    }

    async function Idelete(id,deleted_at) {
        const res = await Swal.fire({
            icon: 'question',
            text: !deleted_at ? translations.auth.confirmation_delete.question_deactivate : translations.auth.confirmation_delete.question_activate,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no,
            confirmButtonText: translations.auth.yes_not.yes
        })

        if(!res.isConfirmed) {
            return
        }
        try {
            await axios.delete(route("documents-category.destroy",id))
            toast.success(translations.auth.confirmation_delete.success)
            getData(1)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }

    return (
        <div>
            <div>
                <DataTable loading={loading} value={Acategories?.data}  header={header} size='small' emptyMessage="No hay datos para mostrar" lazy onPage={page} paginator rows={10} totalRecords={Acategories?.lastPage}>
                    <Column header="Nombre" field='nombre'></Column>
                    <Column header="Estado" field={ (item) => item.deleted_at ? 'No activo' : 'Activo' }></Column>
                    <Column header="Acciones" body={actions}></Column>
                </DataTable>
            </div>
        </div>
    )
}
