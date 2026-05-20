import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function Reference({ items, onFinish }) {
    const { translations, typeAnex, current_language } = usePage().props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()

    const [loading,setLoading] = useState(false)

    async function submit(data) {
        setLoading(true)
        try {
            data.ids = items.map(i => i.id)
            const res = await axios.post(route('exp-files-referencecrusade.store'),data)
            toast.success(translations.auth.success)
            onFinish()
        } catch (error) {
            toast.error(translations.auth.error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="grid md:grid-cols-3 gap-2" onSubmit={handleSubmit(submit)}>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.documental_gestion.exp_files.dialogs.reference_form.name_middle}
                </label>
                <InputText
                    {...register("name_middle", {
                        required:
                            translations.validation.attributes.field_required,
                    })}
                    className={{ "p-invalid": errors?.name_middle, "w-full": true }}
                />
                {errors?.name_middle && (
                    <span className="text-red-600">{errors.name_middle?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.documental_gestion.exp_files.dialogs.reference_form.quantity}
                </label>
                <InputText
                    type="number"
                    {...register("quantity", {
                        required:
                            translations.validation.attributes.field_required,
                    })}
                    className={{ "p-invalid": errors?.quantity, "w-full": true }}
                />
                {errors?.quantity && (
                    <span className="text-red-600">{errors.quantity?.message}</span>
                )}
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.documental_gestion.exp_files.dialogs.reference_form.anex}
                </label>
                <Controller
                    name="anex"
                    control={control}
                    rules={{
                        required:
                            translations.validation.attributes.field_required,
                    }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown options={typeAnex} optionValue="id" optionLabel={i => i['name_'+current_language]}
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
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.documental_gestion.exp_files.dialogs.reference_form.ubication}
                </label>
                <InputText

                    {...register("ubication", {
                        required:
                            translations.validation.attributes.field_required,
                    })}
                    className={{ "p-invalid": errors?.ubication, "w-full": true }}
                />
                {errors?.ubication && (
                    <span className="text-red-600">{errors.ubication?.message}</span>
                )}
            </span>
            <div className="md:col-span-3 text-end">
                <Button loading={loading} label={ translations.documental_gestion.exp_files.save } className='col-span-2' size='small'/>
            </div>
        </form>
    );
}
