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
import { Filters } from './Filters'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'

export default function Index({ data }) {
    const { translations, current_language } = usePage()?.props
    const [filterShow, setFilterShow] = useState(false);
    const [closeShow, setCloseShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const columns = Array.from({ length: 15 }, (_, i) => i + 1);

    useEffect(() => {
    },[])

    async function getData(page = 1,rows = 10,filters = {}) {

    }

    const exportI = (type) => {
        axios.get(route('filing-days.export'), {
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
    const exportPackageZip = (type) => {
        // Realiza la solicitud GET con axios
        axios.get(route('files-exp.exportPackageZip'), {
            params: {
                id: selectedItem[0].id,  // Parámetro para el tipo de archivo
            },
            responseType: 'blob',  // Importante para descargar el archivo como blob
        })
        .then(response => {
            // Obtener el nombre del archivo desde el header
            let fileName = response.headers['content-disposition'] || 'default.csv'; // Si no hay header, usa un nombre predeterminado
            if (fileName) {
                const fileNameMatch = fileName.match(/filename\*?=['"]?UTF-8['"]?'?([^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = decodeURIComponent(fileNameMatch[1]);
                }
            }
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
                    <h1 className='text-xl'>{translations.menu.report.filing }</h1>
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
            await axios.delete(route("files-exp.destroy",id))
            toast.success(translations.auth.confirmation_delete.success)
            getData(1)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }

    function search(e) {
        router.get(route('filing-days.reports'), e, {
            preserveState: true, // Mantiene el estado actual sin perder scroll ni datos temporales
            preserveScroll: true, // Evita que la página haga scroll hacia arriba
        });
    }

    function getTotal() {
        let total = 0
        for (const key in data[0]) {
            if (Object.prototype.hasOwnProperty.call(data[0], key)) {
                const element = data[0][key];
                total += parseInt(element)
            }
        }
        return total
    }

    return (
        <>
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ data } header={ header } selectionMode="multiple" showGridlines lazy onPage={page}
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    size='small' emptyMessage={ translations.auth.not_found }>
                        {
                            columns.map((col, index) => {
                                return <Column key={index} field={`${col}_days`} header={translations.report.filing_day.table.days+' '+col} sortable></Column>
                            })
                        }
                        <Column field="15_plus_days" header={translations.report.filing_day.table.days_response} sortable></Column>
                        <Column field="total" header={translations.report.filing_day.table.total} sortable body={<>
                            <span>{ getTotal() }</span>

                        </>}></Column>
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
            </div>
        </>
    )
}
