
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
import { InputText } from 'primereact/inputtext'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();

    const days = [
        { label: translations.auth.day_of_weeks.monday , value: "1" },
        { label: translations.auth.day_of_weeks.tuesday , value: "2" },
        { label: translations.auth.day_of_weeks.wednesday , value: "3" },
        { label: translations.auth.day_of_weeks.thursday , value: "4" },
        { label: translations.auth.day_of_weeks.friday , value: "5" },
        { label: translations.auth.day_of_weeks.saturday , value: "6" },
        { label: translations.auth.day_of_weeks.sunday , value: "7" },
    ]

    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("hours-work.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("hours-work.index"))
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
        const res = await axios.get(route("hours-work.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("hours-work.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.hours_work.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.hours_work.form.day_of_week_init }</label>
                            <Controller
                                name="day_of_week_init"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={days} optionLabel='label' optionValue='value' filter
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
                            <label htmlFor="username">{ translations.configuration.hours_work.form.day_of_week_end }</label>
                            <Controller
                                name="day_of_week_end"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={days} optionLabel='label' optionValue='value' filter
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
                            <label htmlFor="username">{ translations.configuration.hours_work.form.init_work_hour }</label>
                            <InputText type="time" { ...register("init_work_hour",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.init_work_hour,'w-full':true }} />
                            {errors?.init_work_hour && (
                                <span className="text-red-600">{errors.init_work_hour?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.hours_work.form.end_work_hour }</label>
                            <InputText type="time" { ...register("end_work_hour",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.end_work_hour,'w-full':true }} />
                            {errors?.end_work_hour && (
                                <span className="text-red-600">{errors.end_work_hour?.message}</span>
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
