import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState, useRef } from 'react';
import { Column } from 'primereact/column';
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import  Assign  from './Dialogs/Assign'
import CreateAssign from './Dialogs/CreateAssign'
import DeleteAssign from './Dialogs/DeleteAssign'
import axios from 'axios'

export default function Show({filing}) {
    const { translations,current_language,data: initialData,dependency  } = usePage()?.props   
    const toast = useRef(null);
    
    const [loading,setLoading] = useState(false)
    const [data, setData] = useState(initialData || []);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAssign, setShowAssign] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    
    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('payroll-management.showMor', { id: dependency?.id }));
            if (response.data.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const header = null;


    const optionsTool = [
        {
            label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => setShowCreate(true)
        },
        ...(!selectedItem ? [{
            label: translations.menu.options_speed_dial.Assign,
            icon: 'pi pi-undo',
            command: () => setShowAssign(true)
        }] : []),

        ...(selectedItem ? [{
            label: translations.auth?.edit || 'Editar',
            icon: 'pi pi-pencil',
            command: () => setShowAssign(true)
        }] : []),

        ...(selectedItem ? [{
            label: translations.auth?.delete || 'Eliminar',
            icon: 'pi pi-trash',
            command: () => setShowDelete(true)
        }] : [])
    ];

    const dateTemplate = (row) => {
        return new Date(row.created_at).toLocaleDateString('sv-SE')
    }



    return (
        <Card  header={
            <div className='p-5 flex gap-1 flex-col'>
                <div>
                    <Link href={route("payroll-management.index")}>
                        <Button label={translations.auth.back} size='small'/>
                    </Link>
                </div>
            </div>
        } className='grid gap-2 grid-cols-1 items-end'>
            <div className="md:col-span-6 my-3">
                <Fieldset legend={dependency?.name} className="mb-4">

                    <div className="grid md:grid-cols-3 gap-4 mt-2">

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <span className="text-sm text-gray-500">Código</span>
                            <div className="font-semibold text-lg mt-1 flex items-center gap-2">
                                <i className="pi pi-hashtag text-blue-500"></i>
                                {dependency?.code}
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <span className="text-sm text-gray-500">Regional</span>
                            <div className="font-semibold text-lg mt-1 flex items-center gap-2">
                                <i className="pi pi-map-marker text-green-500"></i>
                                {dependency?.regional?.name}
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <span className="text-sm text-gray-500">Dependencia</span>
                            <div className="font-semibold text-lg mt-1 flex items-center gap-2">
                                <i className="pi pi-building text-purple-500"></i>
                                {dependency?.name}
                            </div>
                        </div>

                    </div>

                </Fieldset> 
            </div>

            <div>
            <DataTable loading={loading}value={data}header={header}selectionMode="single"selection={selectedItem}
             onSelectionChange={(e) => setSelectedItem(e.value)}dataKey="id"size="small"emptyMessage={translations.auth.not_found}>

                <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
                <Column
                    header={translations.configuration.payroll_management.table.file}
                    body={(row) => (
                        <span>
                            <a
                                className="text-blue-600"
                                href={route('tenant_asset', { path: row.payroll?.file })}
                                download
                            >
                                {row.payroll?.filename}
                            </a>
                        </span>
                    )}
                />
                <Column header={translations.configuration.payroll_management.template_code}field="code"/>
                <Column header={translations.configuration.payroll_management.version}field="version"/>
                <Column header={translations.configuration.payroll_management.creation_date} body={dateTemplate} />
                <Column header={translations.configuration.payroll_management.template_name}field="name"/>

                <Column
                    header={translations.auth.state_table}
                    body={(row) =>
                        row.deleted_at
                            ? translations.auth.state.inactive
                            : translations.auth.state.active
                    }
                />
            </DataTable>
            <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
            <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />

            <Dialog modal position="center" visible={showAssign} header={selectedItem ? 'Editar Plantilla Asignada' : 'Asignar Plantilla'} style={{ width: '70vw' }} onHide={() => setShowAssign(false)}>
                <Assign
                    dataDependency={{
                        id_dependency: dependency?.id,
                        name: dependency?.name,
                        ...(selectedItem || {})
                    }}
                    onFinish={() => {
                        setShowAssign(false)
                        setSelectedItem(null)
                        loadData()
                    }}
                />
            </Dialog>

            <Dialog modal={true} position='center' visible={showCreate} header={'Crear y Asignar Plantilla'} style={{ width: '70vw' }} onHide={() => setShowCreate(false)}>
                <CreateAssign 
                    dataDependency={dependency}
                    onFinish={() => {
                        setShowCreate(false);
                        loadData();
                    }} 
                />
            </Dialog>

            <Dialog modal={true} position='center' visible={showDelete} header={'Desactivar Plantilla'} style={{ width: '50vw' }} onHide={() => setShowDelete(false)}>
                {selectedItem && (
                    <DeleteAssign 
                        selectedItem={selectedItem}
                        onFinish={() => {
                            setShowDelete(false);
                            setSelectedItem(null);
                            loadData();
                        }} 
                    />
                )}
            </Dialog>
            
            <Toast ref={toast} />

            </div>
                         
        </Card>        
    );
}