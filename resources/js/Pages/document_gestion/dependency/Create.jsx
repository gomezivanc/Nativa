
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, dependencies, translations }) {

    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const [regional,setSelectRegional] = useState([])
    const { setIsLoading } = useLoading();

    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getRegionals()
    },[])


    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("dependencies.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("dependencies.index"))
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

    async function getRegionals() {
        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setSelectRegional(res.data)
    }

    async function getItem(id) {
        const res = await axios.get(route("dependencies.show",id))
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
                            <Link href={route("dependencies.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.documental_gestion.dependency.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.dependency.form.code }</label>
                            <InputText type='number' maxLength={5} { ...register("code",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.code,'w-full':true }} />
                            {errors?.code && (
                                <span className="text-red-600">{errors.code?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.dependency.form.name }</label>
                            <InputText maxLength={255} { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.documental_gestion.dependency.form.g_d_parent_id }</label>
                            <Controller
                                name="g_d_parent_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={dependencies} optionLabel={ i => `${i.code}: ${i.name}`} optionValue='id' filter
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
                            <label htmlFor="username">{ translations.documental_gestion.dependency.form.regional }</label>
                            <Controller
                                name="regional_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={regional} optionLabel='name' optionValue='id' filter
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
