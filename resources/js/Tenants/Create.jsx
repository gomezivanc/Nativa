
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm } from 'react-hook-form'
import { Link, usePage, router } from '@inertiajs/react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload'
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'

export default function Index({ id }) {
    const { translations } = usePage()?.props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control} = useForm()

    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    const apps = [
        { 
            id: 1,
            name: import.meta.env.VITE_APP1,
            url: import.meta.env.VITE_DOMAIN_APP_1,
            dir: import.meta.env.VITE_PROJECT_DIR
        },
    ]


    async function submit(data) {
        try {
            toast.loading("Guardando...");
            data.app = apps.find(app => app.id == data.app_id);

            await router.post(route("aplicativos.store"), data, {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success("Guardado con éxito");
                    router.visit(route("aplicativos.index")); // Opcional si necesitas redirigir
                },
                onError: (errors) => {
                    toast.dismiss();
                    toast.error("Ups... ocurrió un error.");
                }
            });
        } catch (error) {
            toast.dismiss();
            toast.error("Error inesperado, por favor intenta de nuevo.");
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
        const res = await axios.get(route("aplicativos.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
        setChecked(res.data.activo)
    }
    const [checked,setChecked] = useState()

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        {/* <h1 className='text-xl font-bold'>Crear una aplicacion</h1> */}
                        <div>
                            <Link href={route("aplicativos.index")}>
                                <Button label={ translations.auth.tenants.back } size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid  md:grid-cols-3 gap-2 items-end'
                    >
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.auth.tenants.form.name }</label>
                            <InputText { ...register("nombre",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.nombre,'w-full':true }} />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.auth.tenants.form.sub_domain }</label>
                            <InputText { ...register("domain",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.domain,'w-full':true }} />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.auth.tenants.form.app }</label>
                            <Controller
                                name="app_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={apps} optionLabel='name' optionValue='id'
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                        />
                                        {
                                            fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>
                        {/* <span className="flex flex-col">
                            <label htmlFor="username">Dominio aplicación</label>
                            <InputText { ...register("domain_true",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.project_dir,'w-full':true }} />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">Carpeta proyecto</label>
                            <InputText { ...register("project_dir",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.project_dir,'w-full':true }} />
                        </span> */}
                        <span className="flex flex-col md:col-span-3">
                            <label className="font-bold" htmlFor="username">Logo</label>
                            <FileUpload name="demo[]" accept="application/image" auto chooseLabel={ translations.auth.tenants.form.select } customUpload uploadHandler={customBase64Uploader} />
                        </span>
                        {
                            errors?.nombre && <span className="text-red-600 w-full">{errors?.nombre?.message}</span>
                        }
                        <div className='md:col-span-3'>
                            <Button label={ translations.auth.tenants.form.create } size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
