
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
import { useLoading } from '../../Context/preloadContext'

export default function Index({ id, translations, menu }) {
    const { control,watch, register,handleSubmit,getValues,formState: {
        errors,
    },setValue} = useForm()

    const { setIsLoading } = useLoading();


    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])
    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("permisos.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("permisos.index"))
        } catch (error) {
            if(error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error)
            }
        }finally{
            setTimeout(()=>{
                setIsLoading(false);
            },1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("permisos.show",id))
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
                            <Link href={route("permisos.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-2 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.administration.permission.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.administration.permission.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>

                        <span className="flex flex-col">
                            <label htmlFor="id_menu">{ translations.administration.permission.form.menu }</label>
                            <Controller
                                name="id_menu"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={menu}
                                            optionLabel="title"
                                            optionValue="id"
                                            filter
                                            value={field.value}
                                            placeholder={translations.administration.permission.form.menu}
                                            onChange={(e) => {
                                                field.onChange(e.value);

                                                const selectedMenu = menu.find(m => m.id === e.value);

                                                if (selectedMenu) {
                                                    const moduleKey = selectedMenu.title.split('.')[0];

                                                    const moduleName = translations.menu?.[moduleKey]?.[moduleKey] || moduleKey;

                                                    setValue('name_module', moduleName);
                                                }
                                            }}
                                            className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                        />
                                    </>
                                )}
                            />
                        </span>

                        <span className="flex flex-col md:col-span-2">
                            <label>{ translations.administration.permission.form.name_module }</label>
                            <InputText
                                value={watch("name_module") || ""}
                                readOnly
                                className="w-full"
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
