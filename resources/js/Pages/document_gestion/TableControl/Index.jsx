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
                router.visit(route("files-exp.create"))
            }
        },
    ]);

    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        if(!selectedItem) {
            return
        }

        if(selectedItem.length == 0) {
            setOptionsTool([optionsTool[0]])
            return
        }
        if(selectedItem.length == 1) {
            setOptionsTool([
                optionsTool[0],
                {
                    label: translations.documental_gestion.dependency.dial.edit,
                    icon: 'pi pi-pencil',
                    command: () => {
                        router.visit(route("files-exp.edit",selectedItem[0].id))
                    }
                },
                {
                    label: translations.documental_gestion.dependency.dial.delete,
                    icon: 'pi pi-trash',
                    command: () => {
                        Idelete(selectedItem[0].id)
                    }
                },
                {
                    label: translations.documental_gestion.dependency.dial.show,
                    icon: 'pi pi-eye',
                    command: () => {
                        router.visit(route('files-exp.Detail',selectedItem[0].id))
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.reference_crusade,
                    icon: 'pi pi-file',
                    command: () => {
                        setReferenceShow(true)
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.charge_docs,
                    icon: 'pi pi-paperclip',
                    command: () => {
                        setAttachShow(true)
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.sub_exp,
                    icon: 'pi pi-list',
                    command: () => {
                        router.visit(route("files-exp.edit",selectedItem[0].id),{
                            data: {
                                sub_exp: true
                            }
                        })
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.package_files,
                    icon: 'pi pi-cloud-download',
                    command: () => {
                        exportPackageZip()
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.close,
                    icon: 'pi pi-lock',
                    command: async () => {
                        Swal.fire({
                            title: translations.documental_gestion.exp_files.dialogs.confirm_dialog_lock,
                            text: translations.documental_gestion.exp_files.dialogs.confirm_dialog_lock_text,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: translations.auth.yes_not.yes,
                            cancelButtonText: translations.auth.yes_not.no
                        }).then((result) => {
                            if(result.dismiss === Swal.DismissReason.cancel) {
                                return
                            }
                            setCloseShow(true)
                        });
                    }
                },
            ])
        } else {
            setOptionsTool([
                optionsTool[0],
                {
                    label: translations.documental_gestion.dependency.dial.d_c_doc,
                    icon: 'pi pi-file',
                    command: () => {
                        setReferenceShow(true)
                    }
                },
                {
                    label: translations.documental_gestion.dependency.dial.c_docs,
                    icon: 'pi pi-paperclip',
                    command: () => {
                        setAttachShow(true)
                    }
                },
                {
                    label: translations.documental_gestion.dependency.dial.d_c_doc,
                    icon: 'pi pi-lock',
                    command: () => {
                        Swal.fire({
                            title: translations.documental_gestion.exp_files.dialogs.confirm_dialog_lock,
                            text: translations.documental_gestion.exp_files.dialogs.confirm_dialog_lock_text,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: translations.auth.yes_not.yes,
                            cancelButtonText: translations.auth.yes_not.no
                        }).then((result) => {
                            if(result.dismiss === Swal.DismissReason.cancel) {
                                return
                            }
                            setCloseShow(true)
                        });
                    }
                },
            ])
        }
    },[selectedItem])

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
        // Realiza la solicitud GET con axios
        axios.get(route('files-exp.export'), {
            params: {
                type: type,  // Parámetro para el tipo de archivo
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
                <div className='md:mx-16'>
                    <DataTable loading={ loading } value={ AData?.data } header={ header } selectionMode="multiple" rows={ AData?.per_page }
                    selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small' emptyMessage={ translations.auth.not_found } lazy onPage={page} paginator totalRecords={AData?.lastPage}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.number } field="number"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.name } field="name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.serie } field="serie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.subserie } field="subserie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.date_init } field="date_init"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.dependency_id } field="dependency.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.creado_por_id } field={ i => `${i.create_by?.persona?.nombre} ${i.create_by?.persona?.apellido ? i.create_by?.persona?.apellido : ''}` }></Column>
                        <Column header={ translations.documental_gestion.exp_files.table.clasification_id } field={ i => `${ i.clasification['name_'+current_language] }` }></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => item.deleted_at ? translations.documental_gestion.exp_files.form.state.inactive : translations.documental_gestion.exp_files.form.state.active }></Column>
                    </DataTable>
                </div>
                <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => {if (!visibleShow) return; setVisibleShow(false); }}>
                    <Show data={selectedItem} />
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
