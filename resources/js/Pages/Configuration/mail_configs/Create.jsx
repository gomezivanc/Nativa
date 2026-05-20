import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { BreadCrumb } from 'primereact/breadcrumb'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Card } from 'primereact/card'
import { InputTextarea } from 'primereact/inputtextarea'

export default function Create() {
    const { translations, mailConfig } = usePage()?.props
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        refresh_token: '',
        access_token: '',
        watch_expiration: '',
    })

    useEffect(() => {
        if (mailConfig) {
            setFormData({
                email: mailConfig.email || '',
                refresh_token: mailConfig.refresh_token || '',
                access_token: mailConfig.access_token || '',
                watch_expiration: mailConfig.watch_expiration || '',
            })
        }
    }, [mailConfig])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        const url = mailConfig?.id 
            ? route('mail_configs.update', mailConfig.id)
            : route('mail_configs.store')

        const method = mailConfig?.id ? 'post' : 'post'

        axios({
            method: method,
            url: url,
            data: mailConfig?.id ? { ...formData, _method: 'put' } : formData,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            }
        })
            .then((response) => {
                toast.success(mailConfig?.id 
                    ? translations?.general?.updated_successfully || 'Actualizado correctamente'
                    : translations?.general?.created_successfully || 'Creado correctamente'
                )
                router.visit(route('mail_configs.index'))
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || translations?.general?.error || 'Error')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const breadcrumb = [
        // { label: translations?.menu?.configuration || 'Configuración', url: route('dashboard') },
        { label: translations?.menu?.mail_configs || 'Configuración de Correos', url: route('mail_configs.index') },
        { label: mailConfig?.id ? translations?.general?.edit || 'Editar' : translations?.general?.create || 'Crear' }
    ]

    return (
        <>
            {/* <BreadCrumb model={breadcrumb} home={{ icon: 'pi pi-home', url: route('dashboard') }} style={{ marginBottom: '20px' }} /> */}

            <div className="grid">
                <div className="col-12 md:col-6">
                    <Card title={mailConfig?.id ? translations?.general?.edit || 'Editar' : translations?.general?.create || 'Crear'} className="shadow-1">
                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label htmlFor="email" className="font-bold">
                                    {translations?.fields?.email || 'Correo'} <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full"
                                    type="email"
                                    autoFocus
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="refresh_token" className="font-bold">
                                    {translations?.fields?.refresh_token || 'Refresh Token'} <span className="text-red-500">*</span>
                                </label>
                                <InputTextarea
                                    id="refresh_token"
                                    name="refresh_token"
                                    value={formData.refresh_token}
                                    onChange={handleChange}
                                    className="w-full"
                                    rows={4}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="access_token" className="font-bold">
                                    {translations?.fields?.access_token || 'Access Token'}
                                </label>
                                <InputTextarea
                                    id="access_token"
                                    name="access_token"
                                    value={formData.access_token}
                                    onChange={handleChange}
                                    className="w-full"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <Button
                                    label={translations?.general?.save || 'Guardar'}
                                    icon="pi pi-save"
                                    type="submit"
                                    loading={loading}
                                    className="p-button-success"
                                />
                                <Link href={route('mail_configs.index')}>
                                    <Button
                                        label={translations?.general?.cancel || 'Cancelar'}
                                        icon="pi pi-times"
                                        className="p-button-secondary"
                                    />
                                </Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}
