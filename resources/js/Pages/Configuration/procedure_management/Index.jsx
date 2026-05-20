import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import axios from 'axios'
import { toast } from 'react-toastify'
import Show from './Show'
import { Filters } from './Filters'

export default function Index() {
    const { translations } = usePage()?.props
    const [AData, setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [visibleShow, setVisibleShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useRef(null);
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("procedure-management.create"))
            }
        },
    ]);

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (!selectedItem) return

        setOptionsTool([optionsTool[0],
            {
                label: translations.menu.options_speed_dial.edit,
                icon: 'pi pi-pencil',
                command: () => router.visit(route("procedure-management.edit", selectedItem.id))
            },
            {
                label: translations.menu.options_speed_dial.delete,
                icon: 'pi pi-trash',
                command: () => Idelete(selectedItem.id, selectedItem.deleted_at)
            },
            {
                label: translations.menu.options_speed_dial.detail,
                icon: 'pi pi-eye',
                command: () => setVisibleShow(true)
            },
        ])
    }, [selectedItem])

    async function getData(page = 1, rows = 10, filters = {}) {
        setLoading(true)
        const res = await axios.get(route("procedure-management.list"), {
            params: { page, perPage: rows, ...filters }
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
        axios.get(route('procedure-management.export'), {
            params: { type, ...filtersVals },
            responseType: 'blob'
        })
            .then(response => {
                const fileName = response.headers['x-file-name'] || 'default.csv';
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error al exportar el archivo:', error);
            });
    };

    function header() {
        return (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{translations.configuration.procedure_management.title}</h1>
                <div className="flex flex-wrap gap-2">
                    <Button label="CSV" onClick={() => exportI('csv')} icon="pi pi-file" size="small" />
                    <Button label="Excel" onClick={() => exportI('excel')} icon="pi pi-file-excel"  size="small" />
                    <Button label="PDF" onClick={() => exportI('pdf')} icon="pi pi-file-pdf"  size="small" />
                    <Button label={translations.auth.exports.print} onClick={() => exportI('pdf')} icon="pi pi-print" size="small" />
                    <Button label={translations.auth.filters} icon="pi pi-filter" onClick={() => setFilterShow(true)} size="small" />
                </div>
            </div>
        )
    }

    function page(data) {
        getData(data.page + 1, data.rows)
    }

    async function Idelete(id, deleted_at) {
        const res = await Swal.fire({
            icon: 'question',
            text: !deleted_at ? translations.auth.confirmation_delete.question_deactivate : translations.auth.confirmation_delete.question_activate,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no,
            confirmButtonText: translations.auth.yes_not.yes
        })

        if (!res.isConfirmed) return

        try {
            await axios.delete(route("procedure-management.destroy", id))
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: translations.auth.confirmation_delete.success,
                life: 3000
            });
            getData(1)
        } catch (error) {
            const key = error?.response?.data?.message;

            const message = translations.configuration.procedure_management.error[key]
                || translations.auth.error;

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000
            });
        }
    }

    function search(e) {
        getData(1, AData.per_page, e)
    }

    const items = [
        { label: translations.menu.configuration.configuration },
        { label: translations.menu.configuration.procedure_management }
    ];
    const home = { icon: 'pi pi-home', url: '/main' }

    return (
        <>
            <BreadCrumb model={items} home={home} />
            <div className='h-full mt-4'>
                <DataTable
                    loading={loading}
                    value={AData?.data}
                    header={header}
                    selectionMode="single"
                    rows={AData?.per_page}
                    selection={selectedItem}
                    onSelectionChange={(e) => setSelectedItem(e.value)}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small'
                    emptyMessage={translations.auth.not_found}
                    lazy
                    onPage={page}
                    paginator
                    totalRecords={AData?.lastPage}
                >
                    <Column header={translations.configuration.procedure_management.table.name} field="name" />
                    <Column header={translations.configuration.procedure_management.table.response_time} field="response_time" />
                    <Column
                        header={translations.auth.state_table}
                        body={(item) => (
                            <span className={`font-semibold ${item.deleted_at ? 'text-red-500' : 'text-green-600'}`}>
                                {item.deleted_at ? translations.auth.state.inactive : translations.auth.state.active}
                            </span>
                        )}
                    />
                </DataTable>

                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => setVisibleShow(false)}>
                    <Show data={selectedItem} />
                </Dialog>

                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => setFilterShow(false)}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>

                <Toast ref={toast} />

                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial
                    model={optionsTool}
                    direction="up"
                    className="speeddial-bottom-right fixed right-4 bottom-4 z-50"
                    buttonClassName="p-button-rounded"
                />
            </div>
        </>
    )
}
