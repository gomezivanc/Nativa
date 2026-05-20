
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();


    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getTypeDocuments()
        getDependencies()
    },[])

    const [typeDocuments,setTypeDocuments] = useState([])
    const [dependencies,setDependencies] = useState([])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("user-interoperability.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("user-interoperability.index"))
        } catch (error) {
            if(error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error)
            }
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("user-interoperability.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }
    async function getTypeDocuments() {
        const res = await axios.get('/tipoDocumento')
        setTypeDocuments(res.data.tipoDocumentos)
    }
    async function getDependencies() {
        const res = await axios.get(route('dependencies.list'))
        setDependencies(res.data.data)
    }

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("user-interoperability.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.user_interoperability.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.email }</label>
                            <InputText { ...register("email",{ required: translations.validation.attributes.field_required,pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Formato de correo electrónico inválido.",
                            }, })} className={{ 'p-invalid': errors?.email,'w-full':true }} />
                            {errors?.email && (
                                <span className="text-red-600">{errors.email?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.document }</label>
                            <InputText type='number' { ...register("document")} className={{ 'p-invalid': errors?.document,'w-full':true }} />
                            {errors?.document && (
                                <span className="text-red-600">{errors.document?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.type_document_id }</label>
                            <Controller
                                name="type_document_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={typeDocuments} optionLabel='nombre' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.configuration.user_interoperability.form.dependency_id }</label>
                            <Controller
                                name="dependency_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={dependencies} optionLabel={i => `${i.code}: ${i.name}`} optionValue='id' filter
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
                        <div className="md:col-span-3">
                            <Button label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
