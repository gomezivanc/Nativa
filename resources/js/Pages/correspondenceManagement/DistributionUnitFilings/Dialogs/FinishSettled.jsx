import React, { useState, useEffect, useRef  } from 'react';
import { usePage } from '@inertiajs/react'
import { Controller, useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

const FinishSettled = ({visible, onHide, selectedFiling, officials,dependencyId,onSuccess  }) => {

    const { formState: { errors }, getValues,setValue,control,register,watch,handleSubmit,} = useForm({
        defaultValues: {
            serie: null,
            sub_serie: null,
            document_type_id: null
        }
    });
    const AformRef = useRef()
    const [loading, setLoading] = useState(false);
    const { translations, currentLocale } = usePage()?.props
    const [series, setSeries] = useState([])
    const [Subseries, setSubseries] = useState([])
    const [dependencies,setDependencies] = useState([])
    const [typeProcess,setTypeProcess] = useState([])
    const [countries,setCountries] = useState([])
    const [departaments,setDepartaments] = useState([])
    const [cities,setCities] = useState([])
    const [typeDocsFiltered, setTypeDocsFiltered] = useState([]);
    const [step, setStep] = useState(1);  
    
    const hasSubseries = Subseries && Subseries.length > 0;
    const filedResponseOptions = [
        { name: "Correo electrónico", value: 1 },
        { name: "Correo físico", value: 2 }
    ];
    const currentSerie = watch("serie");
    const remainingDays = watch("remaining_days");
    const countryId = watch('country_id')
    const departament_id = watch('department_id')
    const parseEmail = (sender) => {
        if (!sender) return { name: '', email: '' };

        const match = sender.match(/"?([^"]*)"?\s*<(.+)>/);

        if (match) {
            return {
                name: match[1].trim(),
                email: match[2].trim()
            };
        }

        // fallback: si solo viene el email
        return {
            name: '',
            email: sender
        };
    };
    
    const { name, email } = parseEmail(selectedFiling?.sender);
    useEffect(() => {
        getDependencies()
        getTypeProcess()
        getCountries()
        if (visible) getSeries();
    }, [visible]);

    useEffect(() => {
        if(countryId) {
            getDepartaments(countryId)
        }
    },[countryId])

    useEffect(() => {
        if(departament_id) {
            getCities(departament_id)
        }
    },[departament_id])

    useEffect(() => {
        fetchSubSeries();
    }, [currentSerie]);

    useEffect(() => {
        if (visible && selectedFiling) {
            const today = new Date().toISOString().split("T")[0];
            setValue("document_date", today);
            setValue("filing_number", selectedFiling?.filing_number ?? '0');
            setValue("subject", selectedFiling?.subject ?? '');
            setValue("name_social_reason_sender", name);
            setValue("email_sender", email);
        }
    }, [setValue, selectedFiling, visible]); 

    async function getCountries() {
        const res = await axios.get(route("regional.countries"))
        setCountries(res.data)
    }

    async function getDepartaments(countryId) {
        try {
            const res = await axios.get(route("departamento.selectDepartamento"), {
                params: {
                    country_id: countryId,
                }
            });

            if (res.data.departamentos && res.data.departamentos.length > 0) {
                setDepartaments(res.data.departamentos);
            } else {
                // Mostrar toast si no hay resultados
                setDepartaments();
                toast.error(translations.auth.no_data);
            }
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
            toast.error(translations.auth.error);
        }
    }

    async function getCities(departament_id) {
        const res = await axios.get(route("ciudad.selectCiudad"),{
            params: {
                id_departamento: departament_id,
            }
        })
        setCities(res.data.ciudades)
    }

    async function getTypeProcess() {
        const res = await axios.get(route('filing.type-process'))
        setTypeProcess(res.data.tipoTramites)
    }

    async function getDependencies() {
        const res = await axios.get(route("dependencies.list"),{
            params: {
                typeData: 'todos',
                only_unit_admin: true
            }
        })
        setDependencies(res.data)
    }

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

    
    const handleGenerarRadicado = async () => {
        const data = getValues(); 
        await submit(data);
    };

    async function submit(data) {
        data['id_email'] = selectedFiling.id;
        const res = await axios.post(route("filing.store-gmail"), data);
    }

    useEffect(() => {
        if (!remainingDays) {
            setValue("expiration_date", null);
            return;
        }

        const days = parseInt(remainingDays, 10);

        if (isNaN(days)) {
            setValue("expiration_date", null);
            return;
        }

        const fetchDate = async () => {
            try {
                const res = await axios.get(route('filing.getExpirationDate'), {
                    params: { days }
                });

                const [year, month, day] = res.data.date.split('-');

                const localDate = new Date(year, month - 1, day);

                const formattedDate = localDate.toLocaleDateString(currentLocale, {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });

                setValue("expiration_date", formattedDate);

            } catch (error) {
                console.error(error);
            }
        };

        fetchDate();

    }, [remainingDays, currentLocale]);

    const steps = [
        { id: 1, name: 'Radicación' },
        { id: 2, name: 'Información de Correspondencia' },
        { id: 3, name: 'Clasificación y Trámite' },
        { id: 4, name: 'Distribución y Radicación' }  
    ]; 

    return (
        <Dialog visible={visible} onHide={onHide} header='Finalizacion De Radicado' modal 
            style={{ width: '700px' }}
            breakpoints={{'960px': '75vw', '641px': '90vw'}}
        >

            <div className="flex gap-6">
                {steps.map((s) => (
                    <div key={s.id} onClick={() => setStep(s.id)} className="cursor-pointer flex flex-col items-center flex-1 group" >
                        <span className={`text-sm font-medium transition-colors text-center ${ step === s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                            {s.name}
                        </span>
                        <div className={`mt-2 h-1 w-full rounded transition-all ${ step === s.id ? 'bg-blue-600' : 'bg-transparent' }`} />
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit(submit)} ref={AformRef} className="grid grid-cols-1 md:grid-cols-6 gap-4" >
                {step === 1 && (
                    <>
                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="filing_number">{ translations.filing.standard_filing.form.filing_number }</label>
                                <InputText
                                    placeholder={translations.filing.standard_filing.form.filing_number}
                                    type={"text"}
                                    readOnly
                                    {...register("filing_number")}
                                    className={{ 
                                        'p-invalid': errors?.filing_number, 
                                        'w-full': true,
                                    }}
                                />
                            </span>

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="document_date">{ translations.filing.standard_filing.form.document_date }</label>
                                <InputText type={'date'} disabled 
                                    { ...register("document_date", { required: translations.validation.attributes.field_required }) } 
                                    className={{ 
                                        'p-invalid': errors?.document_date,
                                        'w-full': true,
                                    }} 
                                />
                                {errors?.document_date && (
                                    <span className="text-red-600 text-sm">{errors.document_date?.message}</span>
                                )}
                            </span>

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="number_pages">{ translations.filing.standard_filing.form.number_pages }</label>
                                <InputText maxLength={3} placeholder={ translations.filing.standard_filing.form.number_pages } type='text' { ...register("number_pages",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.number_pages,'w-full':true }} />
                                    {errors?.number_pages && (
                                        <span className="text-red-600">{errors.number_pages?.message}</span>
                                    )}
                            </span>

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="annex_description">{ translations.filing.standard_filing.form.annex_description }</label>
                                <InputText { ...register("annex_description",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.annex_description,'w-full':true }} />
                                {errors?.annex_description && (
                                    <span className="text-red-600">{errors.annex_description?.message}</span>
                                )}
                            </span>

                        </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            <h3 className='md:col-span-6 font-bold'>{ translations.filing.standard_filing.responssible }</h3>
                            <hr  className='md:col-span-6 mb-3'/>

                            
                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="document_nit_sender">{translations.filing.standard_filing.form.document_sender }</label>
                                <InputText placeholder={ translations.filing.standard_filing.form.document_sender} type="text"
                                    {...register("document_nit_sender", { onBlur: (e) => searchThirdByDocument(e.target.value) })}
                                    className={{'w-full': true }}
                                />
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="name_social_reason_sender">{translations.filing.standard_filing.table_document.name }</label>
                                <InputText placeholder={translations.filing.standard_filing.table_document.name } type='text' { ...register("name_social_reason_sender")} className={{ 'w-full':true }} />
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="first_surname_legal_representative_sender">{translations.filing.standard_filing.form.first_surname_sender}</label>
                                <InputText placeholder={translations.filing.standard_filing.form.first_surname_sender } type='text' { ...register("first_surname_legal_representative_sender") } className={{'w-full':true }} />
                            </span>
                                
                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="country_id">{ translations.filing.standard_filing.form.country_id }</label>
                                <Controller
                                    name="country_id"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={countries} optionLabel='name' optionValue='id' filter
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={ translations.filing.standard_filing.form.country_id }
                                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                            />
                                            {
                                                fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                            }
                                        </>
                                    )}
                                />
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="departament_id">{ translations.filing.standard_filing.form.department_id }</label>
                                <Controller
                                    name="department_id"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={departaments} optionLabel='nombre' optionValue='id' filter
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={ translations.filing.standard_filing.form.department_id }
                                                className={{'w-full ': true }}

                                            />
                                        </>
                                    )}
                                />
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="city_id">{ translations.filing.standard_filing.form.city_id }</label>
                                <Controller
                                    name="city_id"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={cities} optionLabel='nom_ciudad' optionValue='id_ciudad' filter
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={ translations.filing.standard_filing.form.city_id }
                                                className={{'w-full ': true }}
                                            />
                                        </>
                                    )}
                                />
                            </span>
                            
                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="address_sender">{ translations.filing.standard_filing.form.address_sender }</label>
                                <InputText placeholder={ translations.filing.standard_filing.form.address_sender } type='text' { ...register("address_sender") } className={{'w-full':true }} />
                            </span>
                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="phone_sender">{ translations.filing.standard_filing.form.phone_sender }</label>
                                <InputText placeholder={ translations.filing.standard_filing.form.phone_sender } type='text' { ...register("phone_sender") } className={{ 'w-full':true }} />
                            </span>
                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="email_sender">{ translations.filing.standard_filing.form.email_sender }</label>
                                <InputText placeholder={ translations.filing.standard_filing.form.email_sender } type='email' { ...register("email_sender") } className={{ 'w-full':true }} />
                            </span>

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="dependency_id">{ translations.filing.standard_filing.form.dependency }</label>
                                <Controller
                                    name="dependency_id"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={dependencies} optionLabel='name' optionValue='id' filter
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={ translations.filing.standard_filing.form.dependency }
                                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                            />
                                            {
                                                fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                            }
                                        </>
                                    )}
                                />
                            </span>

                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="subject">{ translations.filing.standard_filing.form.subject }</label>
                                <InputTextarea readOnly { ...register("subject",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.subject,'w-full':true }} />
                                {errors?.subject && (
                                    <span className="text-red-600">{errors.subject?.message}</span>
                                )}
                            </span>
                
                        </div>
                    </>
                )}
                {step === 3 && (
                    <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                
                        <h3 className='md:col-span-6 font-bold'>{ translations.filing.standard_filing.filing_information }</h3>
                        <hr  className='md:col-span-6 mb-3'/>
                        <span className="flex flex-col md:col-span-2">
                            <label htmlFor="typeProcess_id">{ translations.filing.standard_filing.form.procedure_type }</label>
                            <Controller
                                name="typeProcess_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={typeProcess} optionLabel="name" optionValue="id"
                                            value={field.value}
                                            placeholder={translations.filing.standard_filing.form.procedure_type}
                                            onChange={(e) => {
                                                field.onChange(e.value);

                                                const selected = typeProcess.find(t => t.id === e.value);
                                                if (selected) {
                                                    setValue("remaining_days", selected.response_time);
                                                }
                                            }}
                                            className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>

                        <span className="flex flex-col md:col-span-2">
                            <label htmlFor="remaining_days">{ translations.filing.standard_filing.form.remaining_days }</label>
                            <InputText maxLength={3} placeholder={ translations.filing.standard_filing.form.remaining_days } type='text' { ...register("remaining_days",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.remaining_days,'w-full':true }} />
                                {errors?.remaining_days && (
                                    <span className="text-red-600">{errors.remaining_days?.message}</span>
                                )}
                        </span>

                        <span className="flex flex-col md:col-span-2">
                            <label htmlFor="expiration_date">{ translations.filing.standard_filing.form.expiration_date }</label>
                            <InputText disabled  placeholder={ translations.filing.standard_filing.form.expiration_date } type='text' { ...register("expiration_date") } className={{'w-full':true }} />
                        </span>

                    </div>
                )}
                {step === 4 && (
                    <>
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
                                onClick={handleGenerarRadicado}
                                loading={loading}
                            />
                        </div>
                    </>
                )}
            </form>
        </Dialog>
    );
};

export default FinishSettled;