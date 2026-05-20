
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputSwitch } from 'primereact/inputswitch'
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, translations, users }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const [dependencies,setDependencies] = useState([])
    const { setIsLoading } = useLoading();


    const dep_id = watch("dep_id");
    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getDependencies()
    },[])

    async function submit(data) {
        setIsLoading(true);

        try {
            const res = await axios.post(route("users-group.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("users-group.index"))
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

    async function getDependencies() {
        const res = await axios.get(route('dependencies.list'), {
            params: {
                typeData: "a"
            }
        })
        setDependencies(res.data)
    }

    async function getItem(id) {
        const res = await axios.get(route("users-group.show",id))
        for (const key in res.data) {
            if(key == 'users') {
                setValue(key,res.data[key].map(i => i.user_id));
            } else if(key == 'dependencies') {
                setValue(key,res.data[key].map(i => i.dependency_id));
            } else {
                if (res.data.hasOwnProperty(key)) {
                    setValue(key, res.data[key]);
                }
            }
        }
    }

    return (
        <div>
            <div>
                <Card header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("users-group.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.users_group.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.users_group.form.name }</label>
                            <InputText maxLength={255} { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.users_group.form.g_d_dependency_id }</label>
                            <Controller
                                name="dependencies"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <MultiSelect display='chip' options={dependencies} optionLabel={ i => `${i.code}: ${i.name}`} optionValue='id' filter
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
                        <span className="flex flex-col ">
                            <label htmlFor="username">{ translations.configuration.users_group.form.users_group }</label>
                            <Controller
                                name="users"
                                control={control}
                                rules={{ validate: value => (Array.isArray(value) && value.length > 0) || translations.validation.attributes.field_min_one_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <MultiSelect display='chip' options={users} optionLabel="persona.nombre" optionValue='id' filter
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
                            <Button label={ translations.configuration.users_group.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
