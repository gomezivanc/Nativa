import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Link, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import axios from 'axios'
import { toast } from 'react-toastify'
import { Dropdown } from 'primereact/dropdown'

export default function Index() {
    const { translations } = usePage()?.props
    const [Acategories, setACategories] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    async function getData(page = 1, filters) {
        setLoading(true)

        let afilters = {}
        for (const key in filters) {
            afilters[key] = filters[key].value;
        }

        let res = await axios.get(route("manual-usuario.list"), {
            params: {
                page: page,
                ...afilters
            }
        })
        setACategories({
            data: res.data.data,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        })
        setLoading(false)
    }

    function header() {
        return (
            <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Manuales de usuario</h1>
                <Link href={route("manual-usuario.create")}>
                    <Button label='Crear' />
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
                <Link href={route("manual-usuario.edit", data.id)}>
                    <Button icon="pi pi-pencil" size='small' severity='warning' rounded text />
                </Link>
                {
                    !data.deleted_at && <Button icon="pi pi-trash" size='small' severity='danger' tooltip="Desactivar" tooltipOptions={{ position: 'top' }} rounded text onClick={() => Idelete(data)} />
                }
                {
                    data.deleted_at && <Button icon="pi pi-reply" size='small' severity='success' tooltip="Restaurar" tooltipOptions={{ position: 'top' }} rounded text onClick={() => Idelete(data)} />
                }
            </div>
        )
    }

    async function Idelete(id) {
        const res = await Swal.fire({
            icon: 'question',
            text: "¿Desea desactivar el registro?",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        })

        if (!res.isConfirmed) {
            return
        }
        try {
            await axios.delete(route("manual-usuario.destroy", id))
            toast.success("Desactivado con exito")
            getData(1)
        } catch (error) {
            toast.error("Ups... ocurrio un error")
        }
    }

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} optionValue='value' optionLabel='name' options={[{ name: 'Activo', value: true }, { name: 'Inactivo', value: false }]}
                onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Estado" showClear style={{ minWidth: '12rem' }} />
        );
    };

    return (
        <div>
            <div className="md:mx-16">
                <DataTable
                    loading={loading}
                    value={Acategories?.data}
                    header={header}
                    size="small"
                    filterDisplay="row"
                    showGridlines
                    stripedRows
                    globalFilterFields={['nombre_tipo_contratacion', 'codigo_fut', 'isactive']}
                    onFilter={(e) => getData(1, e.filters)}
                    emptyMessage={translations.menu.user_manual.table.no_data_message}  // Traducción
                    lazy
                    onPage={page}
                    paginator
                    rows={10}  // Traducción
                    totalRecords={Acategories?.lastPage}
                >
                    <Column
                        filter
                        showFilterMenu={false}
                        header={translations.menu.user_manual.table.manual} // Traducción
                        field="nombre"
                    ></Column>

                    <Column
                        filter
                        showFilterMenu={false}
                        header={translations.menu.user_manual.table.file}  // Traducción
                        filterField="archivo_nombre"
                        body={data => (
                            <a
                                className="text-blue-600 cursor-pointer"
                                href={data.archivo}
                                download
                                tooltip={translations.menu.user_manual.table.download} // Traducción
                                tooltipOptions={{ position: 'top' }}
                            >
                                {data.archivo_nombre}
                            </a>
                        )}
                    ></Column>

                    <Column
                        filter
                        showFilterMenu={false}
                        filterElement={statusRowFilterTemplate}
                        filterField="isactive"
                        header={translations.menu.user_manual.table.status}  // Traducción
                        field={item => item.deleted_at ? translations.menu.user_manual.table.status_inactive : translations.menu.user_manual.table.status_active} // Traducción
                    ></Column>

                    <Column
                        header={translations.menu.user_manual.table.actions}  // Traducción
                        body={actions}
                    ></Column>
                </DataTable>
            </div>
        </div>
    )
}