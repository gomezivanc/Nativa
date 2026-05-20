import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import axios from 'axios'
import { toast } from 'react-toastify'
import Show from './Show'
import { Filters } from './Filters'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { formatDate } from '../../../hooks/useDate'
import { Loan } from './Dialogs/Loan'

export default function Index() {
    const { translations, current_language } = usePage()?.props
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
                router.visit(route("request-loans.create"))
            }
        },
    ]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(!selectedItem) {
            setOptionsTool([])

            return
        }

        if(selectedItem.length == 0) {
            setOptionsTool([])
            return
        }
        if(selectedItem.some(i => {
            return i.state_loan_id == 6
        })) {
            setOptionsTool([])
            return
        }
        setOptionsTool([
            {
                label: translations.request_loans.request_loans.table.dial.loan,
                icon: 'pi pi-dollar',
                command: () => {
                    setVisibleShow(true)
                }
            },
        ])
    },[selectedItem])

    async function getData(page = 1,rows = 10,filters = {}) {
        setLoading(true)
        let res = await axios.get(route("request-loans.list"),{
            params: {
                page: page,
                perPage: rows,
                onlyExp: true,
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
        axios.get(route('request-loans.export'), {
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
                    <h1 className='text-xl'>{translations.request_loans.request_loans.title }</h1>
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
        setSelectedItem([])
        getData(1,AData.per_page,e)
    }

    return (
        <>
            <div className='h-full mt-4'>
                <div className='md:mx-16'>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="multiple" rows={ AData?.per_page }
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column header="#" field="id" ></Column>
                        <Column header={ translations.request_loans.request_loans.table.num_radicate } ></Column>
                        <Column header={ translations.request_loans.request_loans.table.date } field={ i => formatDate(i.created_at,true) }></Column>
                        <Column header={ translations.request_loans.request_loans.table.subject } ></Column>
                        {/* <Column header={ translations.request_loans.request_loans.table.type_documental } field={i => i.type_documental['name_'+current_language]}></Column> */}
                        <Column header={ translations.request_loans.request_loans.table.exp_file } field="exp_file.name"></Column>
                        <Column header={ translations.request_loans.request_loans.table.file_area } field="exp_files_archived.type_area.file_area"></Column>
                        <Column header={ translations.request_loans.request_loans.table.module } field="exp_files_archived.module"></Column>
                        <Column header={ translations.request_loans.request_loans.table.spacer } field="exp_files_archived.panel"></Column>
                        <Column header={ translations.request_loans.request_loans.table.box } field="exp_files_archived.box"></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.state_loan ? item.state_loan['name_'+current_language] : null }></Column>
                    </DataTable>
                </div>
                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => {if (!visibleShow) return; setVisibleShow(false); }}>
                    <Loan exp_files_ids={selectedItem} onSearch={(e) => {
                        search(e)
                        setVisibleShow(false)
                    }} />
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
