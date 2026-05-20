import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { exportBase64 } from "../../../../hooks/converBase64";
import { AutoComplete } from "primereact/autocomplete";
import { router } from '@inertiajs/react';

export function Attach({ items ,typeDocs,onFinish }) {
    const { translations, expFilesTypeDocs ,current_language } = usePage().props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch } = useForm()
    const { fields, append, remove, insert,replace } = useFieldArray({
        control,
        name: "filesList"
    })

    useEffect(() => {
        insert({})
    }, [])

    const [loading,setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([]);

    async function submit(data) {

        data.id = items[0].id;

        let error = false;
        let errors = [];
        for (let i = 0; i < data.filesList.length; i++) {
            const f = data.filesList[i];
            if(f.file[0].type !== 'application/pdf') {
                errors.push( i + 1 +': '+ translations.documental_gestion.exp_files.dialogs.charge_docs.error_format_file);
                error = true;
                continue;
            }
            const { file, base64, base64Only } = await exportBase64(f.file[0]);
            data.filesList[i].file = base64Only;
            data.filesList[i].file_detail = file;
        }
        if(error) {
            toast.error(errors.join(', '));
            return
        }
        setLoading(true);
        try {
            const res = await axios.post(
                route('charge.storeAcuse'),
                {
                    ...data,
                    type: 'acuse',
                    id: items[0].id
                }
            );
            toast.success(translations.auth.success);
            setTimeout(() => {
                router.visit(route('accusation.indexAcus'));
            }, 50);
        } catch (error) {
            if(error.response.status == 422) {
                toast.error(translations.auth.error);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setLoading(false);
        }
    }

    function addFile() {
        append({})
    }

    return (
        <form className="grid md:grid-cols-1 gap-4 p-5" onSubmit={handleSubmit(submit)}>
            {
                fields.map((f,index) =>
                    <Card key={f.id} >
                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {translations.documental_gestion.exp_files.dialogs.charge_docs.date}
                            </label>
                            <InputText type="datetime-local"
                                {...register(`filesList.${index}.date_acuse`, {
                                    required:
                                        translations.validation.attributes.field_required,
                                })}
                                className={{ "p-invalid": errors?.date, "w-full": true }}
                            />
                            {errors?.date && (
                                <span className="text-red-600">{errors.date?.message}</span>
                            )}
                        </span>
                    
                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {translations.documental_gestion.exp_files.dialogs.charge_docs.description}
                            </label>
                            <InputTextarea
                                {...register(`filesList.${index}.description`, {
                                    required:
                                        translations.validation.attributes.field_required,
                                })}
                                className={{ "p-invalid": errors?.description, "w-full": true }}
                            />
                            {errors?.description && (
                                <span className="text-red-600">{errors.description?.message}</span>
                            )}
                        </span>

                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {translations.documental_gestion.exp_files.dialogs.charge_docs.file}
                            </label>
                            <InputText type="file" {...register(`filesList.${index}.file`,{ required: translations.validation.attributes.field_required }) }/>
                        </span>
                        {
                            index !== 0 &&
                            <div className="text-end mt-4">
                                <Button loading={loading} severity="danger" type="button" onClick={() => remove(index)} icon="pi pi-trash" className='col-span-2' size='small'/>
                            </div>
                        }
                    </Card>
                )
            }
            <div className="text-end">
                <Button loading={loading} label={ translations.documental_gestion.exp_files.save } className='col-span-2' size='small'/>
            </div>
        </form>
    );
}
