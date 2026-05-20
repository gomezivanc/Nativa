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
import MultiSelectG from "../../../../components/Globals/MultiSelect";
import { InputTextarea } from "primereact/inputtextarea";

export const Reassing = ({  defaultVals = {}, onFinish,filings }) => {
    const { translations, current_language } = usePage()?.props;
    const {
        register,
        handleSubmit,        
        formState: { errors },
        setValue,
        control, watch
    } = useForm({
        defaultValues: defaultVals,
    });
    const [dependencies, setDependencies] = useState([]);
    const [dependenciesMail, setDependenciesEmail] = useState([]);
    const [users, setUsers] = useState([]);
    const [usersCopy, setUsersCopy] = useState([]);
    const dependency_id = watch("dependency_id");
    const dependency_id_copy = watch("dependency_id_copy");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDependencies();
    }, []);

    useEffect(() => {
        getUsers();
    }, [dependency_id]);

    useEffect(() => {
        setValue('official_id_copy',null);
        getUserCopy();
    }, [dependency_id_copy]);
     

    async function getDependencies() {
        const res = await axios.get(route("dependencies.list"), {
            params: {
                typeData: 'todos',
                only_unit_admin: true
            }
        });
        setDependencies(res.data);
        setDependenciesEmail(res.data);
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
    async function getUserCopy() {
        if (!dependency_id_copy) {
            return;
        }
        const res = await axios.get(route("usuarios.getUsers"), {
            params: {
                by_dependency: dependency_id_copy
            }
        });
        setUsersCopy(res.data);
    }

    async function submit(data) {
        setLoading(true);
        
        data.filing_ids = filings.map(filing => filing.id);
        // Agregar los correos al objeto `data`       
        
        try {
            const res = await axios.post(route("mass-reasing.reassing-massive"), data);
            if (res.data.success) {
                // Formatea los datos para mostrarlos en el toast
                const mailList = res.data.mails.map((mail) => (
                    `<li key="${mail.filing_number}">
                        <strong>${mail.filing_number}</strong>: ${mail.email}
                    </li>`
                )).join("");
    
                // Mostrar el toast con la lista HTML
                toast.success(
                    <div>
                        <p>{translations.auth.mail_sent}:</p>
                        <ul dangerouslySetInnerHTML={{ __html: mailList }} />
                    </div>,
                    {
                        autoClose: 5000, // Cierra el toast después de 5 segundos
                        closeButton: true, // Muestra el botón de cerrar
                    }
                );    
                onFinish();  // Finaliza el proceso
            } else {
                // Muestra un mensaje de error si no fue exitoso
                toast.error(res.data.message || translations.auth.error);
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

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end"
        >      
            <h3 className="flex flex-col md:col-span-6">{translations.filing.standard_filing.reassign }</h3>
            <span className="flex flex-col md:col-span-3">
                <label htmlFor="dependency_id">{translations.filing.standard_filing.form.target_dependency}</label>
                <Controller
                    name="dependency_id"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
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
                <label htmlFor="official_id">{translations.filing.standard_filing.form.target_user}</label>                
                <Controller
                    name="official_id"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown  options={users} optionLabel={i => `${i.persona.nombre} ${(i.persona.apellido) ? i.persona.apellido : ''}`} optionValue='id' filter
                                value={field.value}
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
            <hr className="md:col-span-6" />
            <h3 className="md:col-span-6">{translations.filing.standard_filing.copy_to} :</h3>
            <span className="flex flex-col md:col-span-3">
                <label htmlFor="dependency_id_copy">{translations.filing.standard_filing.form.dependency}</label>
                <Controller
                    name="dependency_id_copy"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={dependenciesMail} optionLabel='name' optionValue='id' filter
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
                <label htmlFor="official_id_copy">{translations.filing.standard_filing.form.official}</label>                              
                <MultiSelectG control={control} name={'official_id_copy'} rules={{ required: translations.validation.attributes.field_required }} options={usersCopy} optionValue={'email'} optionLabel={i => `${i.persona.nombre} ${(i.persona.apellido) ? i.persona.apellido : ''}`}/>
                {errors?.subject && (
                    <span className="text-red-600">{errors.official_id_copy?.message}</span>
                )} 
            </span>          
            <span className="flex flex-col  md:col-span-6">
                <label htmlFor="observation">{translations.filing.standard_filing.form.observation}</label>                              
                <InputTextarea rows={5}  { ...register("observation",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.observation,'w-full':true }} />
                {errors?.subject && (
                    <span className="text-red-600">{errors.observation?.message}</span>
                )}                
            </span>          

            <div className="md:col-span-6 text-end">
                <Button loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
            </div>
        </form>
    );
};