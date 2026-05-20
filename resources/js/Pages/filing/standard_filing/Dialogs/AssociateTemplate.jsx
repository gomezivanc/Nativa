import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AssociateTemplate = ({ defaultVals = {}, onFinish, dataFiling = [] }) => {
    const { translations, current_language } = usePage()?.props;
    const [loading, setLoading] = useState(false);
    const [terceros, setTerceros] = useState([]);
    const [countries, setCountries] = useState([]);
    const [departaments, setDepartaments] = useState([]);
    const [typesDocuments, setTypesDocuments] = useState([]);
    const [typesPerson, setTypesPerson] = useState([]);
    const [cities, setCities] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    
    const {
        register,
        handleSubmit,        
        formState: { errors },
        control,
        watch
    } = useForm({
        defaultValues: defaultVals,
    });

    const [suggestions, setSuggestions] = useState([]);    
    const [officialSuggestions, setofficialSuggestions] = useState([]); 
    const [officialSeleccionado, setOfficialSelected] = useState([]);
    const [unserfiling, setNewUser] = useState(defaultVals?.filing_id ?? null);
    const filingId = defaultVals?.filing_id;
    const sender = unserfiling;
    const selectedTemplate = watch('template');

    useEffect(() => {
        userGet();
        getCountries();
        officialsGet();
        getTemplates();
        getTypeDocuments();
        getTypePerson();
    }, [])

    useEffect(() => {
        if (sender) {
            if (sender.country_id) {
                getDepartaments(sender.country_id);
            }
            if (sender.department_id) {
                getCities(sender.department_id);
            }
        }
    }, [sender]);

    async function userGet() {
        setLoading(true);
        let res = await axios.get(route("third.list"));
        setTerceros(res.data.data);
        setLoading(false);
    }
    
    async function officialsGet() {
        setLoading(true);
        try {
            const res = await axios.get(route("usuarios.list"), {
                params: { typeData: 'todos' }
            });
            setOfficials(res.data);
        } catch (error) {
            console.error(error);
            toast.error(translations.auth.error);
        }
        setLoading(false);
    }

    async function getTemplates() {
        const res = await axios.get(route("payroll-management.list"));
        setTemplates(res.data.data || []);
        setFilteredTemplates(res.data.data || []);
    }

    async function getTypeDocuments() {
        const res = await axios.get(route('tipoDocumento.index'))
        setTypesDocuments(res.data.tipoDocumentos)
    }

    async function getTypePerson() {
        const res = await axios.get(route('filing.type_person'))
        setTypesPerson(res.data.data);
    }

    async function getCountries() {
        const res = await axios.get(route("regional.countries"));
        setCountries(res.data);
    }

    async function getDepartaments(countryId) {   
        try {
            const res = await axios.get(route("departamento.selectDepartamento"), {
                params: { country_id: countryId }
            });    
            if (res.data.departamentos && res.data.departamentos.length > 0) {
                setDepartaments(res.data.departamentos);
            } else {
                setDepartaments([]); 
                toast.error(translations.auth.no_data);  
            }
        } catch (error) {
            console.error("Error al obtener departamentos:", error);    
            toast.error(translations.auth.error); 
        }
    }

    async function getCities(department_id) {       
        const res = await axios.get(route("ciudad.selectCiudad"), {
            params: { id_departamento: department_id }
        })
        setCities(res.data.ciudades)
    }

    const search = (event) => {
        const query = event.query.toLowerCase();
        const filtered = terceros.filter((item) =>
            item.document_nit_sender?.toLowerCase().includes(query) ||
            item.name_social_reason_sender?.toLowerCase().includes(query)
        );
        setSuggestions(filtered);
    };

    const searchOfficials = (event) => {
        const query = (event.query || "").toLowerCase();
        const filtered = (officials || []).filter((item) =>
            String(item.numero_documento || "").toLowerCase().includes(query) ||
            String(item.nombre || "").toLowerCase().includes(query)
        );
        setofficialSuggestions(filtered);
    };

    async function submit(data) {
        setLoading(true);
        const payload = {
            ...data,
            filing_id: filingId.id,
            third_document_nit: sender?.document_nit_sender ?? null,
            payroll_id: data.template?.id ?? null,
            template_url: data.template?.template_url ?? null,
            officials: data.officials?.map(o => o.id) ?? [],
            revisa: data.revisa?.id ?? null,
            aprueba: data.aprueba?.id ?? null,
        };

        try {
            const res = await axios.post(route("filing.storeResponseTemplate"),
                payload
            );

            if (res.data.success) {
                toast.success(`${translations.filing.standard_filing.successfully_uploaded_template}`);
                onFinish();
            } else {
                toast.error(res.data.message || translations.auth.error);
            }
        } catch (error) {
            const message = error.response?.data?.message || translations.auth.error;
            toast.error(message);
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    const SelectField = ({ label, name, control, options, optionLabel, optionValue, onChange }) => (
        <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        {...field}
                        value={field.value}
                        options={options}
                        optionLabel={optionLabel}
                        optionValue={optionValue}
                        placeholder="Seleccione"
                        filter
                        filterBy={optionLabel}
                        className="w-full"
                        onChange={(e) => {
                            field.onChange(e.value);
                            onChange && onChange(e.value);
                        }}
                    />
                )}
            />
        </div>
    );

    const Field = ({ label, value, name, register, errors, required = false }) => (
        <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {value ? (
                <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm min-h-[2.5rem] flex items-center">
                    {value}
                </div>
            ) : (
                <>
                    <InputText
                        {...register(name, {
                            required: required ? "Este campo es obligatorio" : false
                        })}
                        className={`w-full ${errors[name] ? "p-invalid" : ""}`}
                    />
                    {errors[name] && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors[name].message}
                        </span>
                    )}
                </>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
            
            {/* Sección 1: Usuario a asociar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Asociación de Usuario</h3>
                <div className="flex flex-col w-full">
                    <label htmlFor="document_id" className="block text-sm font-semibold text-gray-700 mb-1">
                        Buscar usuario por nombre o documento
                    </label>
                    <Controller
                        name="document_id"
                        control={control}
                        render={({ field }) => (
                            <AutoComplete
                                {...field}
                                suggestions={suggestions}
                                completeMethod={search}
                                field="name_social_reason_sender"
                                itemTemplate={(item) => (
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-user text-gray-400"></i>
                                        <span>{item.name_social_reason_sender} - <span className="text-gray-500 text-sm">{item.document_nit_sender}</span></span>
                                    </div>
                                )}
                                onChange={(e) => {
                                    field.onChange(e.value);
                                    if (!e.value) {
                                        setNewUser(defaultVals?.filing_id ?? null);
                                    } else {
                                        setNewUser(e.value);
                                    }
                                }}
                                placeholder="Escriba nombre o documento"
                                dropdown
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </div>  

            {/* Sección 2: Datos de Respuesta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    {translations.filing.standard_filing.response_data || 'Información del Destinatario'}
                </h3>
                
                {sender?.id ? (
                    /* VISTA DE TARJETA: Cuando el usuario ya existe */
                    <div className="flex flex-col md:flex-row items-center p-5 bg-blue-50/50 border border-blue-100 rounded-xl gap-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-blue-200 shadow-sm flex-shrink-0">
                            <i className="pi pi-user text-blue-500 text-3xl"></i>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 flex-grow">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">Nombre / Razón Social</span>
                                <span className="text-gray-800 font-medium">{sender.name_social_reason_sender}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">Documento / NIT</span>
                                <span className="text-gray-800 font-medium">{sender.document_nit_sender}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">Correo Electrónico</span>
                                <span className="text-gray-800 font-medium">{sender.email_sender}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">Teléfono</span>
                                <span className="text-gray-800 font-medium">{sender.phone_sender || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">Ubicación</span>
                                <span className="text-gray-800 font-medium">
                                    {sender.address_sender} {sender.city?.nombre ? `- ${sender.city.nombre}` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VISTA DE FORMULARIO: Cuando el usuario no existe */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <Field
                            label={translations.filing.standard_filing.form.name_social_reason_sender}
                            name="name_social_reason_sender"
                            register={register}
                            errors={errors}
                            required
                        />

                        <Field
                            label={translations.filing.standard_filing.form.first_surname_legal_representative_sender}
                            name="first_surname_legal_representative_sender"
                            register={register}
                            errors={errors}
                            required
                        />

                        <div className="flex flex-col">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {translations.filing.standard_filing.form.type_person}
                            </label>
                            <Controller
                                name="type_person_id_sender"
                                control={control}
                                rules={{ required: true }}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        options={typesPerson}
                                        optionLabel={'name_' + current_language}
                                        optionValue="id"
                                        filter
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        placeholder="Seleccione tipo"
                                        className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                    />
                                )}
                            />
                        </div>

                        <Field
                            label={translations.filing.standard_filing.form.document_nit_sender}
                            name="document_nit_sender"
                            register={register}
                            errors={errors}
                            required
                        />

                        <Field
                            label={translations.filing.standard_filing.form.address_sender}
                            name="address_sender"
                            register={register}
                            errors={errors}
                            required
                        />

                        <SelectField
                            label={translations.filing.standard_filing.form.country_id}
                            name="country_id"
                            control={control}
                            options={countries}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(countryId) => getDepartaments(countryId)}
                        />

                        <SelectField
                            label={translations.filing.standard_filing.form.department_id}
                            name="department_id"
                            control={control}
                            options={departaments}
                            optionLabel="nombre"
                            optionValue="id"
                            onChange={(departamentId) => getCities(departamentId)}
                        />

                        <SelectField
                            label={translations.filing.standard_filing.form.city_id}
                            name="city_id"
                            control={control}
                            options={cities}
                            optionLabel="nom_ciudad"
                            optionValue="id_ciudad"
                        />

                        <Field
                            label={translations.filing.standard_filing.form.email_sender}
                            name="email_sender"
                            register={register}
                            errors={errors}
                            required
                        />

                        <Field
                            label={translations.filing.standard_filing.form.phone_sender}
                            name="phone_sender"
                            register={register}
                            errors={errors}
                            required
                        />
                    </div>
                )}
            </div>

            {/* Sección 3: Funcionarios */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    {translations.filing.standard_filing.sending_official || 'Funcionario Remitente'}
                </h3>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            {translations.filing.standard_filing.official_details || 'Detalles del funcionario'}
                        </label>
                        <Controller
                            name="officials"
                            control={control}
                            render={({ field }) => (
                                <AutoComplete
                                    {...field}
                                    multiple
                                    value={field.value || []}
                                    suggestions={officialSuggestions}
                                    completeMethod={searchOfficials}
                                    field="persona.nombre"
                                    itemTemplate={(item) => (
                                        <div>{item.persona.nombre} - <span className="text-gray-500 text-sm">{item.persona.numero_documento}</span></div>
                                    )}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                        setOfficialSelected(e.value);
                                    }}
                                    placeholder="Buscar Funcionario"
                                    dropdown
                                    className="w-full"
                                    pt={{ container: { className: "w-full" }, input: { className: "w-full" } }}
                                />
                            )}
                        />
                    </div>

                    {/* Tarjetas de Funcionarios Seleccionados - NUEVO ESTILO MINIMALISTA */}
                    {officialSeleccionado.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                            {officialSeleccionado.map((official, index) => (
                                <div key={index} className="group relative flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 gap-4 overflow-hidden">
                                    {/* Acento lateral sutil en hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* Avatar de oficina */}
                                    <div className="flex items-center justify-center w-11 h-11 bg-gray-50 rounded-full border border-gray-100 flex-shrink-0">
                                        <i className="pi pi-user text-gray-400 text-lg"></i>
                                    </div>

                                    {/* Datos del funcionario */}
                                    <div className="flex flex-col flex-grow min-w-0">
                                        <span className="text-sm font-bold text-gray-800 truncate leading-tight mb-1">
                                            {official?.persona?.nombre}
                                        </span>
                                        
                                        <div className="flex flex-col gap-1 text-[11px] text-gray-500 tracking-wide">
                                            <div className="flex items-center gap-1.5">
                                                <i className="pi pi-id-card text-[10px] text-gray-400"></i>
                                                <span className="truncate font-medium">{translations.filing.standard_filing.document || 'DOC'}: {official?.persona?.numero_documento}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="pi pi-sitemap text-[10px] text-gray-400"></i>
                                                <span className="truncate">{official?.dependency?.name || "Sin dependencia asignada"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                            <i className="pi pi-users text-2xl text-gray-300"></i>
                            <span>No hay funcionarios seleccionados</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección 4: Plantilla */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end gap-4 mb-4">
                <div className="flex flex-col flex-1">
                    <label htmlFor="template_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        {translations.filing.standard_filing.form.template_name || 'Nombre de la plantilla'}
                    </label>                            
                    <Controller
                        name="template"
                        control={control}
                        render={({ field }) => (
                            <AutoComplete
                                value={field.value}
                                suggestions={filteredTemplates || []}
                                completeMethod={(e) => {
                                    const query = (e.query || "").toLowerCase();
                                    const filtered = templates.filter(t => (t.name || "").toLowerCase().includes(query));
                                    setFilteredTemplates(filtered);
                                }}
                                field="name"
                                dropdown
                                placeholder="Buscar plantilla para habilitar revisores"
                                className="w-full"
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />                
                </div>  
            </div>

            {/* SECCIÓN 5: REVISA Y FIRMA (Condicional) */}
            {selectedTemplate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 animate-fade-in">
                    
                    {/* Selector: Revisa */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-orange-400 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-eye text-orange-500"></i>
                            ¿Quién Revisa?
                        </h3>
                        <Controller
                            name="revisa"
                            control={control}
                            render={({ field }) => (
                                <AutoComplete
                                    {...field}
                                    suggestions={officialSuggestions}
                                    completeMethod={searchOfficials}
                                    field="persona.nombre"
                                    placeholder="Seleccionar revisor"
                                    dropdown
                                    className="w-full"
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                    </div>

                    {/* Selector: Firma */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-t-green-400 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-pencil text-green-500"></i>
                            ¿Quién Aprueba ?
                        </h3>
                        <Controller
                            name="aprueba"
                            control={control}
                            render={({ field }) => (
                                <AutoComplete
                                    {...field}
                                    suggestions={officialSuggestions}
                                    completeMethod={searchOfficials}
                                    field="persona.nombre"
                                    placeholder="Seleccionar Aprueba"
                                    dropdown
                                    className="w-full"
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                    </div>
                </div>
            )}

            {/* Botón de Guardar Final */}
            <div className="flex justify-end">
                <Button 
                    type="submit"
                    loading={loading} 
                    label={translations.documental_gestion?.exp_files?.save || 'Guardar Documento'} 
                    className="p-button-primary shadow-lg" 
                    size="large" 
                    icon="pi pi-save"
                />
            </div>

        </form>
    );
};