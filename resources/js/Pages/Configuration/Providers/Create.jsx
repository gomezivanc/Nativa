
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

export default function Index({ id, services, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const [departaments,setSelectDepartaments] = useState([])
    const { setIsLoading } = useLoading();


    const regional_id = watch("regional_id");
    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getDepartaments()
    },[])

    async function submit(data) {
        setIsLoading(true);

        try {
            const res = await axios.post(route("provider.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("provider.index"))
        } catch (error) {
            toast.error(translations.auth.error)
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getDepartaments() {

        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos',
            }
        })
        setSelectDepartaments(res.data)
    }

    async function getItem(id) {
        const res = await axios.get(route("provider.show",id))
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
                            <Link href={route("provider.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.provider.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.provider.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                    <span className="text-red-600">{errors.name?.message}</span>
                                )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.provider.form.conf_services_provider_id }</label>
                            <Controller
                                name="conf_services_provider_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={services} optionLabel='name' optionValue='id' filter
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
                            <label htmlFor="username">{ translations.configuration.provider.form.regional_id }</label>
                            <Controller
                                name="regional_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown options={departaments} optionLabel='name' optionValue='id' filter
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
                            <Button label={ translations.configuration.trd.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
