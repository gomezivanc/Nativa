
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { useForm } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { FileUpload } from 'primereact/fileupload'

export default function Index({ id }) {
    const { translations } = usePage()?.props

    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue} = useForm()

    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    async function submit(data) {
        try {
            const res = await axios.post(route("manual-usuario.store"),data)
            toast.success("Guardado con exito")
            router.visit(route("manual-usuario.index"))
        } catch (error) {
            toast.error("Ups... ocurrio un error")
        }
    }

    const customBase64Uploader = async (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
            const base64data = reader.result;
            setValue('data',base64data)
        };
        setValue('filename',file.name)
    };

    async function getItem(id) {
        const res = await axios.get(route("manual-usuario.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    return (
        <div>
      <div className="md:px-20">
        <Card header={
          <div className="p-5 flex gap-1 flex-col">
            <h1 className="text-xl font-bold">{translations.menu.user_manual.form.header}</h1>
            <Link href="/utilities/manual-usuario">
              <Button label={translations.menu.user_manual.form.back_button} size="small" />
            </Link>
          </div>
        }>
          <form onSubmit={handleSubmit(submit)} className="gap-2 grid md:grid-cols-2">
            <span className="flex flex-col">
              <label htmlFor="username">{translations.menu.user_manual.form.manual_name_label}</label>
              <InputText
                {...register("nombre", { required: translations.menu.user_manual.form.manual_name_required })}
                className={{ 'p-invalid': errors?.nombre, 'w-full': true }}
              />
            </span>
            <span className="flex flex-col">
              <label className="font-bold" htmlFor="username">{translations.menu.user_manual.form.file_label}</label>
              <FileUpload
                mode="basic"
                name="demo[]"
                url=""
                onSelect={customBase64Uploader}
                accept="application/pdf"
                chooseLabel={translations.menu.user_manual.form.file_choose_button}
                customUpload
              />
            </span>
            {errors?.nombre && <span className="text-red-600 w-full">{errors?.nombre?.message}</span>}
            <Button label={translations.menu.user_manual.form.create_button} size="small" />
          </form>
        </Card>
      </div>
    </div>
    )
}