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
import { router } from '@inertiajs/react';

export const SendMailOf = ({ tableDocument, defaultVals = {}, onFinish,dataFiling }) => {
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

        data.filing = dataFiling;
        data.emails = emails;
        data.documents = selectedItem;

        try {
            const res = await axios.post(route("filing.send-official-mail"), data);

            if (res.data.success) {
                toast.success(`${translations.auth.mail_sent}`);

                setTimeout(() => {
                    router.visit(route('filingOfficial.index'));
                }, 500); 
            } else {
                toast.error(res.data.message || translations.auth.error);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || translations.auth.error
            );
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    if(tableDocument) {
        tableDocument = tableDocument.map(item => {
            if (item.file_detail && typeof item.file_detail === 'string') {
                try {
                    item.file_detail = JSON.parse(item.file_detail);
                } catch (error) {
                    console.error("Error parsing file_detail:", error);
                    item.file_detail = {}; // Asigna un valor por defecto en caso de error
                }
            }
            return item;
        });
    }


    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end"
        >
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

            <span className="flex flex-col md:col-span-3">
                <label htmlFor="dependency_id">{translations.filing.standard_filing.form.dependency}</label>
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
                <label htmlFor="official_id">{translations.filing.standard_filing.form.official}</label>                
                <Controller
                    name="send_to"
                    control={control}
                    rules={{ required: translations.validation.attributes.field_required }}
                    render={({ field, fieldState }) => (
                        <>
                            <MultiSelect
                            filter
                            multiple
                            options={users}
                            optionLabel={(i) =>
                                `${i.persona.nombre} ${i.persona.apellido ?? ""}`
                            }
                            value={field.value}
                            display="chip"
                            onChange={(e) => field.onChange(e.value)}
                            className={`w-full ${fieldState.error ? "p-invalid" : ""}`}
                            placeholder={translations.filing.standard_filing.form.official}
                            />
                            {
                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                            }
                        </>

                    )}
                />
            </span>

            <span className="flex flex-col  md:col-span-6">
                <label htmlFor="ejemplo">
                    {translations.documental_gestion.exp_files.dialogs.charge_docs.description}
                </label>

                <InputTextarea
                    {...register("observation")}
                    className={`w-full ${errors?.ejemplo ? "p-invalid" : ""}`}
                    rows={4}
                />
            </span>

            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.auth.state_table}
                </label>
                <Controller
                    name="active"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex items-center gap-2">
                            <InputSwitch
                                trueValue={1}
                                falseValue={0}
                                checked={field.value}
                                onChange={field.onChange}
                            />
                            <span>
                                {field.value
                                    ? 'Pasar copia'
                                    : 'Pasar completo'}
                            </span>
                        </div>
                    )}
                />
            </span>

            <div className="md:col-span-6 text-end">
                <Button loading={loading} label={translations.documental_gestion.exp_files.save} className='col-span-2' size='small' />
            </div>
        </form>
    );
};