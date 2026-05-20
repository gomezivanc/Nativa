
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { InputSwitch } from 'primereact/inputswitch'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from '../../Context/preloadContext'


export default function Index({ id, translations }) {
    const { 
        watch,
        register,
        handleSubmit,
        control,
        getValues,
        formState: {errors,},
        setValue} = useForm({
        defaultValues: {
            serie_bool: 0
        }
    });
    const { setIsLoading } = useLoading();
    const serie_bool = watch("serie_bool");
    const [typeFiling,setTypeFiling] = useState([])
    useEffect(() => {
        getTypeFiling()
        if(id) {
            getItem(id)
        }
    },[])

    async function getTypeFiling() {
        const res = await axios.get(route("types-filings.list"),{
            params:{
                typeData: 'todos'
            }
        })
        setTypeFiling(res.data)
    }

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("roles.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("roles.index"))
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
        const res = await axios.get(route("roles.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
        // Si tiene type_filing_id, establecer serie_bool a 1
        if (res.data.type_filing_id) {
            setValue("serie_bool", 1);
        }
    }

    return (
        <div>
            <div>
                <Card header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("roles.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-2 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.administration.role.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.administration.role.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.administration.role.form.description }</label>
                            <InputText maxLength={20} { ...register("description",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.sigla,'w-full':true }} />
                            {errors?.name_module && (
                                <span className="text-red-600">{errors.name_module?.message}</span>
                            )}
                        </span>

                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="username">{ 'Crea Radicados' }</label>
                            <Controller
                                name="serie_bool"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputSwitch  trueValue={1} falseValue={0}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={`${fieldState.error ? 'p-invalid' : ''}`}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>
                                )}
                            />
                        </span>
                        {
                        serie_bool == 1 && 
                            <>
                                <span className="flex flex-col">
                                    <label htmlFor="typeFiling">{ translations.filing.standard_filing.form.types_filing }</label>
                                    <Controller
                                        name="type_filing_id"
                                        control={control}
                                        rules={{ required: translations.validation.attributes.field_required }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Dropdown  options={typeFiling} optionLabel='name' optionValue='id'
                                                    value={field.value}
                                                    filter
                                                    placeholder={ translations.filing.standard_filing.form.types_filing }
                                                    onChange={(e) => field.onChange(e.value)}
                                                    className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                                                />
                                                {
                                                    fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                }
                                            </>

                                        )}
                                    />
                                </span>
                            </>
                        }
                        <div className="md:col-span-3">
                            <Button label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
