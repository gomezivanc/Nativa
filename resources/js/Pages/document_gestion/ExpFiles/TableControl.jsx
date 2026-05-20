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
import { Filters } from './FiltersTableControl'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import DropdownG from '../../../components/Globals/Drodown'
import { useForm } from 'react-hook-form'
import MultiSelectG from '../../../components/Globals/MultiSelect'
import { useLoading } from '../../../Context/preloadContext'

export default function TableControl({ clasifications, expFilesTypeControl }) {
    const { translations, current_language } = usePage()?.props
    const [ AData,setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })

    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const [filterShow, setFilterShow] = useState(false);
    const [changeStateShow, setChangeStateShow] = useState(false);
    const [filtersVals, setFiltersVals] = useState({ active: true });
    const [loading,setLoading] = useState(false)
    const [roles, setRole] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                router.visit(route("files-exp.create"))
            }
        }
    ]);

    const { setIsLoading } = useLoading()

    useEffect(() => {
        getData()
        getRoles()
    },[])
    useEffect(() => {
        if(selectedItem.length == 0) {
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
        setOptionsTool([
            {
                label: translations.menu.options_speed_dial.delete,
                icon: 'pi pi-bars',
                command: () => {
                    setChangeStateShow(true)
                }
            }
        ])
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
        axios.get(route('files-exp.exportTableControl'), {
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

    async function getRoles() {
        try {
            const res = await axios.get(route("roles.list"), {
                params: {
                    typeData: "todos",
                },
            });
            setRole(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
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

    async function submit(data) {
        setIsLoading(true)

        data.ids = selectedItem.map(i => i.id)
        try {
            const res = await axios.post(route('files-exp.storeOnlyExpFile'),data)
            toast.success(translations.auth.success)
            router.visit(route("files-exp.tableControl"))
        } catch (error) {
            toast.error(translations.auth.error)
        } finally {
            setIsLoading(false)
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
                        <Column header={ translations.documental_gestion.exp_files.table_control.code } field="dependency.code"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.name } field="dependency.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.code_serie } field="serie.code"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.serie } field="serie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.code_subserie } field="subserie.code"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.subserie } field="subserie.name"></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.access } field={ i => i.acccess.map(i => i.type_control['name_'+current_language]).join(', ') }></Column>
                        <Column header={ translations.documental_gestion.exp_files.table_control.rol } field={ i => i.roles.map(i => i.name).join(', ') }></Column>
                        <Column header={ translations.auth.state_table } field={ (item) => !item.clasification_id ? translations.auth.state.active : item.clasification['name_'+current_language] }></Column>
                    </DataTable>
                </div>
                <Dialog modal={false} position='top' visible={filterShow} header={translations.auth.filters} style={{ width: '50vw' }} onHide={() => {if (!filterShow) return; setFilterShow(false); }}>
                    <Filters onSearch={(e) => search(e)} defaultVals={filtersVals} onSetValues={(e) => setFiltersVals(e)} />
                </Dialog>
                <Dialog modal={false} position='top' visible={changeStateShow} header={translations.auth.state_table} style={{ width: '50vw' }} onHide={() => {if (!changeStateShow) return; setChangeStateShow(false); }}>
                    <form onSubmit={ handleSubmit(submit) } className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.clasification_id }</label>
                            <DropdownG control={control} name="clasification_id" optionLabel={'name_'+current_language} options={clasifications} optionValue='id' />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.auth.users.form.rol }</label>
                            <DropdownG control={control} name="rol_id" optionLabel='name' optionValue='name' options={roles}/>
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.exp_files.form.types_control }</label>
                            <MultiSelectG control={control} name="type_controls" optionLabel={'name_'+current_language} optionValue='id' options={expFilesTypeControl} />
                        </span>
                        <div className='flex items-end justify-end'>
                            <Button size='small' label={translations.documental_gestion.exp_files.add}></Button>
                        </div>
                    </form>
                </Dialog>
                <Toast ref={toast} />
                <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
                <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            </div>
        </>
    )
}
