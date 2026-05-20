
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
import { Inputnumber } from '../../../components/Globals/InputNumber'

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();
    const [getFillingStructure,setFillingStructure] = useState();


    useEffect(() => {
        if(id) {
            getItem(id)
        }
        getStructure();
    },[])

    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("filling-setting.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("filling-setting.index"))
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error); // Muestra el error exacto del backend
                router.visit(route("filling-setting.index"))
            } else {
                toast.error(translations.auth.error); // Mensaje genérico si no hay error específico
            }
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("filling-setting.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }

    async function getStructure() {
        try {
            const res = await axios.get(route("filling-structure.list"), {
                params: {
                    typeData: "todos",
                },
            });
            setFillingStructure(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
    }


    return (
        <div>
            <div>
                <Card header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("filling-setting.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 lg:grid-cols-3 items-end'
                    >
                        <h2 className='lg:col-span-3 font-bold'>{ translations.configuration.filling_setting.title }</h2>
                        <hr className='lg:col-span-3' />
                        <span className="flex flex-col w-full">
                            <label htmlFor="dependency_length">{ translations.configuration.filling_setting.form.dependency_length }</label>
                            <Inputnumber control={control} name="dependency_length" errors={errors} rules={{ required: translations.validation.attributes.field_required,
                                validate: (value) =>
                                value?.toString().length <= 2 || translations.auth.max_length + ' 2'
                            }} useGrouping={false}/>
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="filling_structure">{ translations.configuration.filling_setting.form.filling_structure }</label>
                            <Controller
                                name="filling_structure_id"
                                control={control}
                                rules={{ required: translations.validation.attributes.field_required }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={getFillingStructure}
                                            placeholder={translations.auth.select_opcion}
                                            showClear
                                            optionLabel='filing_structure' optionValue='id' filter
                                            value={field.value}
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
                        <span className="flex flex-col ">
                            <label htmlFor="consecutive_length">{ translations.configuration.filling_setting.form.consecutive_length }</label>
                            <Inputnumber control={control} name="consecutive_length" errors={errors} rules={{ required: translations.validation.attributes.field_required,
                                validate: (value) =>
                                value?.toString().length <= 2 || "Máximo 2 caracteres"
                             }} useGrouping={false}/>
                        </span>

                        <div className="lg:col-span-3">
                            <Button label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
