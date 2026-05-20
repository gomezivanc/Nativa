import { usePage } from '@inertiajs/react'

export default function Show({ data }) {
    const { translations, ziggy } = usePage()?.props

    const Row = ({ label, value }) => (
        <div className="py-2 border-b last:border-b-0">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base text-gray-600 font-medium break-words">
                {value || '—'}
            </p>
        </div>
    )

    const ImageBlock = ({ label, src }) => {
        const hasImage = !!src

        return (
            <div className="mt-6">
                <h3 className="text-sm text-gray-500 mb-2">{label}</h3>

                <div className="flex justify-center items-center min-h-[120px] bg-gray-50 rounded-lg border">
                    {hasImage && (
                        <img
                            src={`${ziggy.url}/getfile?path=${src}`}
                            alt="signature"
                            className="max-w-sm w-full rounded-md"
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                            }}
                        />
                    )}

                    {/* Fallback */}
                    <div
                        className={`flex flex-col items-center justify-center text-gray-400 ${hasImage ? 'hidden' : 'flex'}`}
                    >
                        <i className="pi pi-image text-3xl mb-1"></i>
                        <span className="text-xs">Imagen no disponible</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-600">
                    {data.persona?.nombre} {data.persona?.apellido}
                </h2>
                <p className="text-sm text-gray-500">{data.usuario}</p>
            </div>

            {/* Info */}
            <div className="grid md:grid-cols-2 gap-x-8">
                <div>
                    <Row label={translations.administration.user.form.first_name} value={data.persona?.nombre}/>
                    <Row label={translations.administration.user.form.last_name} value={data.persona?.apellido}/>
                    <Row label={translations.administration.user.form.id_number} value={data.persona?.numero_documento}/>
                    <Row label={translations.administration.user.form.user} value={data.usuario}/>
                    <Row label={translations.administration.user.form.email} value={data.email}/>
                </div>

                <div>
                    <Row label={translations.administration.user.form.observations} value={data?.observaciones}/>
                    <Row label={translations.administration.user.form.role} value={data.rol?.map(r => r.roles.name).join(', ')}/>
                    <Row label={translations.administration.user.form.dependency} value={data.dependency?.name}/>
                    <Row label={translations.administration.user.form.regional} value={data.regional?.name}/>
                    <Row label={translations.administration.user.form.charge} value={data.charge?.cargo} />
                </div>
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
                <ImageBlock label={translations.administration.user.form.mechanical_signature} src={data.signature}/>
                <ImageBlock label={translations.administration.user.form.physical_signature} src={data.physical_signature}/>
            </div>

        </div>
    )
}
