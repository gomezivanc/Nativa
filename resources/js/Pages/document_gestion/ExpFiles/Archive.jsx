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
import { ArchiveDialog } from './Dialogs/Archive'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { formatDate } from '../../../hooks/useDate'

export default function Index() {
    const { translations, current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.documental_gestion.dependency.dial.show,
            icon: 'pi pi-eye',
            command: () => {

                router.visit(route('files-exp.Detail',selectedItem[0].id))
            }
        }
    ]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(selectedItem.length == 0) {
            setOptionsTool([])
            return
        }

        let options = [
            {
                label: translations.documental_gestion.dependency.dial.show,
                icon: 'pi pi-eye',
                command: () => {

                    router.visit(route('files-exp.Detail',selectedItem[0].id))
                }
            }
        ];

        if(selectedItem.length == 1) {
            let selectedItem2 = selectedItem[0];

            if(selectedItem2.exp_files_archived_count > 0) {
                options.push({
                    label: translations.documental_gestion.dependency.dial.cash_register,
                    icon: 'pi pi-file-export',
                    command: () => {
                        exportSheet(selectedItem);
                    }
                });
                options.push({
                    label: translations.documental_gestion.dependency.dial.folder_register,
                    icon: 'pi pi-folder-open',
                    command: () => {
                        exportSheet2(selectedItem)
                    }
                })
            } else {
                // Si no tiene archivos archivados, agregar opción de archivo
                options.push({
                    label: translations.documental_gestion.exp_files.table.dials.archive_exp,
                    icon: 'pi pi-sort-down',
                    command: () => {
                        setShowArchive(true);
                    }
                });
            }
        }

        setOptionsTool(options);
    }, [selectedItem]);


    async function getData(page = 1,rows = 10,filters = {}) {
        setLoading(true)
        let res = await axios.get(route("files-exp.list"),{
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
        axios.get(route('files-exp.exportArchive'), {
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
    const exportSheet = (selectedItem3) => {

        // Realiza la solicitud GET con axios
        axios.get(route('exp-files-archived.exportSheets'), {
            params: {
                ids: selectedItem3.map(i => i.id),  // Parámetro para el tipo de archivo
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
    const exportSheet2 = (selectedItem3) => {
        // Realiza la solicitud GET con axios
        axios.get(route('exp-files-archived.FolderRotule'), {
            params: {
                id: selectedItem3[0]?.id,  // Parámetro para el tipo de archivo
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

    function closeFinish() {
        getData(1,AData.per_page)
        setCloseShow(false)
    }

    function header() {
        return (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>{translations.documental_gestion.exp_files.title }</h1>
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
        setSelectedItem([])
        getData(1,AData.per_page,e)
    }

    return (
        <>
            <div className='h-full mt-4'>
                <div>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="multiple" rows={ AData?.per_page }
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.number } field="number"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.name } field="name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.description } field="description"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.serie } field="serie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.subserie } field="subserie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.created_at } field={i => formatDate(i.created_at,true)}></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.time_gestion } field={i => formatDate(i.created_at,true)}></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.time_central } field={i => i.exp_files_archived ? formatDate(i.exp_files_archived?.created_at,true) : ''}></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.space } field={ (item) => item.exp_files_archived_count > 0 ? translations.documental_gestion.exp_files.table.space_states.assigned : translations.documental_gestion.exp_files.table.space_states.not_assigned }></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.exp_files_archived_count > 0 ? translations.archive_gestion.physicalSpace.table.state.archived : translations.archive_gestion.physicalSpace.table.state.pending }></Column>
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Dialog modal={false} position='top' visible={showArchive} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!showArchive) return; setShowArchive(false); }}>
                    <ArchiveDialog exp_files_ids={selectedItem} onSearch={(e) => {
                        search(e)
                        setShowArchive(false)

                        setSelectedItem([])
                    }} />
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            </div>
        </>
    )
}
