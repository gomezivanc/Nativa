import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BreadCrumb } from 'primereact/breadcrumb'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'


export default function index({ records = [] }) {

    const { translations } = usePage().props;
    const [typesDocs, setTypesDocs] = useState(records);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [form, setForm] = useState({id: null,name_es: ''});
    const [loading, setLoading] = useState(false);

    const openNew = () => {
        setForm({
            id: null,
            name_es: '',
            name_en: ''
        });

        setDialogVisible(true);
    };

    const openEdit = (rowData) => {

        setForm({
            id: rowData.id,
            name_es: rowData.name_es,
            name_en: rowData.name_es
        });

        setDialogVisible(true);
    };

    const saveTypeDoc = async () => {
        try {
            setLoading(true);

            const url = form.id ? route('exp-type-doc.update', form.id) : route('exp-type-doc.store');
            const method = form.id ? 'put' : 'post';
            const response = await axios({ method, url, data: form });
            const newRecord = response.data.data;

            if (form.id) {
                setTypesDocs(prev => prev.map(item => item.id === newRecord.id ? newRecord : item ));
            } else {
                setTypesDocs(prev => [newRecord, ...prev]);
            }

            toast.success(response?.data?.message || (form.id ? 'Tipo documental actualizado correctamente' : 'Tipo documental creado correctamente'));
            setDialogVisible(false);

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Ocurrió un error al guardar' );
        } finally {
            setLoading(false);
        }
    };

    const deleteTypeDoc = async (id) => {

        const res = await Swal.fire({
            icon: 'question',
            text: translations.auth.confirmation_delete.question_deactivate,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no,
            confirmButtonText: translations.auth.yes_not.yes
        });

        if (!res.isConfirmed) { return; }

        try {

            const response = await axios.delete(route('exp-type-doc.destroy', id));
            toast.success(response?.data?.message || 'Registro eliminado');
            setTypesDocs(typesDocs.filter(item => item.id !== id));

        } catch (error) {

            console.error(error);
            toast.error( error?.response?.data?.message || 'No fue posible eliminar el registro');
        }
    };

    const actionsTemplate = (rowData) => (
        <div className='flex gap-2 justify-center'>
            <Button icon='pi pi-pencil' rounded text severity='warning' tooltip='Editar' onClick={() => openEdit(rowData)} />
            <Button icon='pi pi-trash' rounded text severity='danger' tooltip='Eliminar' onClick={() => deleteTypeDoc(rowData.id)}/>
        </div>
    );

    const items = [{ label: translations.menu.configuration.configuration }, { label: translations.documental_gestion.dependency.detail.type_documents}];
    const home = { icon: 'pi pi-home', url: '/main' }
    return (

        <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>

            <div className='mb-4'>
                <BreadCrumb model={items} home={home} />
            </div>

            <Card className='shadow-md border-none rounded-xl overflow-hidden'>

                <div className='flex justify-between items-center mb-6'>

                    <div className='flex items-center gap-3'>
                        <i className='pi pi-folder text-2xl text-indigo-600'></i>

                        <div>
                            <h1 className='text-2xl font-bold text-gray-800 m-0'>
                                {translations.documental_gestion.dependency.detail.type_documents}
                            </h1>

                            <p className='text-sm text-gray-500 mt-1'>
                                Administración de tipos documentales de expedientes
                            </p>
                        </div>
                    </div>

                    <Button
                        label='Nuevo Registro'
                        icon='pi pi-plus'
                        onClick={openNew}
                        className='bg-indigo-600 border-indigo-600 hover:bg-indigo-700'
                    />

                </div>

                <div className='border border-gray-200 rounded-xl overflow-hidden'>

                    <DataTable
                        value={typesDocs}
                        paginator
                        rows={10}
                        stripedRows
                        responsiveLayout='scroll'
                        emptyMessage='No hay registros disponibles'
                        className='p-datatable-sm'
                        rowHover
                    >

                        <Column field='id' header='ID' style={{ width: '6rem' }} />

                        <Column field='name_es' header='Nombre Español' />

                        {/* <Column
                            field='name_en'
                            header='Nombre Inglés'
                        /> */}

                        <Column field='created_at' header='Fecha Creación'
                            body={(rowData) => (
                                rowData.created_at || 'N/A'
                            )}
                        />

                        <Column header='Acciones' body={actionsTemplate} align='center' style={{ width: '10rem' }} />

                    </DataTable>

                </div>

            </Card>

            <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                header={
                    <div className='flex items-center gap-2'>
                        <i className='pi pi-file-edit text-indigo-600'></i>

                        <span className='font-semibold'> { form.id ? 'Editar Tipo Documental' : 'Nuevo Tipo Documental' } </span>
                    </div>
                }
                modal
                style={{ width: '35rem' }}
                className='p-fluid'
            >

                <div className='grid grid-cols-1 gap-5 mt-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold text-gray-700'>
                            Nombre
                        </label>
                        <InputText
                            value={form.name_es}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name_es: e.target.value,
                                    name_en: e.target.value
                                })
                            }
                            placeholder='Ingrese el nombre'
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-3 mt-6 border-t pt-4'>
                    <Button label='Cancelar' icon='pi pi-times' outlined severity='secondary' onClick={() => setDialogVisible(false)}/>
                    <Button label='Guardar' icon='pi pi-check' loading={loading} onClick={saveTypeDoc} className='bg-indigo-600 border-indigo-600 hover:bg-indigo-700'/>
                </div>

            </Dialog>

        </div>
    );
}