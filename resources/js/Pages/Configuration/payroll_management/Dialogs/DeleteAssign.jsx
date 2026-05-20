import { usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from 'primereact/button'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function DeleteAssign({ selectedItem, onFinish }) {

    const { translations } = usePage().props
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setLoading(true)

            await axios.delete(route('payroll-management.delete-assign', selectedItem.id))

            toast.success('Plantilla desactivada correctamente')

            if (onFinish) onFinish()

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Error al desactivar la plantilla')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-gray-700">
                    {translations.auth.confirmation_delete?.question_deactivate || 
                    '¿Estás seguro de que deseas desactivar esta plantilla?'}
                </p>
            </div>

            <div className="grid gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div>
                    <p className="text-sm font-semibold text-gray-600">Plantilla:</p>
                    <p className="text-gray-900">{selectedItem?.payroll?.name}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-600">Estado actual:</p>
                    <p className={`text-sm font-bold ${selectedItem?.deleted_at ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedItem?.deleted_at 
                            ? translations.auth.state?.inactive || 'Inactiva'
                            : translations.auth.state?.active || 'Activa'
                        }
                    </p>
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                <Button
                    type="button"
                    label={translations.auth?.cancel || 'Cancelar'}
                    severity="secondary"
                    onClick={onFinish}
                />

                <Button
                    type="button"
                    label={translations.auth?.yes_not?.yes || 'Desactivar'}
                    severity="danger"
                    loading={loading}
                    onClick={handleDelete}
                />
            </div>
        </div>
    )
}
