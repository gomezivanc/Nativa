import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { Dialog } from 'primereact/dialog'
import { router, usePage, useRemember } from '@inertiajs/react';
import { useEffect, useState } from 'react'
import { Reference } from './Dialogs/Reference'
import Swal from 'sweetalert2'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import { toast } from 'react-toastify'
import Show from './Show'
import { AdvancedFiltersInline } from './AdvancedFiltersInline'
import { Close } from './Dialogs/Close'
import { ChargeDocuments } from './Dialogs/ChargeDocuments'
import { CreateExpedienteForm } from './Dialogs/CreateExpedienteForm';
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';

export default function Index() {
    const { translations, current_language, dependencies, clasifications, archiveClasification } = usePage()?.props
    const [AData, setAData] = useRemember({
        data: [],
        currentPage: 1,
        lastPage: 0,
    }, 'exp-files-table');

    const [selectedItem, setSelectedItem] = useRemember([], 'exp-files-selected');

    const [createFilters, setCreateFilters] = useRemember({
        archive_id: null,
        dependency_id: null,
        serie: null,
        subserie: null,
        text: '',
        creado_por_id: null,
        active: null
    }, 'exp-files-filters');

    const [advancedFilters, setAdvancedFilters] = useRemember(null, 'exp-files-advanced');
    const [visibleShow, setVisibleShow] = useState(false);
    const [referenceShow, setReferenceShow] = useState(false);
    const [attachShow, setAttachShow] = useState(false);
    const [closeShow, setCloseShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [optionsTool, setOptionsTool] = useState([
        {   label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {router.visit(route("files-exp.create"))}
        },]);
    const [createModal, setCreateModal] = useState(false)
    const [indicesConfig, setIndicesConfig] = useState([])
    const [serieTieneSubseries, setSerieTieneSubseries] = useState(false)
    const [officials, setOfficials] = useState([])
    const archivoOptions = (archiveClasification || []).map(item => ({
        label: item.name_es,
        value: item.id
    }));

    const officialsOptions = officials.map(user => ({
        label: `${user.persona?.nombre || ''} ${user.persona?.apellido || ''}`,
        value: user.id
    }));

    useEffect(() => {
        if (!selectedItem) {
            return
        }

        if (selectedItem.length == 0) {
            setOptionsTool([optionsTool[0]])
            return
        }
        if (selectedItem.length == 1) {
            setOptionsTool([
                optionsTool[0],
                {
                    label: translations.documental_gestion.exp_files.table.dials.control_papper,
                    icon: 'pi pi-file',
                    command: () => {
                        window.open(route('files-exp.exportTableControlPdf', selectedItem[0].id), '_blank')
                    }
                },
                {
                    label: translations.documental_gestion.exp_files.table.dials.historic_export,
                    icon: 'pi pi-file-excel',
                    command: () => {
                        window.open(route('files-exp.exportLogs', selectedItem[0].id), '_blank')
                    }
                },
                {
                    label: translations.documental_gestion.dependency.dial.edit,
                    icon: 'pi pi-pencil',
                    command: () => {
                        router.visit(route("files-exp.edit", selectedItem[0].id))
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
                        router.visit(route('files-exp.Detail', selectedItem[0].id))
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
                        router.visit(route("files-exp.edit", selectedItem[0].id), {
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
                        if (selectedItem[0].deleted_at) {
                            Idelete(selectedItem[0].id, selectedItem[0].deleted_at)
                            return
                        }

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
                            if (result.dismiss === Swal.DismissReason.cancel) {
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
                            if (result.dismiss === Swal.DismissReason.cancel) {
                                return
                            }
                            setCloseShow(true)
                        });
                    }
                },
            ])
        }
    }, [selectedItem])

    useEffect(() => {
        if (createFilters.dependency_id) {
            loadOfficials();
        }
    }, [createFilters.dependency_id]);

    async function getData(page = 1, rows = 10, filters = {}) {
        setLoading(true)
        let res = await axios.get(route("files-exp.list"), {
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
            totalRecords: res.data.total,
            lastPage: res.data.last_page 
        })
        setLoading(false)
    }

    const exportI = (type) => {
        const filtersToUse = advancedFilters || createFilters;
        axios.get(route('files-exp.export'), {
            params: {
                type: type,
                onlyExp: true,
                ...filtersToUse,
            },
            responseType: 'blob',
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

    const exportPackageZip = (type) => {
        axios.get(route('files-exp.exportPackageZip'), {
            params: {
                id: selectedItem[0].id,
            },
            responseType: 'blob',
        })
            .then(response => {
                let fileName = response.headers['content-disposition'] || 'default.csv';
                if (fileName) {
                    const fileNameMatch = fileName.match(/filename\*?=['"]?UTF-8['"]?'?([^;\n]*)/);
                    if (fileNameMatch && fileNameMatch[1]) {
                        fileName = decodeURIComponent(fileNameMatch[1]);
                    }
                }
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

   // botones en el Toolbar superior de la tabla
    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2 items-center">
            <Button
                label="Buscar Expediente"
                icon="pi pi-search"
                size="small"
                severity="info"
                onClick={() => {
                    if (!createFilters.archive_id) {
                        toast.warn('Debe seleccionar un archivo');
                        return;
                    }

                    if (!createFilters.dependency_id) {
                        toast.warn('Debe seleccionar una dependencia');
                    }
                    getData(1, AData.per_page, createFilters);
                }}
            />
            <Button
                label="Limpiar"
                icon="pi pi-eraser"
                className="p-button-outlined p-button-secondary"
                size="small"
                onClick={clearFilters}
            />
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <Button
                label="Crear expediente"
                icon="pi pi-plus"
                severity="success"
                size="small"
                disabled={!createFilters.dependency_id || !createFilters.serie || (serieTieneSubseries && !createFilters.subserie)}
                onClick={loadIndices}
            />
        </div>
    );

    const rightToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => exportI('csv')} size='small' icon="pi pi-file" label='CSV' className="p-button-outlined p-button-secondary" />
            <Button onClick={() => exportI('excel')} size='small' icon="pi pi-file-excel" label='EXCEL' className="p-button-outlined p-button-success" />
            <Button onClick={() => exportI('pdf')} size='small' icon="pi pi-file-pdf" label='PDF' className="p-button-outlined p-button-danger" />
            <Button onClick={() => exportI('pdf')} size='small' icon="pi pi-print" label={translations?.auth?.exports?.print || 'Imprimir'} className="p-button-outlined" />
        </div>
    );

    async function loadIndices() {
        if (!createFilters?.serie?.id) {
            toast.warn("Debe seleccionar una serie");
            return;
        }
        
        try {
            const res = await axios.post(route('indices.indicesByRetencion'), {
                serie_id: createFilters.serie.id,
                subserie_id: createFilters.subserie?.id || null
            });
            // VALIDAR SI NO TIENE ÍNDICES
            if (!res.data || res.data.length === 0) {
                toast.warn("La serie/subserie seleccionada no tiene índices configurados, no se puede crear el expediente.");
                return;
            }   
            setIndicesConfig(res.data); 
            setCreateModal(true);
        } catch (e) {
            toast.error("Error cargando índices");
        }
    }

    const loadOfficials = async () => {
        try {
            const res = await axios.get(route('usuarios.getUsers'), {
                params: {
                    by_dependency: createFilters.dependency_id
                }
            })
            setOfficials(res.data.data || res.data)
        } catch (error) {
            toast.error('Error cargando funcionarios')
        }
    }

    function closeFinish() {
        getData(1, AData.per_page)
        setCloseShow(false)
    }

    function page(data) {
        const filtersToUse = advancedFilters || createFilters
        getData(data.page + 1, data.rows, filtersToUse)
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

        if (!res.isConfirmed) {
            return
        }
        try {
            await axios.delete(route("files-exp.destroy", id))
            toast.success(translations.auth.confirmation_delete.success)
            setSelectedItem([])
            getData(1)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }

    function search(e) {
        setSelectedItem([])
        getData(1, AData.per_page, e)
    }

    const breadcrumbItems = [
        { label: translations?.auth?.home || 'Inicio', command: () => router.visit(route('dashboard.index')) },
        { label: translations?.documental_gestion?.exp_files?.title || 'Expedientes', disabled: true },
    ];

    const fileNumberTemplate = (rowData) => (
        <Button
            label={rowData.number}
            className='p-button-text p-button-plain text-blue-600 font-semibold hover:underline p-0'
            onClick={() => router.visit(route('files-exp.Detail', rowData.id))}
        />
    );

    const clearFilters = () => {
        setCreateFilters({
            archive_id: null,
            dependency_id: null,
            serie: null,
            subserie: null,
            text: '',
            creado_por_id: null,
            active: null
        });
        setSerieTieneSubseries(false);
        setSelectedItem([]);
        setAData({ data: [], currentPage: 1, lastPage: 0, per_page: 10 });
    };

    //  botones de acción al lado de los filtros
    const filterActions = (
        <div className="flex items-end gap-2 h-full pb-1">
            <Button
                icon="pi pi-search"
                tooltip="Buscar Expediente"
                size="small"
                severity="info"
                onClick={() => {
                    // Si no hay filtros básicos ni filtros avanzados
                    const hasBasicFilter = createFilters.dependency_id && createFilters.archive_id;
                    const hasAdvancedFilter = createFilters.text?.trim() || createFilters.creado_por_id || createFilters.active !== null;

                    if (!hasBasicFilter && !hasAdvancedFilter) {
                        toast.warn('Debe ingresar un criterio de búsqueda');
                        return;
                    }

                    // Si pasa la validación, ejecuta la búsqueda con TODO el objeto
                    getData(1, AData.per_page, createFilters);
                }}
            />
            <Button
                label="Limpiar"
                icon="pi pi-eraser"
                className="p-button-outlined p-button-secondary"
                size="small"
                onClick={clearFilters}
            />
            <Button
                label="Crear"
                icon="pi pi-plus"
                severity="success"
                size="small"
                disabled={!createFilters.dependency_id || !createFilters.serie || (serieTieneSubseries && !createFilters.subserie)}
                onClick={loadIndices}
            />
        </div>
    );

return (
        <div className='p-4'>
            <BreadCrumb model={breadcrumbItems} home={{ icon: 'pi pi-home', command: () => router.visit(route('dashboard.index')) }} />

            <Card className='mt-4 shadow-sm'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className='text-xl font-bold text-gray-800 m-0'>
                        {translations?.documental_gestion?.exp_files?.title || 'Expedientes'}
                    </h1>
                    
                    {/* Botones de exportación */}
                    <div className="flex gap-2">
                        <Button onClick={() => exportI('csv')} size='small' icon="pi pi-file" className="p-button-text p-button-secondary" tooltip="CSV"/>
                        <Button onClick={() => exportI('excel')} size='small' icon="pi pi-file-excel" className="p-button-text p-button-success" tooltip="Excel"/>
                        <Button onClick={() => exportI('pdf')} size='small' icon="pi pi-file-pdf" className="p-button-text p-button-danger" tooltip="PDF"/>
                        <Button onClick={() => exportI('pdf')} size='small' icon="pi pi-print" className="p-button-text" tooltip="Imprimir"/>
                    </div>
                </div>

                {/* SECCIÓN DE FILTROS PRINCIPALES */}
                <div className='bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100'>
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-3 items-end'>
                        
                        {/* Archivo */}
                        <div className='md:col-span-2 flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-600'> Archivo<span className="text-red-500 ml-1">*</span> </label>
                            <Dropdown
                                placeholder="Archivo"
                                options={archivoOptions}
                                optionLabel="label"
                                optionValue="value"
                                value={createFilters.archive_id}
                                onChange={(e) => setCreateFilters({ ...createFilters, archive_id: e.value })}
                                className='p-inputtext-sm w-full'
                            />
                        </div>

                        {/* Dependencia  */}
                        <div className='md:col-span-2 flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-600'>Dependencia<span className="text-red-500 ml-1">*</span></label>
                            <Dropdown
                                placeholder="Dependencia"
                                options={dependencies}
                                optionLabel="name"
                                optionValue="id"
                                value={createFilters.dependency_id}
                                onChange={(e) => {
                                    setCreateFilters(prev => ({
                                        ...prev,
                                        dependency_id: e.value,
                                        serie: null,
                                        subserie: null
                                    }));
                                    setSerieTieneSubseries(false);
                                }}
                                className='p-inputtext-sm w-full'
                            />
                        </div>

                        {/* Serie */}
                        <div className='md:col-span-2 flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-600'>Serie</label>
                            <Dropdown
                                placeholder="Serie"
                                options={dependencies?.find(d => d.id === createFilters.dependency_id)?.series || []}
                                optionLabel="name"
                                value={createFilters.serie}
                                onChange={(e) => {
                                    const serie = e.value;
                                    setSerieTieneSubseries(serie?.subseries?.length > 0);
                                    setCreateFilters({ ...createFilters, serie: serie, subserie: null });
                                }}
                                disabled={!createFilters.dependency_id}
                                className='p-inputtext-sm w-full'
                            />
                        </div>

                        {/* Subserie */}
                        <div className='md:col-span-2 flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-600'>Subserie</label>
                            <Dropdown
                                placeholder="Subserie"
                                options={createFilters.serie?.subseries || []}
                                optionLabel="name"
                                value={createFilters.subserie}
                                onChange={(e) => setCreateFilters({ ...createFilters, subserie: e.value })}
                                disabled={!serieTieneSubseries}
                                className='p-inputtext-sm w-full'
                            />
                        </div>

                        {/* BOTONES AL LADO DE LOS FILTROS */}
                        <div className='md:col-span-4'>
                            {filterActions}
                        </div>
                    </div>
                </div>

                {/* Búsqueda Avanzada */}
                <AdvancedFiltersInline
                    filters={createFilters}
                    setFilters={setCreateFilters}
                    officialsOptions={officialsOptions} 
                    onSearch={(filters) => {
                        setAdvancedFilters(filters);
                        if (!filters) {
                            setAData({ data: [], currentPage: 1, lastPage: 0, per_page: 10 });
                            return;
                        }
                        getData(1, AData?.per_page || 10, filters);
                    }}
                />

                {/* TABLA PRINCIPAL */}
                <DataTable
                    loading={loading}
                    value={AData?.data}
                    selectionMode="multiple"
                    rows={AData?.per_page}
                    selection={selectedItem}
                    onSelectionChange={(e) => setSelectedItem(e.value)}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    first={((AData?.currentPage || 1) - 1) * (AData?.per_page || 10)}
                    size='small'
                    emptyMessage={translations?.auth?.not_found || 'No hay registros'}
                    lazy
                    onPage={page}
                    paginator
                    totalRecords={AData?.totalRecords}
                    className="mt-2"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column header="#" field="id" headerStyle={{ width: '4rem' }}></Column>
                    {/* <Column header={translations?.documental_gestion?.exp_files?.table?.name || 'Nombre'} body={expNameTemplate}/> */}
                    <Column header="Nombre" style={{ width: '20px' }}  body={(rowData) => (
                        <Button label={rowData.name} className='p-button-link text-indigo-600 font-bold hover:text-indigo-800 p-0 text-sm'
                            onClick={() => router.visit(route('files-exp.Detail', rowData.id))}
                        />)}
                    />
                    <Column header={translations?.documental_gestion?.exp_files?.table?.date_init || 'Fecha'} field="date_init"></Column>
                    <Column  header="Creado Por" body={(rowData) => `${rowData.create_by?.persona?.nombre || ''} ${rowData.create_by?.persona?.apellido || ''}`}/>
                    <Column header="Estado" field={(item) => item.deleted_at ? 'Inactivo' : 'Activo'}></Column>
                    <Column header={translations?.documental_gestion?.exp_files?.table?.index} body={(rowData) => (
                            <div className="flex flex-col gap-1">
                                {rowData.indices_formateados?.map((indice, i) => (
                                    <div key={i} className="text-xs">
                                        <span className="font-semibold"> {indice.nombre}: </span> <span className="ml-1 text-gray-600"> {indice.valor} </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                    <Column header={translations?.documental_gestion?.exp_files?.table?.actions || 'Acciones'}
                    body={(rowData) => (
                        <div className="flex gap-2">                            
                            {/* Editar */}
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-text p-button-warning"
                                tooltip="Editar nombre"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => {
                                    Swal.fire({
                                        title: 'Editar nombre del expediente',
                                        input: 'text',
                                        inputValue: rowData.name,
                                        showCancelButton: true,
                                        confirmButtonText: 'Guardar',
                                        cancelButtonText: 'Cancelar',
                                        inputValidator: (value) => {
                                            if (!value) {
                                                return 'El nombre es obligatorio'
                                            }
                                        }
                                    }).then(async (result) => {
                                        if (!result.isConfirmed) {
                                            return
                                        }
                                        try {
                                            await axios.post(route('files-exp.store'), {id: rowData.id, name: result.value})
                                            toast.success('Nombre actualizado')
                                            getData(AData.currentPage, AData.per_page, advancedFilters || createFilters)
                                        } catch (error) {
                                            toast.error('Error actualizando expediente')
                                        }
                                    })
                                }}
                            />

                            {/* Eliminar */}
                            <Button
                                icon={rowData.deleted_at ? "pi pi-refresh" : "pi pi-trash"}
                                className={`p-button-rounded p-button-text ${
                                    rowData.deleted_at
                                        ? "p-button-success"
                                        : "p-button-danger"
                                }`}
                                tooltip={
                                    rowData.deleted_at
                                        ? "Reactivar expediente"
                                        : rowData.files?.length > 0
                                            ? "No se puede eliminar porque tiene archivos"
                                            : "Eliminar expediente"
                                }
                                tooltipOptions={{ position: 'top' }}
                                disabled={!rowData.deleted_at && rowData.files?.length > 0}
                                onClick={() => Idelete(rowData.id, rowData.deleted_at)}
                            />
                        </div>
                    )}
                />
                </DataTable>
            </Card>

            {/* ... Modales y SpeedDial (Se mantienen igual) ... */}
            <Toast ref={toast} />
            <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open' />
            
            {/* Diálogos */}
            <Dialog visible={visibleShow} style={{ width: '50vw' }} onHide={() => setVisibleShow(false)}><Show data={selectedItem} /></Dialog>
            <Dialog modal={false} position='top' visible={referenceShow} header="Referencia" style={{ width: '70vw' }} onHide={() => setReferenceShow(false)}><Reference items={selectedItem} onFinish={() => setReferenceShow(false)} /></Dialog>
            <Dialog modal={false} position='top' visible={closeShow} header="Cerrar" style={{ width: '70vw' }} onHide={() => setCloseShow(false)}><Close items={selectedItem} onFinish={() => closeFinish()} /></Dialog>
            <Dialog modal={false} position='top' visible={attachShow} header="Documentos" style={{ width: '70vw' }} onHide={() => setAttachShow(false)}><ChargeDocuments items={selectedItem} onFinish={() => setAttachShow(false)} /></Dialog>
            <Dialog modal visible={createModal} header="Crear expediente" style={{ width: '40vw' }} onHide={() => setCreateModal(false)} >
                <CreateExpedienteForm filters={createFilters} indices={indicesConfig} clasifications={clasifications} translations={translations} onSuccess={() => { setCreateModal(false); getData(1); }} />
            </Dialog>
        </div>
    );
}