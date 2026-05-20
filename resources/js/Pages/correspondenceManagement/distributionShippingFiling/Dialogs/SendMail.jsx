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
import { InputTextarea } from "primereact/inputtextarea";
import Upload from "../../../../components/Upload";
import { router } from '@inertiajs/react';

export const SendMail = ({  defaultVals = {}, onFinish,dataFiling,servicesToAdd ,onSuccess }) => {
    const { translations, current_language } = usePage()?.props;
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control, reset, setError, clearErrors, watch
    } = useForm({
        defaultValues: defaultVals,
    });
    const [emails, setEmails] = useState([]);
    const [regional, setRegional] = useState([]);
    const [confProviderSend, setConfProviderSend] = useState([]);

    const regional_id = watch("regional_id");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getReginal();
    }, []);

    useEffect(() => {
        getProviders();
    }, [regional_id]);

    // Validación de correo electrónico
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const addEmail = () => {
        const email = control._formValues.email?.trim(); // Obtiene el valor del campo de entrada

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
        setValue('email','');  // Limpia el campo de entrada
        clearErrors("email"); // Limpia los errores
    };

    // Eliminar un correo
    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    async function getReginal() {
        const res = await axios.get(route("regional.list"), {
            params: {
                typeData: 'todos'
               
            }
        });
        setRegional(res.data);
    }

    async function getProviders() {
        if (!regional_id) {
            return;
        }
        const res = await axios.get(route("provider.list"), {
            params: {
                typeData: 'todos',
                regional_id: regional_id
            }
        });

        setConfProviderSend(res.data);
    }    


    async function submit(data) {
        setLoading(true);
        data.filing = dataFiling;    
        // Agregar los correos al objeto `data`
        data.emails = emails;
        data.shipping_receipt = getValues('shipping_receipt');
        
        try {
            const res = await axios.post(route("distributionshipping.send-shipping-mail"), data);

            if (res.data?.success === true) {
                toast.success(res.data.message);
                setTimeout(() => {
                    router.visit(route('distributionshipping.index'));
                }, 100);
                // onFinish();
                return;
            }
            toast.error(res.data.message || translations.auth.error);

        } catch (error) {
            console.log('ERROR:', error); // DEBUG

            const mensaje =
                error?.response?.data?.error ||
                translations.auth.error;

            toast.error(mensaje);
        }
    }
    

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end"
        >
            
            <span className="flex flex-col md:col-span-3">
                <label htmlFor="regional_id">{translations.correspondence_management.distribution_shipping.form.regional}</label>
                <Controller
                    name="regional_id"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={regional} optionLabel='name' optionValue='id' filter
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                placeholder={translations.correspondence_management.distribution_shipping.form.regional}
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
                <label htmlFor="conf_provider_send_id">{translations.correspondence_management.distribution_shipping.form.provider}</label>                
                <Controller
                    name="conf_provider_send_id"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown filter options={confProviderSend} 
                                optionLabel='name'
                                optionValue='id'
                                value={field.value}
                                display="chip"
                                onChange={(e) => field.onChange(e.value)}
                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                placeholder={translations.correspondence_management.distribution_shipping.form.provider}
                            />
                            {
                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
                        </>

                    )}
                />
            </span>
            <span className="flex flex-col  md:col-span-3">
                <label htmlFor="conf_services_provider_id">{translations.correspondence_management.distribution_shipping.form.active_service}</label>                
                <Controller
                    name="conf_services_provider_id"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown filter 
                                options={Array.isArray(servicesToAdd) ? servicesToAdd : servicesToAdd?.servicesToAdd} 
                                optionLabel='name'
                                optionValue='id'
                                value={field.value}
                                display="chip"
                                onChange={(e) => field.onChange(e.value)}
                                className={{ 'p-invalid': fieldState.error, 'w-full ': true }}
                                placeholder={translations.correspondence_management.distribution_shipping.form.active_service}
                            />
                            {
                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
                        </>

                    )}
                />
            </span>
            <span className="flex flex-col md:col-span-3">
                <label htmlFor="tracking_number">{ translations.correspondence_management.distribution_shipping.form.tracking_number }</label>
                <InputText placeholder={ translations.correspondence_management.distribution_shipping.form.tracking_number } 
                type='text' { ...register("tracking_number",{ required: translations.validation.attributes.field_required }) } 
                className={{ 'p-invalid': errors?.tracking_number,'w-full':true }} />
                {errors?.tracking_number && (
                    <span className="text-red-600">{errors.tracking_number?.message}</span>
                )}
            </span>
            <span className="flex flex-col md:col-span-6">
                <label htmlFor="observation">{ translations.correspondence_management.distribution_shipping.form.observation }</label>
                <InputTextarea rows={7}  placeholder={ translations.correspondence_management.distribution_shipping.form.observation } 
                type='text' { ...register("observatio_send",{ required: translations.validation.attributes.field_required }) } 
                className={{ 'p-invalid': errors?.observatio_send,'w-full':true }} />
                {errors?.observatio_send && (
                    <span className="text-red-600">{errors.observatio_send?.message}</span>
                )}
            </span>
            <span className="flex flex-col md:col-span-6">
                <label htmlFor="shipping_receipt">{ translations.correspondence_management.distribution_shipping.form.shipping_receipt }</label>
                <Upload limitDocs={1} allowedFiles=".pdf" onChangeDocs={(e) => { setValue('shipping_receipt',e) }}/>
                {errors?.shipping_receipt && (
                    <span className="text-red-600">{errors.shipping_receipt?.message}</span>
                )}
            </span>
            
            {/* <Controller
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
                            className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                            placeholder={translations.filing.standard_filing.enter_email}
                        />
                        {fieldState.error && (
                            <small className="p-error">{fieldState.error.message}</small>
                        )}
                    </span>
                )}
            />
            {/* Botón para agregar correos */}
            {/* <div className="md:col-span-1 flex gap-2">
                <Button
                    label={translations.auth.users.table_apps.add}
                    className="col-span-2"
                    size="small"
                    type="button"
                    onClick={addEmail} // Agrega el correo al hacer clic
                />
            </div> */}

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

            <div className="md:col-span-6 text-end">
                <Button  loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
            </div>
        </form>
    );
};