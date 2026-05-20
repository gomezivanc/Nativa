import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react'
import { Controller, useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignOfficialDialog = ({ 
    visible, 
    onHide, 
    selectedFiling = {},
    officials,
    dependencyId,
    onSuccess 
}) => {

    const [loading, setLoading] = useState(false);
    const { translations } = usePage()?.props
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [series, setSeries] = useState([])
    const [Subseries, setSubseries] = useState([])
    const [typeDocsFiltered, setTypeDocsFiltered] = useState([]);
    
    const hasSubseries = Subseries && Subseries.length > 0;

    const {
        formState: { errors },
        setValue,
        control,
        watch,
        handleSubmit,
    } = useForm({
        defaultValues: {
            serie: null,
            sub_serie: null,
            document_type_id: null
        }
    });

    // Observamos los valores del formulario
    const currentSerie = watch("serie");
    const currentSubSerie = watch("sub_serie");
    const currentDocTypeId = watch("document_type_id");

    useEffect(() => {
        if (visible) getSeries();
    }, [visible]);

    useEffect(() => {
        fetchSubSeries();
    }, [currentSerie]);

    const handleSerieChange = (serieObj) => {
        setValue("sub_serie", null);
        setValue("document_type_id", null);

        if (serieObj?.subseries?.length > 0) {
            setTypeDocsFiltered([]);
            return;
        }

        const tipos = serieObj?.retencion?.tipos_documentales ?? [];
        setTypeDocsFiltered(tipos);
    };

    async function getSeries() {
        const res = await axios.get(route("dependencies.seriesSelect"), {
            params: { by_dependency: dependencyId }
        })
        setSeries(res.data.serie)
    }

    async function fetchSubSeries() {
        if (!currentSerie) { 
            setSubseries([]);
            return; 
        }
        const res = await axios.get(route("dependencies.SubseriesSelect"), {
            params: { serie: currentSerie }
        })
        setSubseries(res.data.subSerie)
    }

    const handleAssignOfficial = async () => {
        if (!selectedOfficial) {
            toast.warning('Por favor selecciona un funcionario');
            return;
        }

        if(!selectedFiling.is_copy){
            // Ejecutar validación manual de react-hook-form si es necesario
            if (!currentSerie || (!currentDocTypeId && typeDocsFiltered.length > 0)) {
                toast.warning('Por favor completa la clasificación documental');
                return;
            }
        }

        try {
            setLoading(true);
            if(selectedFiling.is_copy){
                await axios.post(route('filing.assign-official-copy', selectedFiling.copy_id),{
                    official_id: selectedOfficial
                });
            }else{
                await axios.post(route('filing.assign-official', selectedFiling.id), {
                    official_id: selectedOfficial,
                    serie: currentSerie,
                    subSerie: currentSubSerie,
                    document_type_id: currentDocTypeId
                });
            }
            
            toast.success('Funcionario asignado correctamente');
            setSelectedOfficial(null);
            setValue("serie", null);
            setValue("sub_serie", null);
            setValue("document_type_id", null);
            onHide(); 
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al asignar funcionario');
        } finally {
            setLoading(false);
        }
    };

    const officialOptionTemplate = (official) => {
        const nombre = official.persona?.nombre || official.name || '';
        const apellido = official.persona?.apellido || '';
        return `${nombre} ${apellido}`.trim();
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            header='Asignar a Funcionario' 
            modal 
            style={{ width: '450px' }}
            breakpoints={{'960px': '75vw', '641px': '90vw'}}
        >
            <div className='flex flex-col gap-4 mt-2'>
                <div className="flex flex-col">
                    <label className='text-sm font-medium mb-1 text-gray-700'>Funcionario</label>
                    <Dropdown value={selectedOfficial} onChange={(e) => setSelectedOfficial(e.value)} options={officials}
                        optionLabel={officialOptionTemplate}
                        optionValue='id'
                        placeholder='Selecciona un funcionario'
                        filter
                        className='w-full'
                    />
                </div>

                {visible && selectedFiling && (
                    <>
                    {!selectedFiling?.is_copy && (
                        <>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">{ translations.filing.standard_filing.form.serie }</label>
                            <Controller
                                name="serie"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown options={series} optionLabel='name' value={field.value}
                                        placeholder={translations.filing.standard_filing.form.serie}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleSerieChange(e.value);
                                        }}
                                        className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">{ translations.filing.standard_filing.form.sub_serie }</label>
                            <Controller
                                name="sub_serie"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown options={Subseries || []} optionLabel='name' filter
                                        value={field.value || null}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            const tipos = e.value?.retencion?.tipos_documentales ?? [];
                                            setTypeDocsFiltered(tipos);
                                            setValue("document_type_id", null);
                                        }}
                                        placeholder={translations.filing.standard_filing.form.sub_serie}
                                        className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                        disabled={!currentSerie || !hasSubseries}
                                    />
                                )}
                            />
                        </div>              

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">{ translations.filing.standard_filing.form.documental_type }</label>
                            <Controller
                                name="document_type_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown options={typeDocsFiltered || []} optionLabel={'name_es'} optionValue='id'
                                        filter
                                        value={field.value || null}
                                        placeholder={translations.filing.standard_filing.form.documental_type}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                        disabled={typeDocsFiltered.length === 0}
                                    />
                                )}
                            />
                        </div>
                        </>
                    )}
                    </>
                )}
                <div className='flex gap-2 justify-end mt-4'>
                    <Button
                        label='Cancelar'
                        icon='pi pi-times'
                        onClick={onHide}
                        className='p-button-secondary p-button-text'
                    />
                    <Button
                        label='Asignar'
                        icon='pi pi-check'
                        onClick={handleAssignOfficial}
                        loading={loading}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default AssignOfficialDialog;