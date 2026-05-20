import { usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import Upload from '../../../../components/Upload'

export default function CreateAssign({ dataDependency, onFinish }) {

    const { translations } = usePage().props
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm()

    const onSubmit = async (formData) => {
        try {
            setLoading(true)

            // Crear la plantilla
            const payrollRes = await axios.post(route('payroll-management.store'), {
                name: formData.name,
                file: formData.file,
                filename: formData.filename
            })

            const payrollId = payrollRes.data.id

            // Crear la relación en dependency_templates
            await axios.post(route('payroll-management.assign'), {
                id_dependency: dataDependency?.id,
                id_template: payrollId,
                observation: null
            })

            toast.success('Plantilla creada y asignada correctamente')

            if (onFinish) onFinish()

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Error al crear la plantilla')
        } finally {
            setLoading(false)
        }
    }

    function fileChange(e) {
        if (e.length > 0) {
            setValue('file', e[0]?.data)
            setValue('filename', e[0]?.name)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">

            <div>
                <label className="block font-bold mb-2">
                    {translations.configuration?.name || 'Dependencia'}
                </label>
                <p className="p-3 bg-gray-100 rounded border border-gray-300">
                    {dataDependency?.name}
                </p>
            </div>

            <div className="flex flex-col">
                <label className="font-bold mb-2">
                    {translations.configuration?.payroll_management?.form?.name || 'Nombre de Plantilla'}
                </label>
                <InputText
                    {...register("name", { required: translations.validation.attributes.field_required })}
                    placeholder="Ingresa el nombre de la plantilla"
                    className={errors?.name ? 'p-invalid w-full' : 'w-full'}
                />
                {errors?.name && (
                    <span className="text-red-600 text-sm mt-1">{errors.name?.message}</span>
                )}
            </div>

            <div className="flex flex-col">
                <label className="font-bold mb-2">
                    {translations.configuration?.payroll_management?.form?.file || 'Archivo'}
                </label>
                <Upload 
                    onChangeDocs={fileChange} 
                    limitDocs={1} 
                    allowedFiles='.doc,.docx' 
                />
            </div>

            <div className="flex gap-2 justify-end pt-4">
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
