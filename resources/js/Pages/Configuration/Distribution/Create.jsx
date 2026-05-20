import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Controller, useForm } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useLoading } from "../../../Context/preloadContext"
import { InputSwitch } from 'primereact/inputswitch'

export default function Create({ id, dependencies, translations }) {
    const { watch, register, handleSubmit, getValues, formState: { errors }, setValue, control } = useForm({
        defaultValues: {
            central_bool: 0
        }
    });
    const { setIsLoading } = useLoading()
    const [loading, setLoading] = useState(false)
    const [valuMail, setMail] = useState([])
    
    const central_bool = watch("central_bool");

    useEffect(() => {
        getServisMail()
        if (id) {
            getItem(id)
        }
    }, [])

    async function submit(data) {
        setIsLoading(true)
        try {
            const res = await axios.post(route("distribution.store"), {
                ...data,
                id: id || null
            })
            toast.success('Registro guardado exitosamente')
            router.visit(route("distribution.index"))
        } catch (error) {
            toast.error('Error al guardar el registro')
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }

    async function getServisMail() {
        const res = await axios.get(route("mail_configs.list"),{})
        setMail(res.data.data)
    }

    async function getItem(id) {
        try {
            const res = await axios.get(route("distribution.show", id))
            for (const key in res.data) {
                if (res.data.hasOwnProperty(key)) {
                    setValue(key, res.data[key])
                }
            }
        } catch (error) {
            toast.error('Error al cargar el registro')
        }
    }

    return (
        <div>
            <Card header={
                <div className='p-5 flex gap-1 flex-col'>
                    <div>
                        <Link href={route("distribution.index")}>
                            <Button label="Atrás" size='small' />
                        </Link>
                    </div>
                </div>
            }>
                <form onSubmit={handleSubmit(submit)} className='grid gap-4 grid-cols-1 md:grid-cols-2 items-end'>
                    <h2 className='md:col-span-2 font-bold'>
                        {id ? 'Editar Unidad de Distribución' : 'Crear Unidad de Distribución'}
                    </h2>
                    <hr className='md:col-span-2' />

                    <span className="flex flex-col gap-2">
                        <label htmlFor="name">Nombre *</label>
                        <InputText
                            id="name"
                            maxLength={100}
                            {...register("name", { required: 'El nombre es requerido' })}
                            className={errors?.name ? 'p-invalid w-full' : 'w-full'}
                        />
                        {errors?.name && (
                            <span className="text-red-600">{errors.name?.message}</span>
                        )}
                    </span>

                    <span className="flex flex-col gap-2">
                        <label htmlFor="id_dependency">Dependencia *</label>
                        <Controller
                            name="id_dependency"
                            control={control}
                            rules={{ required: 'La dependencia es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id="id_dependency"
                                        options={dependencies}
                                        optionLabel='name'
                                        optionValue='id'
                                        filter
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={fieldState.error ? 'p-invalid w-full' : 'w-full'}
                                    />
                                    {fieldState.error && (
                                        <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                    )}
                                </>
                            )}
                        />
                    </span>

                    <span className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="observation">Observación</label>
                        <InputTextarea
                            id="observation"
                            {...register("observation")}
                            rows={4}
                            className='w-full'
                        />
                    </span>

                    <span className="flex flex-col md:col-span-2">
                        <label htmlFor="username">{ 'RECIBIRA CORREOS ELECTRONICOS' }</label>
                        <Controller
                            name="central_bool"
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
                    central_bool == 1 && 
                        <>
                        <span className="flex flex-col gap-2">
                            <label htmlFor="id_mail">Correo con tokens activos</label>
                            <Controller
                                name="id_mail"
                                control={control}
                                rules={{ required: 'La dependencia es requerida' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            id="id_mail"
                                            options={valuMail}
                                            optionLabel='email'
                                            optionValue='id'
                                            filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={fieldState.error ? 'p-invalid w-full' : 'w-full'}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </span>

                        </>
                    }

                    <div className='md:col-span-2 flex gap-2 justify-end'>
                        <Link href={route("distribution.index")}>
                            <Button label="Cancelar" severity="secondary" />
                        </Link>
                        <Button label="Guardar" type="submit" />
                    </div>
                </form>
            </Card>
        </div>
    )
}
