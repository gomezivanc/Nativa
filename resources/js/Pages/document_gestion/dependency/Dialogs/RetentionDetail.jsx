export default function RetentionDetail({ retencion, translations, onAddIndice, onEditIndice, deleteIndice }) {
    if (!retencion) return null

    return (
        <div className="grid md:grid-cols-4 gap-3 text-sm">

            <div className="border p-2">
                <b>{translations.documental_gestion.dependency.detail.retention_years.title}</b>

                <div>AG: {retencion.archivo_gestion}</div>
                <div>AC: {retencion.archivo_central}</div>
            </div>

            <div className="border p-2">
                <b>{translations.documental_gestion.dependency.detail.support.title}</b>

                <div>P: {retencion.papel ? 'X' : ''}</div>
                <div>E: {retencion.electronico ? 'X' : ''}</div>
            </div>

            <div className="border p-2">
                <b>{translations.documental_gestion.dependency.detail.dis_final.title}</b>

                <div>E: {retencion.eliminacion ? 'X' : ''}</div>
                <div>CT: {retencion.conservacion_total ? 'X' : ''}</div>
                <div>S: {retencion.seleccion ? 'X' : ''}</div>
                <div>D/M: {retencion.digitalizacion_micro ? 'X' : ''}</div>
            </div>

            <div className="border p-2">
                <b>{translations.documental_gestion.dependency.detail.process}</b>

                <div className="max-h-40 overflow-y-auto text-xs leading-relaxed">
                    {retencion.procedimiento}
                </div>
            </div>

            {/* TIPOS DOCUMENTALES */}
            <div className="border p-2 md:col-span-4">
                <b>Tipos documentales</b>

                <div className="flex flex-wrap gap-2 mt-2">
                    {retencion.tipos_documentales?.length > 0 ? (
                        retencion.tipos_documentales.map((tipo) => {
                            const label = tipo?.name_es ?? tipo?.name_en ?? 'Sin nombre';

                            return (
                                <span key={tipo.id} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    {label}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-gray-400 text-xs">
                            Sin tipos documentales
                        </span>
                    )}
                </div>
            </div>

            {/* Sección Indices */}
            <div className="border p-2 md:col-span-4">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <b>Índices de búsqueda</b>
                    <button onClick={() => onAddIndice(retencion)} className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                        <i className="pi pi-plus"></i> Agregar
                    </button>
                </div>

                {/* LISTADO */}
                <div className="mt-2 space-y-1">
                    {retencion.indices?.length > 0 ? (
                        retencion.indices.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">

                                <div className="text-xs">
                                    <span className="font-medium">
                                        {item.indice?.nombre}
                                    </span>

                                    <span className="text-gray-400 ml-2">
                                        ({item.indice?.tipo_dato})
                                    </span>

                                    {item.obligatorio === 1 && (
                                        <span className="ml-2 text-red-500">*</span>
                                    )}
                                </div>

                                <div className="flex gap-2 text-gray-500">
                                    <i 
                                        onClick={() => onEditIndice(item, retencion)} 
                                        className="pi pi-pencil cursor-pointer hover:text-green-600"
                                    />
                                    <i 
                                        onClick={() => deleteIndice(item)} 
                                        className="pi pi-trash cursor-pointer hover:text-red-600"
                                    />
                                </div>

                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs">
                            Sin índices configurados
                        </span>
                    )}
                </div>

            </div>

        </div>
    )
}