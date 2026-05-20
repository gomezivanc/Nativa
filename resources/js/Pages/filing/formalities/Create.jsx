
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { AutoComplete } from 'primereact/autocomplete'
import { useLoading } from "../../../Context/preloadContext"
import { ChargeDocuments } from '../../document_gestion/ExpFiles/Dialogs/ChargeDocuments'
import { Dialog } from 'primereact/dialog'

export default function Index({ id, emitIdCreated, noChangeView = false }) {
    const { currentLocale, translations,typePerson,current_language} = usePage().props

    const { register, handleSubmit, getValues, formState: { errors }, setValue, control, watch } = useForm({
        defaultValues: { serie_bool: 0 }
    });

    const AformRef = useRef()
    const [typeDocuments, setTypeDocuments] = useState([])
    const [fileName, setFileName] = useState("");
    const [expFilesTypeDocs, setFilesTypeDocs] = useState([])
    const [filingId, setFilingId] = useState(null)
    const [attachShow, setAttachShow] = useState(false)
    const [dependencies,setDependencies] = useState([])
    const [senderSuggestions, setSenderSuggestions] = useState([])
    const [senderLoading, setSenderLoading] = useState(false)
    const [userSuggestions, setUserSuggestions] = useState([])
    const [userLoading, setUserLoading] = useState(false)
    const { setIsLoading } = useLoading()
    const serie = watch("serie")
    const serie_bool = watch("serie_bool");
    const depenci = watch("dependency_id");
    const typePersonSelect = watch("type_person_id_sender")

    // Helper para setear múltiples valores
    const setMultipleValues = (fieldsObj) => {
        Object.entries(fieldsObj).forEach(([key, value]) => setValue(key, value || ''))
    }

    // Helper para limpiar campos específico
    const cleanFields = (fields) => setMultipleValues(fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {}))

    useEffect(() => {
        getTypeDocuments()
        getTypeDocs()
        getDependencies()
        if (id) {
            getItem(id)
        }
    }, [])

    useEffect(() => {
        tipoDocuemental();
    }, [depenci]);

    async function getDependencies() {
        const res = await axios.get(route("dependencies.list"),{
            params: {
                typeData: 'todos',
                only_unit_admin: true
            }
        })
        setDependencies(res.data)
    }

    async function tipoDocuemental() {
        if (!depenci) {
            setTypeDocuments([])
            return
        }
        
        try {
            const res = await axios.get(route("dependencies.typeDocsByDependency", depenci))
            setTypeDocuments(res.data || [])
        } catch (error) {
            console.error('Error al obtener tipos documentales:', error)
            setTypeDocuments([])
        }
    }

    const handleFileChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onChange(file);
        }
    };

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("filing.store"), data)
            toast.success(translations.auth.success + " " + `${translations.filing.standard_filing.generated_filing} : ${res.data.filing_number}`)
            if (noChangeView) {
                emitIdCreated(res.data.id)
                return
            }
            setFilingId(res.data.id);
            setFilingNumber(res.data.filing_number);

        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("filing.show", id))

        for (const key in res.data) {
            if (key !== 'associated_filings') {
                if (res.data.hasOwnProperty(key)) {
                    setValue(key, res.data[key]);
                }
            }
        }

        setValue('associated_filings', [])
        setValue('associated_filings', res.data.associated_filings.map(i => i.id))
        setValue('serie', res.data.serie)
        setNumberFiling(res.data.filing_number);

        if (res.data.subserie) {
            setSubseriesfiltered(res.data.subserie.filter(i => {
                return i.series?.code == serie?.code
            }))
        }
    }

    async function getTypeDocuments() {
        const res = await axios.get(route('tipoDocumento.index'))
        setTypeDocuments(res.data.tipoDocumentos)
    }

    async function getTypeDocs() {
        const res = await axios.get(route('files-exp.detailex'))
        setFilesTypeDocs(res.data.expFilesSupportsType)
    }

    async function searchSender(event) {
        const query = event.query.trim()
        if (!query || query.length < 2) { setSenderSuggestions([]); return }

        setSenderLoading(true)
        try { 
            if(!serie_bool){
                const res = await axios.get(route('usuarios.search-thir'), { params: { search: query } })
                setSenderSuggestions(res.data?.results && Array.isArray(res.data.results) ? res.data.results : res.data?.found ? [res.data.data] : [])
            }else{
                const res = await axios.get(route('usuarios.search-users'), { params: { search: query } })
                setSenderSuggestions(res.data?.results && Array.isArray(res.data.results) ? res.data.results : [])
            }
        } catch (error) {
            console.log('Error en búsqueda de tercero')
            setSenderSuggestions([])
        } finally {
            setSenderLoading(false)
        }
    }

    function onSenderSelect(value) {
        if (serie_bool == 1) {
            // Si es funcionario
            setMultipleValues({
                sender_search: value.numeroDocu,
                document_nit_sender: value.numeroDocu,
                name_social_reason_sender: value.persona?.name || value.name,
                first_surname_legal_representative_sender: value.persona?.apellido,
            })
        } else {
            // Si es tercero
            const { document_nit_sender, document_nit, name_social_reason_sender, first_surname_legal_representative_sender, type_document_id, email_sender, phone_sender, address_sender } = value
            setMultipleValues({ 
                sender_search: document_nit_sender || document_nit,
                document_nit_sender: document_nit_sender || document_nit, 
                name_social_reason_sender, 
                first_surname_legal_representative_sender, 
                type_document_id, 
                email_sender, 
                phone_sender, 
                address_sender 
            })
        }
    }

    async function searchUsers(event) {
        const query = event.query.trim()
        if (!query || query.length < 2) { setUserSuggestions([]); return }

        setUserLoading(true)
        try {
            const res = await axios.get(route('usuarios.search-users'), { params: { search: query } })
            setUserSuggestions(res.data?.results && Array.isArray(res.data.results) ? res.data.results : [])
        } catch (error) {
            console.log('Error en búsqueda de usuarios')
            setUserSuggestions([])
        } finally {
            setUserLoading(false)
        }
    }

    function onUserSelect(value) {
        setMultipleValues({
            user_id: value.id,
            user_name: value.persona?.name || value.name,
            user_email: value.email,
            dependency_id: value.dependency?.id || value.dependency_id,
            dependency_name: value.dependency?.name,
            regional_id: value.regional?.id || value.regional_id,
            regional_name: value.regional?.name,
            charge_id: value.charge?.id || value.charge_id,
            charge_name: value.charge?.name
        })
    }
    return (
        <div>
            <div>
                <Card header={
                    <>
                        <div className='p-5 flex gap-1 flex-col'>
                            <div>
                                {
                                    !noChangeView &&
                                    <Link href={route("newProcedures.index")}>
                                        <Button label={translations.auth.back} size='small' />
                                    </Link>
                                }
                            </div>
                        </div>

                    </>
                }>

                    <form onSubmit={handleSubmit(submit)} ref={AformRef} className="grid grid-cols-1 md:grid-cols-6 gap-4" autoComplete="off">

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            {
                                <>
                                    <h3 className='md:col-span-6 font-bold text-lg mt-5'>{'Datos del Destinatario'}</h3>
                                    <hr className='md:col-span-6 mb-3' />
                                    <span className="flex flex-col md:col-span-3">
                                        <label htmlFor="user_search">Búscar Usuario / Funcionario</label>
                                        <Controller
                                            name="user_search"
                                            control={control}
                                            rules={{ required: translations.validation.attributes.field_required }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <AutoComplete
                                                        field="name"
                                                        value={field.value}
                                                        autoComplete="new-password"
                                                        suggestions={userSuggestions}
                                                        completeMethod={searchUsers}
                                                        onSelect={(e) => {
                                                            field.onChange(e.value);
                                                            onUserSelect(e.value);
                                                        }}
                                                        onChange={(e) => {
                                                            field.onChange(e.value);
                                                            cleanFields(['user_id', 'user_name', 'user_email', 'dependency_id', 'dependency_name', 'regional_id', 'regional_name', 'charge_id', 'charge_name'])
                                                        }}
                                                        className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                                        inputClassName="w-full"
                                                        itemTemplate={(item) => (
                                                            <div>
                                                                <div>{item.persona?.name} - {item.numeroDocu} </div>
                                                                <small className='text-gray-500'>{item.email}</small>
                                                            </div>
                                                        )}
                                                    />
                                                    {
                                                        fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                    }
                                                </>
                                            )}
                                        />
                                    </span>

                                    <span className="flex flex-col md:col-span-3">
                                        <label htmlFor="user_email">Email</label>
                                        <InputText readOnly placeholder="Email del usuario" type='email' {...register("user_email", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.user_email, 'w-full': true }} />
                                        {errors?.user_email && (
                                            <span className="text-red-600">{errors.user_email?.message}</span>
                                        )}
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="dependency_id">Dependencia</label>
                                        <InputText readOnly placeholder="Dependencia" type='text' {...register("dependency_name")} className={{ 'w-full': true }} />
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="regional_id">Regional</label>
                                        <InputText readOnly placeholder="Regional" type='text' {...register("regional_name")} className={{ 'w-full': true }} />
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="charge_id">Cargo</label>
                                        <InputText readOnly placeholder="Cargo" type='text' {...register("charge_name")} className={{ 'w-full': true }} />
                                    </span>
                                </>
                            }
                        </div>

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            {
                                <>
                                    <h3 className='md:col-span-6 font-bold text-lg mt-5'>{translations.filing.standard_filing.additional_information}</h3>
                                    <hr className='md:col-span-6 mb-3' />

                                    <span className="flex flex-col md:col-span-6">
                                        <label htmlFor="username">{ 'Funcionario' }</label>
                                        <Controller
                                            name="serie_bool"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <InputSwitch  trueValue={1} falseValue={0}
                                                        checked={field.value}
                                                        onChange={(e) => {
                                                            field.onChange(e.value);
                                                            cleanFields(['sender_search', 'document_nit_sender', 'name_social_reason_sender', 'first_surname_legal_representative_sender', 'type_document_id', 'email_sender', 'phone_sender', 'address_sender'])
                                                        }}
                                                        className={`${fieldState.error ? 'p-invalid' : ''}`}
                                                    />
                                                    {
                                                        fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                    }
                                                </>
                                            )}
                                        />
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="sender_search">Busqueda de {serie_bool == 1 ? 'Funcionario' : 'Tercero'}</label>
                                        <Controller
                                            name="sender_search"
                                            control={control}
                                            rules={{ required: translations.validation.attributes.field_required }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <AutoComplete
                                                        field={serie_bool ? 'numeroDocu' : 'document_nit_sender'}
                                                        value={field.value}
                                                        suggestions={senderSuggestions}
                                                        completeMethod={searchSender}
                                                        inputClassName="w-full"
                                                        onSelect={(e) => {
                                                            field.onChange(e.value);
                                                            onSenderSelect(e.value);
                                                        }}
                                                        onChange={(e) => {
                                                            field.onChange(e.value);
                                                            cleanFields(['document_nit_sender', 'name_social_reason_sender', 'first_surname_legal_representative_sender', 'type_document_id', 'email_sender', 'phone_sender', 'address_sender'])
                                                            
                                                        }}
                                                        className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                                                        itemTemplate={(item) => (
                                                            <div>
                                                                {serie_bool == 1 ? (
                                                                    <>
                                                                        <div>{item.persona?.name} - {item.numeroDocu}</div>
                                                                        <small className='text-gray-500'>{item.email}</small>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div>{item.name_social_reason_sender}</div>
                                                                        <small className='text-gray-500'>{item.document_nit_sender || item.document_nit}</small>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                    {
                                                        fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                    }
                                                </>
                                            )}
                                        />
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="name_social_reason_sender">{typePersonSelect == 1 ? translations.archive_gestion.accumulated_fund.show.social_reason : translations.filing.standard_filing.table_document.name}</label>
                                        <InputText readOnly placeholder={typePersonSelect == 1 ? translations.archive_gestion.accumulated_fund.show.social_reason : translations.filing.standard_filing.table_document.name} type='text' {...register("name_social_reason_sender", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.name_social_reason_sender, 'w-full': true }} />
                                        {errors?.name_social_reason_sender && (
                                            <span className="text-red-600">{errors.name_social_reason_sender?.message}</span>
                                        )}
                                    </span>

                                    <span className="flex flex-col md:col-span-2">
                                        <label htmlFor="first_surname_legal_representative_sender">{typePersonSelect == 1 ? translations.filing.standard_filing.form.legal_representative_sender : translations.filing.standard_filing.form.first_surname_sender}</label>
                                        <InputText readOnly placeholder={typePersonSelect == 1 ? translations.filing.standard_filing.form.legal_representative_sender : translations.filing.standard_filing.form.first_surname_sender} type='text' {...register("first_surname_legal_representative_sender", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.first_surname_legal_representative_sender, 'w-full': true }} />
                                        {errors?.first_surname_legal_representative_sender && (
                                            <span className="text-red-600">{errors.first_surname_legal_representative_sender?.message}</span>
                                        )}
                                    </span>
                                    
                                    {serie_bool == 0 && <>
                                        <span className="flex flex-col md:col-span-6">
                                            <label htmlFor="username">{translations.configuration.user_interoperability.form.type_document_id}</label>
                                            <Controller
                                                name="type_document_id"
                                                control={control}
                                                readOnly
                                                rules={{ required: translations.validation.attributes.field_required }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Dropdown

                                                            options={typeDocuments.filter(doc => doc.id !== 4)}
                                                            optionLabel="nombre"
                                                            optionValue="id"
                                                            readOnly
                                                            filter
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.value)}
                                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                                        />

                                                        {
                                                            fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                        }
                                                    </>

                                                )}
                                            />
                                        </span>
                                    </>
                                    }
                                    {
                                    serie_bool == 0 && 
                                    <> 
                                        <span className="flex flex-col md:col-span-6">
                                            <label htmlFor="address_sender">{translations.filing.standard_filing.form.address_sender}</label>
                                            <InputText readOnly placeholder={translations.filing.standard_filing.form.address_sender} type='text' {...register("address_sender", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.address_sender, 'w-full': true }} />
                                            {errors?.address_sender && (
                                                <span className="text-red-600">{errors.address_sender?.message}</span>
                                            )}
                                        </span>
                                        <span className="flex flex-col md:col-span-3">
                                            <label htmlFor="phone_sender">{translations.filing.standard_filing.form.phone_sender}</label>
                                            <InputText readOnly placeholder={translations.filing.standard_filing.form.phone_sender} type='text' {...register("phone_sender", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.phone_sender, 'w-full': true }} />
                                            {errors?.phone_sender && (
                                                <span className="text-red-600">{errors.phone_sender?.message}</span>
                                            )}
                                        </span>
                                        <span className="flex flex-col md:col-span-3">
                                            <label htmlFor="email_sender">{translations.filing.standard_filing.form.email_sender}</label>
                                            <InputText readOnly placeholder={translations.filing.standard_filing.form.email_sender} type='email' {...register("email_sender", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.email_sender, 'w-full': true }} />
                                            {errors?.email_sender && (
                                                <span className="text-red-600">{errors.email_sender?.message}</span>
                                            )}
                                        </span>
                                    </>
                                    }
                                </>
                            }
                        </div>

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            {/* Asuntos y mas */}
                            <span className="flex flex-col md:col-span-6">
                                <label htmlFor="subject">{translations.filing.standard_filing.form.subject}</label>
                                <InputTextarea {...register("subject", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.subject, 'w-full': true }} />
                                {errors?.subject && (
                                    <span className="text-red-600">{errors.subject?.message}</span>
                                )}
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="Production_Date">{translations.filing.standard_filing.form.Production_Date}</label>
                                <InputText type='text' {...register("Production_Date", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.address_sender, 'w-full': true }} />
                                {errors?.address_sender && (
                                    <span className="text-red-600">{errors.address_sender?.message}</span>
                                )}
                            </span>

                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="Reference">{translations.filing.standard_filing.form.Reference}</label>
                                <InputText type='text' {...register("Reference", { required: translations.validation.attributes.field_required })} className={{ 'p-invalid': errors?.address_sender, 'w-full': true }} />
                                {errors?.address_sender && (
                                    <span className="text-red-600">{errors.address_sender?.message}</span>
                                )}
                            </span>
                        </div>

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                            
                            {/* Columna 1: Clasificación (Dropdown) */}
                            <span className="flex flex-col md:col-span-3 gap-2">
                                <label htmlFor="priority_id" className="text-sm font-bold text-gray-700">
                                    {translations.documental_gestion.exp_files.dialogs.charge_docs.support_type_id}
                                </label>
                                <Controller
                                    name="priority_id"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown 
                                            options={expFilesTypeDocs} 
                                            optionValue='id' 
                                            filter 
                                            optionLabel={['name_'+current_language]}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={`${fieldState.error ? 'p-invalid' : ''} w-full shadow-sm`}
                                            placeholder="Seleccione tipo de documento"
                                        />
                                    )}
                                />
                            </span>
                            <span className="flex flex-col md:col-span-3 gap-2">
                                <label className="text-sm font-bold text-gray-700">
                                    Documento de evidencia
                                </label>
                                
                                <Controller
                                    name="document_file" // Cambia el nombre según tu esquema
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <label 
                                                htmlFor="file-upload" 
                                                className={`flex items-center gap-3 px-4 py-2.5 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 
                                                    ${fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                                            >
                                                {/* Icono dinámico */}
                                                <div className={`flex items-center justify-center rounded-full p-2 ${fileName ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {fileName ? (
                                                        <i className="pi pi-clone" style={{ fontSize: '1.5rem' }}></i>
                                                    ) : (
                                                    
                                                        <i className="pi pi-cloud-upload" style={{ fontSize: '1.5rem' }}></i>
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className={`text-sm font-medium truncate ${fileName ? 'text-green-700' : 'text-gray-600'}`}>
                                                        {fileName || "Seleccionar archivo..."}
                                                    </span>
                                                    {!fileName && <span className="text-xs text-gray-400">PDF, DOCX hasta 10MB</span>}
                                                </div>
                                                {/* Botón visual al final */}
                                                <span className="ml-auto bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-semibold shadow-sm group-hover:bg-gray-50">
                                                    Examinar
                                                </span>
                                            </label>
                                            
                                            <input 
                                                id="file-upload" 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => handleFileChange(e, field.onChange)}
                                            />
                                        </div>
                                    )}
                                />
                            </span>
                        </div>

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            <span className="flex flex-col md:col-span-4">
                                <label htmlFor="username">
                                    {'Plantillas de calidad'}
                                </label>
                                <Controller
                                    name="active"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <div className="flex items-center gap-2">
                                            <InputSwitch 
                                            trueValue={true}
                                            falseValue={false}
                                            checked={field.value}
                                            onChange={field.onChange} />
                                            <span>{ field.value ? 'Activo' : 'Inactivo' }</span>
                                        </div>
                                    )}
                                    />
                            </span>
                            
                            <span className="flex flex-col md:col-span-3">
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
                            <span className="flex flex-col md:col-span-3">
                                <label htmlFor="dependency_id">{ 'Tipos Documentales' }</label>
                                <Controller
                                    name="document"
                                    control={control}
                                    rules={{ required: translations.validation.attributes.field_required }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Dropdown options={typeDocuments} optionLabel='name_es' optionValue='id' filter
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={ 'Tipos Documentales' }
                                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                            />
                                            {
                                                fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                            }
                                        </>
                                    )}
                                />
                            </span>

                        </div>

                        <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                            <span className="flex flex-col md:col-span-4">

                            </span>
                        </div>

                        <Dialog modal position="center" visible={attachShow} header={translations.filing.standard_filing.options_speed_dial.charge_docs} style={{ width: '70vw' }} onHide={() => setAttachShow(false)}>
                            <ChargeDocuments items={[{ id: filingId }]} radicado={true} onFinish={() => {setAttachShow(false);}}/>
                        </Dialog>
                    </form>
                </Card>
            </div>
        </div>
    )
}
