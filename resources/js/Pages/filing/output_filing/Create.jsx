
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Link, usePage, router } from '@inertiajs/react'
import { Dropdown } from 'primereact/dropdown'
import { Fieldset } from 'primereact/fieldset'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import Upload from '../../../components/Upload'
import { useLoading } from "../../../Context/preloadContext"
import { exportBase64 } from "../../../hooks/converBase64"
import { MultiSelect } from "primereact/multiselect";
import { ChargeDocuments } from '../../document_gestion/ExpFiles/Dialogs/ChargeDocuments'
import { Dialog } from 'primereact/dialog'

export default function Index({ id, emitIdCreated, noChangeView = false, masive = false  }) {
    // Props del página
    const {receptionMedium,currentLocale,priorities,translations,auth,typePerson,editar,} = usePage().props

    const isEditMode = editar === true

    // Form Control
    const {register,handleSubmit,getValues,formState: { errors },setValue,control,watch,trigger } = useForm({
        defaultValues: {
            serie_bool: 0
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "filesList"
    })

    // Estado Global UI
    const { setIsLoading } = useLoading()
    const [step, setStep] = useState(1)
    const [creadoExitoso, setCreadoExitoso] = useState(editar ?? false)
    const [verDatos, setVerDatos] = useState(false)
    const [loadingRadicado, setLoadingRadicado] = useState(false)
    const AformRef = useRef()

    // Estados de Datos
    const [series, setSeries] = useState([])
    const [subseries, setSubseries] = useState([])
    const [subseriesFiltered, setSubseriesfiltered] = useState([])
    const [dependencies, setDependencies] = useState([])
    const [users, setUsers] = useState([])
    const [typeDocuments, setTypeDocuments] = useState([])
    const [typeProcess, setTypeProcess] = useState([])
    const [typeFiling, setTypeFiling] = useState([])
    const [countries, setCountries] = useState([])
    const [uniti, setUniti] = useState([])
    const [attachShow, setAttachShow] = useState(false)
    const [departaments, setDepartaments] = useState([])
    const [cities, setCities] = useState([])
    const [expFilesSupportsType, setExpFilesSupportsType] = useState([])
    const [typeDocsFiltered, setTypeDocsFiltered] = useState([])

    // Estados de Filing
    const [filingId, setFilingId] = useState(null)
    const [filingNumber, setFilingNumber] = useState(null)

    // Watchers
    const serie_bool = watch("serie_bool")
    const serie = watch("serie")
    const dependency_id = watch("dependency_id")
    const remainingDays = watch("remaining_days")
    const countryId = watch('country_id')
    const departament_id = watch('department_id')
    const typePersonSelect = watch("type_person_id_sender")
    const types_filings_id = watch("types_filings_id")
    const copia_id = watch("copia")

    // Propiedades derivadas
    const hasSubseries = subseries && subseries.length > 0
    const { onChange: rhfOnChange, ...iasFiledRest } = register("ias_filed")

    // Options constants
    const filedResponseOptions = [
        { name: "Correo electrónico", value: 1 },
        { name: "Correo físico", value: 2 }
    ]

    const steps = [
        { id: 1, name: 'Radicación' },
        { id: 2, name: 'Información de Correspondencia' },
        { id: 3, name: 'Clasificación y Trámite' },
        { id: 4, name: 'Documentos y Anexos' },
        { id: 5, name: 'Distribución y Radicación' }  
    ]

    // ==================== EFECTOS ====================

    // Inicialización
    useEffect(() => {
        getTypeFiling()
        getDependencies()
        getCountries()
        getTypeDocuments()
        getTypeProcess()
        fetchSupportTypes()
        getUniti()
        if (id) {
            getItem(id)
        }
    }, [])

    // Filtrar subseries por serie
    useEffect(() => {
        setSubseriesfiltered(subseries.filter(i => i.series?.code === serie?.code))
    }, [serie, subseries])

    // Cargar usuarios y series por dependencia
    useEffect(() => {
        if (dependency_id) {
            getUsers()
            getSeries()
        }
    }, [dependency_id])

    // Cargar departamentos por país
    useEffect(() => {
        if (countryId) {
            getDepartaments(countryId)
        }
    }, [countryId])

    // Cargar ciudades por departamento
    useEffect(() => {
        if (departament_id) {
            getCities(departament_id)
        }
    }, [departament_id])

    // Generar número de radicado
    useEffect(() => {
        if (!editar && types_filings_id) {
            filing_number_trigger()
        }
    }, [types_filings_id])

    // Cargar subseries por serie
    useEffect(() => {
        subSerie()
    }, [serie])

    // Establecer fecha actual
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]
        setValue("document_date", today)
    }, [setValue])

    // Calcular fecha de vencimiento
    useEffect(() => {
        if (!remainingDays) {
            setValue("expiration_date", null)
            return
        }

        const days = parseInt(remainingDays, 10)
        if (isNaN(days)) {
            setValue("expiration_date", null)
            return
        }

        const fetchDate = async () => {
            try {
                const res = await axios.get(route('filing.getExpirationDate'), {
                    params: { days }
                })

                const [year, month, day] = res.data.date.split('-')
                const localDate = new Date(year, month - 1, day)
                const formattedDate = localDate.toLocaleDateString(currentLocale, {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })

                setValue("expiration_date", formattedDate)
            } catch (error) {
                console.error(error)
            }
        }

        fetchDate()
    }, [remainingDays, currentLocale, setValue])

    async function submit(data) {
        if (creadoExitoso) return;
        setIsLoading(true);
        try {
            // 1. Procesar los archivos antes de enviar
            if (data.filesList && data.filesList.length > 0) {
                for (let i = 0; i < data.filesList.length; i++) {
                    const item = data.filesList[i];
                    
                    // Verificamos si hay un archivo seleccionado en el input
                    if (item.file && item.file[0]) {
                        // Usamos tu hook/helper para convertir a Base64
                        const { file, base64Only } = await exportBase64(item.file[0]);
                        
                        // Reemplazamos el FileList original por el string Base64 y los detalles
                        data.filesList[i].file = base64Only;
                        data.filesList[i].file_detail = file;
                    }
                }
            }
            // 2. Agregar datos adicionales
            data.masive = masive;

            // 3. Enviar la petición
            const res = await axios.post(route("filing.store"), data);

            // 4. Lógica de éxito (tu código original)
            toast.success(translations.auth.success + " " + `${translations.filing.standard_filing.generated_filing} : ${res.data.filing_number}`);
            
            if (noChangeView) {
                emitIdCreated(res.data.id);
                return;
            }
            setFilingId(res.data.id);
            setFilingNumber(res.data.filing_number);
            setCreadoExitoso(true);
            await exportStiker(res.data.id, res.data.filing_number);

        } catch (error) {
            if (error.response?.status === 409) {
                toast.warning("El radicado ya fue usado. Generando uno nuevo...");
                await filing_number_trigger();
                setIsLoading(false);
                return;
            }

            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(translations.auth.error);
            }
        }finally{
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    // ==================== FUNCIONES DE VALIDACIÓN Y BÚSQUEDA ====================

    const handleSerieChange = (serie) => {
        setValue("sub_serie", null)
        setValue("document_type_id", null)

        const tieneSubseries = serie?.subseries?.length > 0

        if (tieneSubseries) {
            setTypeDocsFiltered([])
            return
        }

        const tipos = serie?.retencion?.tipos_documentales ?? []
        setTypeDocsFiltered(tipos.length > 0 ? tipos : [])
    }


    // ==================== FUNCIONES API ====================

    const getCountries = async () => {
        try {
            const res = await axios.get(route("regional.countries"))
            setCountries(res.data)
        } catch (error) {
            console.error("Error al obtener países:", error)
        }
    }

    const getUniti = async () => {
        try {
            const res = await axios.get(route("distribution.listFull"))
            setUniti(res.data)
        } catch (error) {
            console.error("Error al obtener Unidades:", error)
        }
    }

    const getDepartaments = async (countryId) => {
        try {
            const res = await axios.get(route("departamento.selectDepartamento"), {
                params: { country_id: countryId }
            })

            if (res.data.departamentos?.length > 0) {
                setDepartaments(res.data.departamentos)
            } else {
                setDepartaments([])
                toast.error(translations.auth.no_data)
            }
        } catch (error) {
            console.error("Error al obtener departamentos:", error)
            toast.error(translations.auth.error)
        }
    }

    const getCities = async (departament_id) => {
        try {
            const res = await axios.get(route("ciudad.selectCiudad"), {
                params: { id_departamento: departament_id }
            })
            setCities(res.data.ciudades ?? [])
        } catch (error) {
            console.error("Error al obtener ciudades:", error)
        }
    }

    const getSeries = async () => {
        if (!dependency_id) return
        try {
            const res = await axios.get(route("dependencies.seriesSelect"), {
                params: { by_dependency: dependency_id }
            })
            setSeries(res.data.serie ?? [])
        } catch (error) {
            console.error("Error al obtener series:", error)
        }
    }

    const subSerie = async () => {
        if (!serie) return
        try {
            const res = await axios.get(route("dependencies.SubseriesSelect"), {
                params: { serie: serie }
            })
            setSubseries(res.data.subSerie ?? [])
        } catch (error) {
            console.error("Error al obtener subseries:", error)
        }
    }

    const getTypeDocuments = async () => {
        try {
            const res = await axios.get(route('tipoDocumento.index'))
            setTypeDocuments(res.data.tipoDocumentos ?? [])
        } catch (error) {
            console.error("Error al obtener tipos de documento:", error)
        }
    }

    const getTypeProcess = async () => {
        try {
            const res = await axios.get(route('filing.type-process'))
            setTypeProcess(res.data.tipoTramites ?? [])
        } catch (error) {
            console.error("Error al obtener tipos de proceso:", error)
        }
    }

    const getUsers = async () => {
        if (!dependency_id) return
        try {
            const res = await axios.get(route("usuarios.getUsers"), {
                params: { by_dependency: dependency_id }
            })
            setUsers(res.data ?? [])
        } catch (error) {
            console.error("Error al obtener usuarios:", error)
        }
    }

    const getDependencies = async () => {
        try {
            const res = await axios.get(route("dependencies.list"), {
                params: { typeData: 'todos', only_unit_admin: true }
            })
            setDependencies(res.data ?? [])
        } catch (error) {
            console.error("Error al obtener dependencias:", error)
        }
    }

    const getTypeFiling = async () => {
        try {
            const res = await axios.get(route("types-filings.list"), {
                params: { typeData: 'todos' }
            })
            
            setTypeFiling(res.data ?? [])

            const currentRolId = auth.current_role_id 
            const roleData = auth.user.roles.find(rol => rol.id === currentRolId)

            if (roleData?.type_filing_id) {
                const existeEnLista = res.data?.some(t => t.id === roleData.type_filing_id)
                if (existeEnLista) {
                    setValue("types_filings_id", roleData.type_filing_id)
                }
            } else {
                toast.warning("Debe estar con un rol asociado a la radicación")
                router.visit(route("filing.index"))
            }
        } catch (error) {
            console.error("Error en getTypeFiling:", error)
            toast.error(translations.auth.error)
        }
    }

    const fetchSupportTypes = async () => {
        try {
            const response = await fetch(route('files-exp.detailex'))
            const data = await response.json()
            if (data.expFilesSupportsType) {
                setExpFilesSupportsType(data.expFilesSupportsType)
            }
        } catch (error) {
            console.error("Error al obtener tipos de soporte:", error)
        }
    }

    const getItem = async (id) => {
        try {
            const res = await axios.get(route("filing.show", id))

            Object.entries(res.data).forEach(([key, value]) => {
                if (key !== 'associated_filings') {
                    setValue(key, value)
                }
            })

            setValue('associated_filings', res.data.associated_filings?.map(i => i.id) ?? [])
            setValue('serie', res.data.serie)

            if (res.data.subserie?.length > 0) {
                setSubseriesfiltered(res.data.subserie.filter(i => i.series?.code === serie?.code))
            }
        } catch (error) {
            console.error("Error al obtener el item:", error)
            toast.error(translations.auth.error)
        }
    }

    const filing_number_trigger = async () => {
        try {
            const res = await axios.get(route("filing.filing_number"), {
                params: { types_filings_id, dependency_id }
            })
            setValue("filing_number", res.data.filing_number)
        } catch (error) {
            console.error("Error al generar número de radicado:", error)
        }
    }

    const searchThirdByDocument = async (document) => {
        if (!document?.trim()) return

        try {
            const res = await axios.get(route('filing.search-third-by-document'), {
                params: { document_nit_sender: document }
            })

            if (res.data.found) {
                const thirdData = res.data.data
                setValue('name_social_reason_sender', thirdData.name_social_reason_sender)
                setValue('first_surname_legal_representative_sender', thirdData.first_surname_legal_representative_sender)
                setValue('email_sender', thirdData.email_sender)
                setValue('phone_sender', thirdData.phone_sender)
                setValue('address_sender', thirdData.address_sender)
                setValue('country_id', thirdData.country_id)
                setValue('department_id', thirdData.department_id)
                
                setTimeout(() => {
                    setValue('city_id', thirdData.city_id)
                }, 300)
            } else {
                // Limpiar campos si no existe
                setValue('name_social_reason_sender', '')
                setValue('first_surname_legal_representative_sender', '')
                setValue('email_sender', '')
                setValue('phone_sender', '')
                setValue('address_sender', '')
                setValue('country_id', '')
                setValue('department_id', '')
            }
        } catch (error) {
            console.log('Tercero no encontrado en el sistema')
        }
    }


    // ==================== FUNCIONES DE UTILIDAD ====================

    const exportStiker = async (id, filingNumber) => {
        try {
            const response = await axios.get(route('filing.export-stiker'), {
                params: { id },
                responseType: 'blob',
            })

            const fileName = `sticker_${filingNumber}.pdf`
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error al exportar el sticker:", error)
            toast.error("Error al exportar el sticker")
        }
    }

    //===================funcion para copias=======================

    const enviocopias = async (id,copia_units_id) => {
        try{
            
            const response = await axios.get(route('filing.copy-official-uniti'),{
                params: {
                    id,
                    copia_units_id,
                }
            })
        
        }catch (error){
            console.error("Error no se puede ", error)
        }
    }

    // ==================== HANDLERS ====================

    const handleNext = async () => {
        let fieldsToValidate = []

        switch (step) {
            case 1:
                fieldsToValidate = ['types_filings_id', 'document_date', 'clasification_id']
                break
            case 2:
                fieldsToValidate = ['type_person_id_sender', 'document_nit_sender', 'name_social_reason_sender']
                break
        }

        const valid = await trigger(fieldsToValidate)
        if (valid) {
            setStep(step + 1)
        }
    }

    const handleGenerarRadicado = async () => {
        const isValid = await trigger()
        if (!isValid) {
            toast.warn("Hay campos obligatorios sin diligenciar")
            AformRef.current?.scrollIntoView({ behavior: 'smooth' })
            return
        }

        try {
            setLoadingRadicado(true)
            const data = getValues()
            await submit(data)
        } catch (error) {
            toast.error("Error al generar el radicado")
        } finally {
            setLoadingRadicado(false)
        }
    }

    const handleClear = () => {
        router.visit(route("filing.create"))
    } 
    return (
        <div>
            <div>
                <Card  header={
                    <>
                        <div className="relative flex items-center justify-center py-4">
                            {
                                !noChangeView &&
                                <div className="absolute left-4">
                                    <Link href={route("filing.index")}>
                                        <Button icon="pi pi-arrow-left" className="p-button-text p-button-rounded hover:bg-gray-100" tooltip={translations.auth.back}/>
                                    </Link>
                                </div>
                            }

                            <div className="flex gap-6">
                                {steps.map((s) => (
                                    <div key={s.id} onClick={() => setStep(s.id)} className="cursor-pointer flex flex-col items-center group" >
                                        <span className={`text-sm font-medium transition-colors ${ step === s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {s.name}
                                        </span>
                                        <div className={`mt-2 h-1 w-full rounded transition-all ${ step === s.id ? 'bg-blue-600' : 'bg-transparent' }`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-b mb-4"></div>
                    </>
                    }>

                    {id && (
                        <div className="my-3">
                        <Fieldset legend={translations.filing.standard_filing.table.number_filing } >
                            <p className="m-0">{filingNumber}</p>
                        </Fieldset>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(submit)} ref={AformRef} className="grid grid-cols-1 md:grid-cols-6 gap-4" >
                        {/* Radicacion parte 1  */}
                        {step === 1 && (
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                                <h2 className='md:col-span-6 font-bold'>{ 'Radicación de salida' }</h2>
                                <div className="md:col-span-6 flex justify-end">
                                    <Button
                                        type="button"
                                        icon={"pi pi-check-circle"}
                                        label={"Generar Radicado"}
                                        className="p-button-text p-button-sm"
                                        onClick={() => setVerDatos(true)}
                                    />
                                </div>
                                <hr className='md:col-span-6' />
                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="types_filings_id">
                                        { translations.filing.standard_filing.form.types_filing }
                                    </label>
                                    
                                    <Controller
                                        name="types_filings_id"
                                        control={control}
                                        render={({ field, fieldState }) => {
                                            // Buscamos el rol para saber si bloqueamos el select
                                            const roleForced = auth.user.roles.find(r => r.id == auth.current_role_id);
                                            const hasForcedValue = !!roleForced?.type_filing_id;

                                            return (
                                                <Dropdown 
                                                    {...field}
                                                    options={typeFiling} 
                                                    optionLabel='name' 
                                                    optionValue='id'
                                                    disabled={creadoExitoso || hasForcedValue} // Bloquea si el rol ya lo define
                                                    filter
                                                    onChange={(e) => field.onChange(e.value)}
                                                    className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                                                />
                                            );
                                        }}
                                    />
                                </span>

                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="filing_number">{ translations.filing.standard_filing.form.filing_number }</label>
                                    <InputText
                                        placeholder={translations.filing.standard_filing.form.filing_number}
                                        // Cambia entre 'text' y 'password' para ocultar el contenido
                                        type={verDatos ? "text" : "password"}
                                        disabled={creadoExitoso}
                                        readOnly
                                        {...register("filing_number")}
                                        className={{ 
                                            'p-invalid': errors?.filing_number, 
                                            'w-full': true,
                                            'bg-gray-100': !verDatos // Opcional: fondo gris cuando esté oculto
                                        }}
                                    />
                                </span>

                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="document_date">{ translations.filing.standard_filing.form.document_date }</label>
                                    <InputText 
                                        // Para el input date, el enmascaramiento se hace con CSS
                                        type={verDatos ? 'date' : 'password'} 
                                        disabled 
                                        { ...register("document_date", { required: translations.validation.attributes.field_required }) } 
                                        className={{ 
                                            'p-invalid': errors?.document_date,
                                            'w-full': true,
                                            'bg-gray-100': !verDatos 
                                        }} 
                                    />
                                    {errors?.document_date && (
                                        <span className="text-red-600 text-sm">{errors.document_date?.message}</span>
                                    )}
                                </span>
                                
                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="ias_filed">{ 'Referencia' }</label>
                                    <InputText {...iasFiledRest} disabled={creadoExitoso} placeholder={'Referencia'} 
                                        onChange={(e) => {
                                            rhfOnChange(e); 
                                            const value = e.target.value;
                                            if (value && value.trim().length > 3) {
                                                debouncedCheck(value);
                                            }
                                        }}
                                        className={`${errors?.ias_filed ? 'p-invalid' : ''} w-full`}
                                    />
                                </span>
                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="number_pages">{ translations.filing.standard_filing.form.number_pages }</label>
                                    <InputText maxLength={3} disabled={creadoExitoso}  placeholder={ translations.filing.standard_filing.form.number_pages } type='text' { ...register("number_pages",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.number_pages,'w-full':true }} />
                                        {errors?.number_pages && (
                                            <span className="text-red-600">{errors.number_pages?.message}</span>
                                        )}
                                </span>
                            </div>
                        )}
                        
                        {/* información de Correspondencia */}
                        {step === 2 && ( <>
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                                {/* Responsible */}
                                <h3 className='md:col-span-6 font-bold'>{ translations.filing.standard_filing.additional_information }</h3>
                                <hr  className='md:col-span-6 mb-3'/>

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
                                                    disabled={creadoExitoso}
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
                                <span className="flex flex-col  md:col-span-3">
                                    <label htmlFor="official_id">{ translations.filing.standard_filing.form.official }</label>
                                    <Controller
                                        name="official_id"
                                        control={control}
                                        rules={{ required: translations.validation.attributes.field_required }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Dropdown  options={users} optionLabel={i => `${i.persona.nombre} ${(i.persona.apellido) ? i.persona.apellido : ''}`} optionValue='id' filter
                                                    value={field.value}
                                                    disabled={creadoExitoso}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                                    placeholder={ translations.filing.standard_filing.form.official }
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
                                {
                                    masive == false && <>
                                        <h2 className='md:col-span-6 font-bold'>{'Datos del destinatario'}</h2>
                                        <hr  className='md:col-span-6 mb-3'/>
                                        <span className="flex flex-col md:col-span-3">
                                            <label htmlFor="type_person_id_sender">{ translations.filing.standard_filing.form.type_person }</label>
                                            <Controller
                                                name="type_person_id_sender"
                                                control={control}
                                                rules={{ required: translations.validation.attributes.field_required }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Dropdown options={typePerson} optionLabel={'name_'+currentLocale} optionValue='id' filter
                                                            value={field.value}
                                                            disabled={creadoExitoso}
                                                            onChange={(e) => field.onChange(e.value)}
                                                            placeholder={ translations.filing.standard_filing.form.type_person }
                                                            className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                                        />
                                                        {
                                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                        }
                                                    </>
                                                )}
                                            />
                                        </span>

                                        {typePersonSelect != null && <>
                                                <span className="flex flex-col md:col-span-3">
                                                    <label htmlFor="document_nit_sender">{typePersonSelect == 1 ? translations.filing.standard_filing.form.nit_sender: translations.filing.standard_filing.form.document_sender }</label>
                                                    <InputText
                                                        disabled={creadoExitoso}
                                                        maxLength={typePersonSelect == 1 ? 9 : 16}
                                                        keyfilter="num"
                                                        placeholder={typePersonSelect == 1 ? translations.filing.standard_filing.form.nit_sender : translations.filing.standard_filing.form.document_sender}
                                                        type="tel" 
                                                        {...register("document_nit_sender", {
                                                            required: translations.validation.attributes.field_required,
                                                            onBlur: (e) => searchThirdByDocument(e.target.value)
                                                        })}
                                                        className={{ 'p-invalid': errors?.document_nit_sender, 'w-full': true }}
                                                    />
                                                </span>

                                                <div className={`flex flex-col ${typePersonSelect == 1 ? 'md:col-span-6' : 'md:col-span-3'}`}>
                                                    <label htmlFor="name_social_reason_sender">
                                                        {typePersonSelect == 1 ? translations.archive_gestion.accumulated_fund.show.social_reason : translations.filing.standard_filing.table_document.name}
                                                    </label>
                                                    
                                                    <div className="p-inputgroup relative">
                                                        <InputText
                                                            id="name_social_reason_sender"
                                                            disabled={creadoExitoso}
                                                            placeholder={typePersonSelect == 1 ? translations.archive_gestion.accumulated_fund.show.social_reason : translations.filing.standard_filing.table_document.name}
                                                            {...register("name_social_reason_sender", { required: true })}
                                                            className={`w-full ${errors?.name_social_reason_sender ? 'p-invalid' : ''}`}
                                                        />
                                                        
                                                        {typePersonSelect == 1 && watch("document_nit_sender") && (
                                                            <span className="absolute right-0 mr-3 top-50 -translate-y-50 text-gray-500 pointer-events-none text-sm bg-white px-1">
                                                                ({watch("document_nit_sender")})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="flex flex-col md:col-span-3">
                                                    <label htmlFor="first_surname_legal_representative_sender">{typePersonSelect == 1 ? translations.filing.standard_filing.form.legal_representative_sender :  translations.filing.standard_filing.form.first_surname_sender}</label>
                                                    <InputText disabled={creadoExitoso} placeholder={ typePersonSelect == 1 ? translations.filing.standard_filing.form.legal_representative_sender :  translations.filing.standard_filing.form.first_surname_sender } type='text' { ...register("first_surname_legal_representative_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.first_surname_legal_representative_sender,'w-full':true }} />
                                                    {errors?.first_surname_legal_representative_sender && (
                                                        <span className="text-red-600">{errors.first_surname_legal_representative_sender?.message}</span>
                                                    )}
                                                </span>
                                                {typePersonSelect != 1 && <>
                                                        <span className="flex flex-col md:col-span-3">
                                                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.type_document_id }</label>
                                                            <Controller
                                                                name="type_document_id"
                                                                control={control}
                                                                rules={{ required: translations.validation.attributes.field_required }}
                                                                render={({ field, fieldState }) => (
                                                                    <>
                                                                        <Dropdown
                                                                            disabled={creadoExitoso}
                                                                            options={typeDocuments.filter(doc => doc.id !== 4)}
                                                                            optionLabel="nombre"
                                                                            optionValue="id"
                                                                            filter
                                                                            value={field.value}
                                                                            onChange={(e) => field.onChange(e.value)}
                                                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                                                        />

                                                                        {
                                                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                                        }
                                                                    </>
                                                                )}
                                                            />
                                                        </span>
                                                    </>
                                                }

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
                                                                    disabled={creadoExitoso}
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
                                                                    disabled={creadoExitoso}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    placeholder={ translations.filing.standard_filing.form.department_id }
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
                                                    <label htmlFor="city_id">{ translations.filing.standard_filing.form.city_id }</label>
                                                    <Controller
                                                        name="city_id"
                                                        control={control}
                                                        rules={{ required: translations.validation.attributes.field_required }}
                                                        render={({ field, fieldState }) => (
                                                            <>
                                                                <Dropdown options={cities} optionLabel='nom_ciudad' optionValue='id_ciudad' filter
                                                                    value={field.value}
                                                                    disabled={creadoExitoso}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    placeholder={ translations.filing.standard_filing.form.city_id }
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
                                                    <label htmlFor="address_sender">{ translations.filing.standard_filing.form.address_sender }</label>
                                                    <InputText disabled={creadoExitoso} placeholder={ translations.filing.standard_filing.form.address_sender } type='text' { ...register("address_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.address_sender,'w-full':true }} />
                                                    {errors?.address_sender && (
                                                        <span className="text-red-600">{errors.address_sender?.message}</span>
                                                    )}
                                                </span>
                                                <span className="flex flex-col md:col-span-3">
                                                    <label htmlFor="phone_sender">{ translations.filing.standard_filing.form.phone_sender }</label>
                                                    <InputText disabled={creadoExitoso} placeholder={ translations.filing.standard_filing.form.phone_sender } type='text' { ...register("phone_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.phone_sender,'w-full':true }} />
                                                    {errors?.phone_sender && (
                                                        <span className="text-red-600">{errors.phone_sender?.message}</span>
                                                    )}
                                                </span>
                                                <span className="flex flex-col md:col-span-3">
                                                    <label htmlFor="email_sender">{ translations.filing.standard_filing.form.email_sender }</label>
                                                    <InputText disabled={creadoExitoso} placeholder={ translations.filing.standard_filing.form.email_sender } type='email' { ...register("email_sender",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.email_sender,'w-full':true }} />
                                                    {errors?.email_sender && (
                                                        <span className="text-red-600">{errors.email_sender?.message}</span>
                                                    )}
                                                </span>
                                            </>
                                        }
                                    </>
                                }
                                {
                                    masive == true && <>
                                        <div className='md:col-span-6'>
                                            <div className='flex flex-col'>
                                                <span>{ translations.filing.standard_filing.form.destinatary }:</span>
                                                <a className='md:col-span-6 text-blue-600' href="/documentos/plantillas/Plantilla de cargue.xlsx" download>Descargar plantilla</a>
                                            </div>
                                            <Upload limitDocs={1} onChangeDocs={(e) => { setValue('masive_destinatary',e) }} allowedFiles=".xlsx,.xlsm,.xltx,xltm" />
                                        </div>
                                    </>
                                }
                            </div>

                                        
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                                {/* Asuntos y mas */}
                                <span className="flex flex-col md:col-span-6">
                                    <label htmlFor="subject">{ translations.filing.standard_filing.form.subject }</label>
                                    <InputTextarea disabled={creadoExitoso} { ...register("subject",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.subject,'w-full':true }} />
                                    {errors?.subject && (
                                        <span className="text-red-600">{errors.subject?.message}</span>
                                    )}
                                </span>
                            </div>
                            </>
                        )}

                        {/* Clasificación y Tramite */}
                        {step === 3 && (
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">
                        
                                <h3 className='md:col-span-6 font-bold'>{ translations.filing.standard_filing.filing_information }</h3>
                                <hr  className='md:col-span-6 mb-3'/>
                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="typeProcess_id">{ 'Tipo asunto' }</label>
                                    <Controller
                                        name="typeProcess_id"
                                        control={control}
                                        rules={{ required: translations.validation.attributes.field_required }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Dropdown options={typeProcess} optionLabel="name" optionValue="id"
                                                    value={field.value}
                                                    disabled={creadoExitoso}
                                                    placeholder={'Tipo asunto'}
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
                                
                                <div className="md:col-span-6 flex flex-col md:flex-row gap-3 mt-4">
                                    <Button
                                        type="button"
                                        label="Guardar Radicado"
                                        icon="pi pi-check"
                                        loading={loadingRadicado}
                                        disabled={creadoExitoso || loadingRadicado}
                                        className="flex-grow md:flex-initial"
                                        size="small"
                                        onClick={handleGenerarRadicado}
                                    />
                                    
                                    <Button
                                        type="button"
                                        icon="pi pi-print"
                                        label="Imprimir Sticker"
                                        tooltip="Sticker"
                                        severity="secondary"
                                        className="flex-grow md:flex-initial"
                                        size="small"
                                        onClick={() => exportStiker(filingId, filingNumber)}
                                        disabled={!creadoExitoso}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Documentos y Anexos */}
                        {step === 4 && (
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                
                                {/* HEADER */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">
                                        {translations.filing.standard_filing.documet_information}
                                    </h3>
                                </div>

                                <hr className="mb-4" />

                                {/* CONTENIDO (OCUPA TODO EL ANCHO) */}
                                <div className={`${!creadoExitoso ? 'pointer-events-none opacity-50' : ''}`}>
                                    <ChargeDocuments
                                        items={[{ id: filingId }]}
                                        radicado={true}
                                        typeDocs={typeDocsFiltered}
                                        onFinish={() => {
                                            setAttachShow(false);
                                        }}
                                    />
                                </div>

                            </div>
                        )}

                        {/* Distribución */}
                        {step === 5 && (
                            <div className="md:col-span-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-6 gap-4">

                                <h3 className='md:col-span-6 font-bold'>{ 'Fecha de salida' }</h3>
                                <hr  className='md:col-span-6 mb-3'/>
                                <span className="flex flex-col md:col-span-2">
                                    <InputText type='date' { ...register("data_exit") } />
                                </span>
                                

                            </div>
                        )}
                    </form>
                    <div className="flex justify-between items-center mt-6">                   
                        <div>
                            {/* Atrás */}
                            {step > 1 && (
                                <Button
                                    icon="pi pi-chevron-left"
                                    className="p-button-text p-button-rounded hover:bg-gray-100"
                                    onClick={() => setStep(step - 1)}
                                    tooltip="Atrás"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            )}
                        </div>
                        
                        <div>
                            {/* Siguiente / Final */}
                            {step < 5 ? (
                                <Button
                                    icon="pi pi-chevron-right"
                                    className="p-button-text p-button-rounded hover:bg-gray-100"
                                    onClick={handleNext}
                                    tooltip="Siguiente"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            ) : (
                                <Button
                                    icon="pi pi-check"
                                    label= 'Despachar'
                                    className="p-button-text p-button-rounded text-green-600 hover:bg-gray-100"
                                    onClick={handleClear}
                                    tooltip="Despachar"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            )}
                        </div>

                    </div>
                </Card>
            </div>
        </div>
    )
}
