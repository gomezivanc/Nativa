import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { usePage } from '@inertiajs/react';

export default function SolicitudDialog({ visible, onHide, solicitud, onSuccess, actionType }) {
    const { translations } = usePage().props;
    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [dependencies, setDependencies] = useState([]);
    const [users, setUsers] = useState([]);
    const [units, setUnits] = useState([]);

    const dependency_id = watch("dependency_id");

    // Títulos dinámicos según el tipo de acción
    const getHeader = () => {
        const titles = {
            1: 'Ampliación de Tiempo',
            2: 'Reasignar Responsable',
            3: 'Reasignar Radicado',
            4: 'Desbloqueo de radicados'
        };
        return titles[actionType] || 'Procesar Solicitud';
    };

    useEffect(() => {
        if (visible) {
            reset(); // Limpiar formulario al abrir
            getDependencies();
            getUniti();
        }
    }, [visible]);

    useEffect(() => {
        if (dependency_id) getUsers();
    }, [dependency_id]);

    const submit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(route('controler.aprobarSolicitud'), {
                id: solicitud.id,
                id_filing: solicitud.filing.id,
                additional_days: data.additional_days,
                observation: data.observation,
                dependency_id: data.dependency_id,
                official_id: data.official_id,
                type: actionType
            });

            if (response.data.success) {
                toast.success('Solicitud procesada correctamente');
                onSuccess();
                onHide();
            } else {
                toast.error(response.data.message || 'Error al procesar');
            }
        } catch (error) {
            console.log(error)
            toast.error('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const getDependencies = async () => {
        try {
            const res = await axios.get(route("dependencies.list"), { params: { typeData: 'todos', only_unit_admin: true } });
            setDependencies(res.data ?? []);
        } catch (e) { console.error(e); }
    };

    const getUsers = async () => {
        try {
            const res = await axios.get(route("usuarios.getUsers"), { params: { by_dependency: dependency_id } });
            setUsers(res.data ?? []);
        } catch (e) { console.error(e); }
    };

    const getUniti = async () => {
        try {
            const res = await axios.get(route("distribution.listFull"));
            setUnits(res.data ?? []);
        } catch (e) { console.error(e); }
    };

    // Botones del pie de página
    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text p-button-secondary" disabled={loading} />
            <Button label="Confirmar y Procesar" icon="pi pi-check" loading={loading} onClick={handleSubmit(submit)} className="p-button-primary" />
        </div>
    );

    if (!solicitud) return null;

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header={getHeader()} 
            footer={dialogFooter}
            className="w-full md:w-6/12 lg:w-5/12"
            breakpoints={{ '960px': '75vw', '641px': '95vw' }}
        >
            <div className="grid grid-cols-12 gap-4 mt-2">
                
                {/* ACCIÓN 1: Días Adicionales */}
                {actionType === 1 && (
                    <div className="col-span-12 flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Días adicionales a otorgar</label>
                        <Controller
                            name="additional_days"
                            control={control}
                            rules={{ required: 'Los días son obligatorios' }}
                            render={({ field, fieldState }) => (
                                <InputNumber 
                                    id={field.name} 
                                    value={field.value} 
                                    onValueChange={(e) => field.onChange(e.value)} 
                                    showButtons 
                                    min={1} 
                                    className={fieldState.error ? 'p-invalid' : ''}
                                    placeholder="Ej: 5"
                                />
                            )}
                        />
                        {errors.additional_days && <small className="p-error">{errors.additional_days.message}</small>}
                    </div>
                )}

                {/* ACCIÓN 2: Reasignar Responsable */}
                {actionType === 2 && (
                    <>
                        <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label className="font-bold text-gray-700">{translations.filing.standard_filing.form.dependency}</label>
                            <Controller
                                name="dependency_id"
                                control={control}
                                rules={{ required: 'Requerido' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        {...field}
                                        options={dependencies}
                                        optionLabel="name"
                                        optionValue="id"
                                        filter
                                        placeholder="Seleccione dependencia"
                                        className={fieldState.error ? 'p-invalid' : ''}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label className="font-bold text-gray-700">{translations.filing.standard_filing.form.official}</label>
                            <Controller
                                name="official_id"
                                control={control}
                                rules={{ required: 'Requerido' }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        {...field}
                                        options={users}
                                        optionLabel={(i) => `${i.persona.nombre} ${i.persona.apellido ?? ''}`}
                                        optionValue="id"
                                        filter
                                        disabled={!dependency_id}
                                        placeholder="Seleccione funcionario"
                                        className={fieldState.error ? 'p-invalid' : ''}
                                    />
                                )}
                            />
                        </div>
                    </>
                )}

                {/* OBSERVACIONES (Común para todos) */}
                <div className="col-span-12 flex flex-col gap-2 mt-2">
                    <label className="font-bold text-gray-700">Justificación u Observación</label>
                    <InputTextarea
                        rows={4}
                        {...register('observation', { required: 'La justificación es obligatoria' })}
                        className={errors.observation ? 'p-invalid' : ''}
                        placeholder="Describa el motivo de esta acción..."
                        autoResize
                    />
                    {errors.observation && <small className="p-error">{errors.observation.message}</small>}
                </div>

            </div>
        </Dialog>
    );
}