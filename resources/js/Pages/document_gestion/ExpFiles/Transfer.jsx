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
import { Filters } from './FiltersTransfer'
import { InputTextarea } from 'primereact/inputtextarea'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { useForm } from 'react-hook-form'
import { useLoading } from '../../../Context/preloadContext'
import { ArchiveDialog } from './Dialogs/Archive'

export default function Index() {
    const { translations, current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [filterShow, setFilterShow] = useState(false);
    const [showTransferManual, setShowTransferManual] = useState(false);
    const [showTransferReject, setShowTransferReject] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.documental_gestion.exp_files.table.dials.transfer,
            icon: 'pi pi-reply',
            command: () => {
                setShowTransferManual(true)
            }
        },
    ]);

    const { setIsLoading } = useLoading()

    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch } = useForm()

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(selectedItem.length == 0) {
            setOptionsTool([])
            return
        }
        if(selectedItem.length > 1) {
            setOptionsTool([
                {
                    label: translations.menu.options_speed_dial.add,
                    icon: 'pi pi-plus',
                    command: () => {
                        router.visit(route("files-exp.create"))
                    }
                 }
            ])
            return
        }

        if(selectedItem[0]?.state_transfer == 0) {
            setOptionsTool([
                {
                    label: translations.documental_gestion.exp_files.table.dials.transfer,
                    icon: 'pi pi-reply',
                    command: () => {
                        if(selectedItem.length == 0) {
                            return
                        }
                        setShowTransferManual(true)
                    }
                },
            ])
            return
        }
        if(selectedItem[0]?.state_transfer == 1) {
            setOptionsTool([
                {
                    label: translations.documental_gestion.exp_files.table.dials.transfer_accept,
                    icon: 'pi pi-check',
                    command: () => {
                        doTransfer(2)
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.reject_accept,
                    icon: 'pi pi-times',
                    command: () => {
                        setShowTransferReject(true)
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.download_fuid,
                    icon: 'pi pi-tag',
                    command: () => {
                        exportFuid()
                    }
                },
            ])
            return
        }
        if(selectedItem[0]?.state_transfer == 3 || (selectedItem[0]?.state_transfer == 2 && selectedItem[0]?.exp_files_archived_count == 2)) {
            setOptionsTool([])
            return
        }
        if(selectedItem[0]?.state_transfer == 2) {
            setOptionsTool([
                {
                    label: translations.documental_gestion.exp_files.table.dials.archive_exp,
                    icon: 'pi pi-sort-down',
                    command: () => {
                        setShowArchive(true);
                    }
                }
            ])
            return
        }

    }, [selectedItem]);

    async function doTransfer(action,formData = {}) {
        setIsLoading(true)
        try {
            let data = {
                ...formData,
                state_transfer: action
            }

            data.ids = selectedItem.map(s => s.id)
            const res = await axios.post(route("files-exp.storeOnlyExpFile"),data)
            const message = translations.documental_gestion.exp_files.success_messages.transfer;
            if (message) {
            toast.success(
                message
                .replace('{num_exp}', res.data?.number ?? 'N/A')
                .replace('{name_exp}', res.data?.name ?? 'Sin nombre')
            );
            } else {
                console.error('Mensaje de éxito no encontrado en translations.');
            }
        } catch (error) {
            toast.error(translations.auth.error)
        }finally{
            router.get(window.location.pathname, {}, { replace: true, preserveState: false });
            setIsLoading(false)
            setShowTransferManual(false)
        }
    }

    async function getData(page = 1,rows = 10,filters = {}) {
        setLoading(true)
        let res = await axios.get(route("files-exp.list"),{
            params: {
                page: page,
                perPage: rows,
                onlyExp: true,
                onlyWithUbications: true,
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
        axios.get(route('files-exp.exportTransfer'), {
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
    const exportFuid = () => {
        // Realiza la solicitud GET con axios
        axios.get(route('files-exp.exportFuid'), {
            params: {
                id: selectedItem[0].id,
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

    function getState(item) {

        if(item.exp_files_archived_count == 2) {
            return translations.archive_gestion.physicalSpace.table.state.archived
        }

        switch (item.state_transfer) {
            case 1:
                return translations.documental_gestion.exp_files.table.state_transfer[1]
            case 2:
                return translations.documental_gestion.exp_files.table.state_transfer[2]
            case 3:
                return translations.documental_gestion.exp_files.table.state_transfer[3]
            default:
                return translations.documental_gestion.exp_files.table.state_transfer[0]
        }
    }

    function getStateTypeArchive(item) {
        if(item.exp_files_archived_count == 1 || item.exp_files_archived_count == 0) {
            return translations.documental_gestion.exp_files.table.type_archive_state.first
        }
        return translations.documental_gestion.exp_files.table.type_archive_state.second
    }

    function page(data) {
        getData(data.page + 1,data.rows)
    }

    function search(e) {
        setSelectedItem([])
        getData(1,AData.per_page,e)
    }

    async function submitTransfer(data) {
        setIsLoading(true)
        try {
            data.ids = selectedItem.map(s => s.id)
            data.state_transfer = 1
            const res = await axios.post(route("files-exp.storeOnlyExpFile"),data)
            const message = translations.documental_gestion.exp_files.success_messages.transfer;
            if (message) {
            toast.success(
                message
                .replace('{num_exp}', res.data?.number ?? 'N/A')
                .replace('{name_exp}', res.data?.name ?? 'Sin nombre')
            );
            } else {
                console.error('Mensaje de éxito no encontrado en translations.');
            }
        } catch (error) {
            toast.error(translations.auth.error)
        }finally{
            router.get(window.location.pathname, {}, { replace: true, preserveState: false });
            setIsLoading(false)
            setShowTransferManual(false)
        }
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
                        <Column header={ translations.documental_gestion.exp_files.table.name } field="name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.number } field="number"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.serie } field="serie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.subserie } field="subserie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.date_init } field="date_init"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.dependency_id } field="dependency.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.creado_por_id } field={ i => `${i.create_by?.persona?.nombre} ${i.create_by?.persona?.apellido ? i.create_by?.persona?.apellido : ''}` }></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.type_archive } field={ (item) => getStateTypeArchive(item)}></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => getState(item)}></Column>
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Dialog modal={false} position='top' visible={showTransferManual} header={translations.documental_gestion.exp_files.table.modal_transfer.title} style={{ width: '50vw' }} onHide={() => {if (!showTransferManual) return; setShowTransferManual(false); }}>
                    <form onSubmit={handleSubmit(submitTransfer)}>
                        <div className='flex flex-col'>
                            <label htmlFor="">{ translations.documental_gestion.exp_files.table.modal_transfer.observation }</label>
                            <InputTextarea { ...register('observation_transfer',{ required: translations.validation.attributes.field_required }) } />
                        </div>

                        <span className='flex justify-end mt-3'>
                            <Button icon="pi pi-check" severity='success' />
                        </span>
                    </form>
                </Dialog>
                <Dialog modal={false} position='top' visible={showTransferReject} header={translations.documental_gestion.exp_files.table.modal_transfer.title_reject} style={{ width: '50vw' }} onHide={() => {if (!showTransferReject) return; setShowTransferReject(false); }}>
                    <form onSubmit={handleSubmit((a) => doTransfer(3,a))}>
                        <div className='flex flex-col'>
                            <label htmlFor="">{ translations.documental_gestion.exp_files.table.modal_transfer.observation }</label>
                            <InputTextarea { ...register('observation_transfer',{ required: translations.validation.attributes.field_required }) } />
                        </div>

                        <span className='flex justify-end mt-3'>
                            <Button icon="pi pi-check" severity='success' />
                        </span>
                    </form>
                </Dialog>
                <Dialog modal={false} position='top' visible={showArchive} style={{ width: '50vw' }} onHide={() => {if (!showArchive) return; setShowArchive(false); }}>
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
