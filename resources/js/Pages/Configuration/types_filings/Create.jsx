
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"
import { InputTextarea } from 'primereact/inputtextarea'

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();


    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("types-filings.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("types-filings.index"))
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
        const res = await axios.get(route("types-filings.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    return (
        <div>
            <div>
                <Card header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("types-filings.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-start'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.types_of_filings.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="code">{ translations.configuration.types_of_filings.form.code }</label>
                            <InputText maxLength={5} { ...register("code",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.code,'w-full':true }} />
                            {errors?.code && (
                                <span className="text-red-600">{errors.code?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col md:grid-cols-2">
                            <label htmlFor="name">{ translations.configuration.types_of_filings.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3'">
                            <label htmlFor="name">{ translations.configuration.types_of_filings.form.description }</label>
                            <InputTextarea { ...register("description",{ required: translations.validation.attributes.field_required }) }  className={{ 'p-invalid': errors?.name,'w-full':true }} placeholder={ translations.configuration.types_of_filings.form.description } rows={5} cols={30} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
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
