import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { usePage } from '@inertiajs/react'

export default function Create({ data, onSuccess }) {
    const { translations } = usePage()?.props
    const [loading, setLoading] = useState(false)
    const [regionals, setRegionals] = useState([])
    const [dependencies, setDependencies] = useState([])
    const [formData, setFormData] = useState({
        id_regional: null,
        id_dependency: null,
        cargo: '',
        observation: ''
    })

    useEffect(() => {
        getDependencies()
        getRegionals()

        if (data?.id) {
            fetchChargeData()
        }
    }, [data])

    async function getRegionals() {
        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setRegionals(res.data)
    }

    async function getDependencies() {
        const res = await axios.get(route('dependencies.list'))
        setDependencies(res.data.data)
    }

    const fetchChargeData = async () => {
        try {
            const res = await axios.get(route('charges.show', data.id))
            const chargeData = res.data

            setFormData({
                id_regional: chargeData.id_regional,
                id_dependency: chargeData.id_dependency,
                cargo: chargeData.cargo || '',
                observation: chargeData.observation || ''
            })

        } catch (error) {
            console.error('Error cargando cargo:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.id_regional || !formData.id_dependency || !formData.cargo) {
            toast.error('Por favor completa los campos requeridos')
            return
        }

        setLoading(true)

        try {

            const payload = {
                ...formData,
                id: data?.id || null
            }

            const response = await axios.post(
                route('charges.storeUpdate'),
                payload
            )

            toast.success(
                data?.id
                    ? 'Cargo actualizado exitosamente'
                    : 'Cargo creado exitosamente'
            )

            onSuccess?.()

        } catch (error) {
            console.error('Error:', error)
            toast.error(error?.response?.data?.message || 'Error al guardar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    {translations.menu.configuration.regional || 'Regional/Sede'}
                    <span className="text-red-500">*</span>
                </label>
                <Dropdown value={formData.id_regional} onChange={(e) => setFormData({ ...formData, id_regional: e.value })}
                    options={regionals} optionLabel="name" optionValue="id" placeholder={translations.configuration.charges.form.regional} className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {translations.menu.configuration.dependency || 'Dependencia'}
                    <span className="text-red-500">*</span>
                </label>
                <Dropdown value={formData.id_dependency} onChange={(e) => setFormData({ ...formData, id_dependency: e.value })}
                    options={dependencies} optionLabel="name" optionValue="id" placeholder={translations.configuration.charges.form.dependence} className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Cargo <span className="text-red-500">*</span>
                </label>
                <InputText value={formData.cargo} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ej: Gerente, Coordinador..." className="w-full"maxLength={100}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Observación
                </label>
                <InputTextarea value={formData.observation} onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                    placeholder="Notas adicionales..." rows={3} className="w-full"
                />
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button type="button" label={translations.auth.start_end.cancel || 'Cancelar'}
                    severity="secondary"
                    onClick={() => onSuccess?.()}
                    disabled={loading}
                />
                <Button type="submit" label={translations.auth.users.table.create || 'Guardar'} loading={loading}/>
            </div>
        </form>
    )
}
