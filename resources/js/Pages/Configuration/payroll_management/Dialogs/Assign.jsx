import { usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Assign({ dataDependency, onFinish }) {

    const { translations } = usePage().props
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(false)

    const isEditing = !!dataDependency?.id

    const {
        register,
        handleSubmit,
        control,
        reset
    } = useForm({
        defaultValues: {
            id: dataDependency?.id || null,
            id_dependency: dataDependency?.id_dependency,
            id_template: dataDependency?.id_template || null,
            observation: dataDependency?.observation || '',
            code: dataDependency?.code || '',
            version: dataDependency?.version || '',
            name: dataDependency?.name || ''
        }
    })

    useEffect(() => {

        loadTemplates()

        reset({
            id: dataDependency?.id || null,
            id_dependency: dataDependency?.id_dependency,
            id_template: dataDependency?.id_template || null,
            observation: dataDependency?.observation || '',
            code: dataDependency?.code || '',
            version: dataDependency?.version || '',
            name: dataDependency?.name || ''
        })

    }, [dataDependency])

    const loadTemplates = async () => {
        try {

            setLoading(true)

            const res = await axios.get(route('payroll-management.templates'))

            setTemplates(res.data || [])

        } finally {

            setLoading(false)

        }
    }

    const onSubmit = async (formData) => {

        try {

            setLoading(true)

            await axios.post(route('payroll-management.assign'), formData)

            toast.success(
                isEditing
                    ? 'Plantilla actualizada correctamente'
                    : 'Plantilla asignada correctamente'
            )

            onFinish?.()

        } catch (error) {

            console.error(error)

            toast.error(
                error.response?.data?.message || 'Error al guardar la plantilla'
            )

        } finally {

            setLoading(false)

        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

            {/* hidden */}
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("id_dependency")} />

            {/* dependencia */}
            <div>
                <label className="block font-bold mb-2">
                    {translations.configuration?.name || 'Dependencia'}
                </label>

                <p className="p-3 bg-gray-100 rounded border border-gray-300">
                    {dataDependency?.name}
                </p>
            </div>

            {/* plantilla */}
            <div>
                <label className="block font-bold mb-2">
                    Plantilla
                </label>

                <Controller
                    name="id_template"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Dropdown
                            {...field}
                            options={templates}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Selecciona una plantilla"
                            filter
                            className="w-full"
                        />
                    )}
                />
            </div>

            {/* campos */}
            <div className="grid grid-cols-2 gap-3">

                <div className="flex flex-col">
                    <label>Observación</label>
                    <InputText {...register("observation")} className="w-full" />
                </div>

                <div className="flex flex-col">
                    <label>Código</label>
                    <InputText {...register("code")} className="w-full" />
                </div>

                <div className="flex flex-col">
                    <label>Versión</label>
                    <InputText {...register("version")} className="w-full" />
                </div>

                <div className="flex flex-col">
                    <label>Nombre</label>
                    <InputText {...register("name")} className="w-full" />
                </div>

            </div>

            {/* botones */}
            <div className="flex gap-2 justify-end">

                <Button
                    type="button"
                    label={translations.auth?.cancel || 'Cancelar'}
                    severity="secondary"
                    onClick={onFinish}
                />

                <Button
                    type="submit"
                    label={translations.auth?.save || 'Guardar'}
                    loading={loading}
                />

            </div>

        </form>
    )
}