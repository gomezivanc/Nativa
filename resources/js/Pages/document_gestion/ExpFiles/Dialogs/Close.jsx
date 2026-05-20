import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function Close({ items, onFinish }) {
    const { translations, typeAnex, current_language } = usePage().props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, setError } = useForm()

    const [loading,setLoading] = useState(false)

    async function submit(data) {
        setLoading(true)
        try {
            data.ids = items.map(i => i.id)
            if(data.ids.length == 1) {
                const res = await axios.post(route('files-exp.close'),data,{
                    responseType: 'blob',
                })

                // Crear un enlace para descargar el archivo
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;

                // Configurar el nombre del archivo
                const contentDisposition = res.headers['content-disposition'];
                let fileName = 'archivo.pdf';
                if (contentDisposition) {
                    const matches = /filename="([^"]+)"/.exec(contentDisposition);
                    if (matches && matches[1]) fileName = matches[1];
                }

                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();

            } else {
                const res = await axios.post(route('files-exp.close'),data)
            }
            toast.success(translations.auth.success)
            onFinish()
        } catch (error) {
            if(error.response.status == 422) {
                toast.error(translations.documental_gestion.exp_files.dialogs.close_form.message_error_login)
            } else {
                toast.error(translations.auth.error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="grid grid-cols-1 gap-2" onSubmit={handleSubmit(submit)}>
            <span className="flex flex-col">
                <label htmlFor="username">
                    { translations.documental_gestion.exp_files.dialogs.close_form.observation }
                </label>
                <InputTextarea
                    {...register("close_observation", {
                        required:
                            translations.validation.attributes.field_required,
                    })}
                    className={{ "p-invalid": errors?.observation, "w-full": true }}
                />
                {errors?.observation && (
                    <span className="text-red-600">{errors.observation?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    { translations.documental_gestion.exp_files.dialogs.close_form.password }
                </label>
                <InputText type="password"
                    {...register("password", {
                        required:
                            translations.validation.attributes.field_required,
                    })}
                    className={{ "p-invalid": errors?.password, "w-full": true }}
                />
                {errors?.password && (
                    <span className="text-red-600">{errors.password?.message}</span>
                )}
            </span>
            <div className="text-end">
                <Button loading={loading} label={ translations.documental_gestion.exp_files.save } className='col-span-2' size='small'/>
            </div>
        </form>
    );
}
