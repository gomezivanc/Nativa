import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Column } from 'primereact/column';
import { Chip } from "primereact/chip";
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { router } from '@inertiajs/react';

export const SendCertifiedMail = ({ tableDocument, responseDocument, idResponse, defaultVals = {}, onFinish,dataFiling }) => {
    const { translations, current_language } = usePage()?.props;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        reset,
        setError,
        clearErrors,
        watch
    } = useForm({
        defaultValues: {
            send_to: [],
            ...defaultVals
        }
    });
    const [emails, setEmails] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [dependencies, setDependencies] = useState([]);
    const [users, setUsers] = useState([]);
    const dependency_id = watch("dependency_id");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDependencies();
    }, []);

    useEffect(() => {
        getUsers();
    }, [dependency_id]);

    // Validación de correo electrónico
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const addEmail = () => {
        const email = getValues("email")?.trim();

        if (!email) {
            setError("email", { type: "required", message: "El correo es requerido" });
            return;
        }

        if (!validateEmail(email)) {
            setError("email", { type: "invalid", message: "Correo electrónico no válido" });
            return;
        }

        if (emails.includes(email)) {
            setError("email", { type: "duplicate", message: "Este correo ya fue agregado" });
            return;
        }

        setEmails([...emails, email]); // Agrega el correo a la lista
        setValue('email','')
        clearErrors("email"); // Limpia los errores
    };

    
    // Eliminar un correo
    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    async function getDependencies() {
        const res = await axios.get(route("dependencies.list"), {
            params: {
                typeData: 'todos',
                only_unit_admin: true
            }
        });
        setDependencies(res.data);
    }

    async function getUsers() {
        if (!dependency_id) {
            return;
        }
        const res = await axios.get(route("usuarios.getUsers"), {
            params: {
                by_dependency: dependency_id
            }
        });
        setUsers(res.data);
    }

    async function submit(data) {
        setLoading(true);
        const emailInput = data.email?.trim();

        let emailsFinal = [...emails];

        if (emailInput) {
            if (validateEmail(emailInput) && !emailsFinal.includes(emailInput)) {
                emailsFinal.push(emailInput);
            }
        }
        
        const selectedEmails = users.filter(user => data.send_to?.includes(user.id)).map(user => user.email);
        emailsFinal = [...emailsFinal, ...selectedEmails];
        emailsFinal = [...new Set(emailsFinal)]; // Elimina correos duplicados

        data.filing = dataFiling;    
        data.emails = emailsFinal;
        data.documents = selectedItem;
        data.response_templates = responseDocument;
        data.idResponse = idResponse;
        delete data.send_to; // Elimina el campo send_to ya que solo necesitamos los correos finales
        
        try {
            const res = await axios.post(route("filing.send-response-mail"), data);
            if (res.data.success) {
                window.open(route('acuse.show', res.data.response_template_id), '_blank');
                toast.success(`exitoso`);  
                setTimeout(() => {
                    router.visit(route('distributionshipping.index'));
                }, 100);    
            } else {
                toast.error(res.data.message || translations.auth.error); // Mensaje de error del backend
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error); // Muestra el error exacto del backend
            } else {
                toast.error(translations.auth.error); // Mensaje genérico si no hay error específico
            }
            console.error(error);
            
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    let normalizedTableDocuments = [];
    if (tableDocument) {
        normalizedTableDocuments = tableDocument.map(item => {
            if (item.file_detail && typeof item.file_detail === 'string') {
                try {
                    item.file_detail = JSON.parse(item.file_detail);
                } catch (error) {
                    console.error("Error parsing file_detail:", error);
                    item.file_detail = {};l
                }
            }
            return item;
        });
    }

    let normalizedResponseDocuments = [];
    if (responseDocument) {
        normalizedResponseDocuments = responseDocument.map(item => ({
            ...item,
            description: 'Respuesta',
            file_detail: {
                name: item.name ?? item.file_name ?? 'Documento respuesta_' + new Date(item.created_at).toLocaleString('es-CO'),
            }
        }));
    }

    // Unir documentos de ambas fuentes
    const allDocuments = [...normalizedTableDocuments, ...normalizedResponseDocuments];

    return (
        
        <form onSubmit={handleSubmit(submit)} className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end">
            
            {loading && (
                <div className="flex justify-center items-center md:col-span-6">
                    <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
                </div>
            )}

            <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <span className="flex flex-col md:col-span-5">
                        <label htmlFor="email">{translations.filing.standard_filing.add_correo}</label>                        
                        <InputText
                            id="email"
                            type="text"
                            {...field}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addEmail();
                                }
                            }}
                            className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                        />
                        {fieldState.error && (
                            <small className="p-error">{fieldState.error.message}</small>
                        )}
                    </span>
                )}
            />
            {/* Botón para agregar correos */}
            <div className="md:col-span-1 flex gap-2">
                <Button
                    label={translations.auth.users.table_apps.add}
                    className="col-span-2"
                    size="small"
                    type="button"
                    onClick={addEmail} // Agrega el correo al hacer clic
                />
            </div>

            <hr className="md:col-span-6" />

            {/* Mostrar correos como chips */}
            <div className="flex flex-wrap gap-2">
                {emails.map((email, index) => (
                    <Chip
                        icon="pi pi-envelope"
                        key={email}
                        label={email}
                        onRemove={() => removeEmail(email)}
                        className="p-mr-2"
                        removable
                    />
                ))}
            </div>
            <hr className="md:col-span-6" />
            <h3 className="flex flex-col md:col-span-6">{translations.filing.standard_filing.copy_to}</h3>
            <span className="flex flex-col md:col-span-3">
                <label htmlFor="dependency_id">{translations.filing.standard_filing.form.dependency}</label>
                <Controller
                    name="dependency_id"
                    control={control}
                    // rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={dependencies} optionLabel='name' optionValue='id' filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                placeholder={translations.filing.standard_filing.form.dependency}
                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                            />
                            {
                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
                        </>

                    )}
                />
            </span>
            <span className="flex flex-col  md:col-span-3">
                <label htmlFor="official_id">{translations.filing.standard_filing.form.official}</label>                
                <Controller
                    name="send_to"
                    control={control}
                    // rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <MultiSelect
                                filter
                                options={users}
                                optionLabel={(i) => `${i.persona.nombre} ${i.persona.apellido ?? ''}`}
                                optionValue="id"
                                value={field.value || []}
                                display="chip"
                                onChange={(e) => field.onChange(e.value)}
                                className="w-full"
                                placeholder={translations.filing.standard_filing.form.official}
                            />
                            {
                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
                        </>

                    )}
                />
            </span>

            <DataTable className="md:col-span-6" value={allDocuments} selectionMode="multiple"
                selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)}
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                size='small' emptyMessage={translations.auth.not_found} paginator rows={10} >
                <Column selectionMode='multiple'></Column>
                <Column header={translations.filing.standard_filing.table_document.name} field="file_detail.name"></Column>
                <Column header={translations.filing.standard_filing.table_document.description} field="description"></Column>
            </DataTable>

            <div className="md:col-span-6 text-end">
                <Button loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
            </div>
        </form>
    );
};