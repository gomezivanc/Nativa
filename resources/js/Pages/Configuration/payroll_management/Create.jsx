
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import Upload from '../../../components/Upload'
import { InputText } from 'primereact/inputtext'
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
    },[])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("payroll-management.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("payroll-management.index"))
        } catch (error) {
            console.log(error);

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
        const res = await axios.get(route("payroll-management.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    function fileChange(e) {
        if(e.length > 0) {
            setValue('file', e[0]?.data);
            setValue('filename', e[0]?.name);
        }
    }

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("payroll-management.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 items-end'
                    >
                        <h2 className=' font-bold'>{ translations.configuration.payroll_management.title }</h2>
                        <hr className='' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.payroll_management.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.payroll_management.form.file }</label>
                            <Upload onChangeDocs={fileChange} limitDocs={1} allowedFiles='.doc,.docx' />
                        </span>

                        <div className="">
                            <Button label={ translations.configuration.payroll_management.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
