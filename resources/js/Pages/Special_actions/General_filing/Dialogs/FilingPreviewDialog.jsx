import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { router, usePage } from '@inertiajs/react';
import { formatDate } from '../../../../hooks/useDate';
import Traza from './Traza';

export default function FilingPreviewDialog({ visible, onHide, filing, onArchive, canArchive}) {

    if (!filing) {
        return null;
    }
    const page = usePage();
    const current_language = page?.props?.current_language;

    const attachedDocuments = filing?.charge_doc_filings || [];
    const responses = filing?.response_templates || [];
    
    const getFilingStatus = (filing) => {
        const hoy = new Date();
        const fechaExpiracion = new Date(filing.expiration_date);

        const tiempoRestante = fechaExpiracion - hoy;
        const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));

        let prioridad = "";

        if (diasRestantes < 0) {
            prioridad = "Vencido";
        } else if (diasRestantes <= 2) {
            prioridad = "Crítica";
        } else if (diasRestantes <= 4) {
            prioridad = "Alta";
        } else if (diasRestantes <= 7) {
            prioridad = "Media";
        } else {
            prioridad = "Baja";
        }

        return { diasRestantes, prioridad };
    };
    
    const { diasRestantes, prioridad } = getFilingStatus(filing);

    const configEstados = {
        1: { label: 'Inicial', class: 'bg-blue-100 text-blue-700 border border-blue-200' },
        2: { label: 'Plantilla asociada', class: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
        3: { label: 'Firmando', class: 'bg-orange-100 text-orange-700 border border-orange-200' },
        4: { label: 'Firmado', class: 'bg-teal-100 text-teal-700 border border-teal-200' },
        5: { label: 'Traslado Correspondencia', class: 'bg-purple-100 text-purple-700 border border-purple-200' },
        6: { label: 'Envió respuesta', class: 'bg-green-100 text-green-700 border border-green-200' },
        7: { label: 'Acuse adjunto', class: 'bg-gray-100 text-gray-700 border border-gray-200' },
    };

    // Subcomponente para campos de datos (Reutilizable y limpio)
    const DataField = ({ label, value, colSpan = "col-span-1" }) => (
        <div className={colSpan}>
            <span className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>{label}</span>
            <span className='block text-sm font-medium text-gray-900 break-words'>{value || 'N/A'}</span>
        </div>
    );

    // Subcomponente para cabeceras de sección
    const SectionHeader = ({ icon, title, count }) => (
        <div className='bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2 rounded-t-xl'>
            <i className={`pi ${icon} text-blue-500 text-lg`}></i>
            <h3 className='font-semibold text-gray-800 text-base m-0'>
                {title} {count !== undefined && <span className='ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs'>{count}</span>}
            </h3>
        </div>
    );

    const documentListTemplate = () => {
        if (!attachedDocuments || attachedDocuments.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <i className="pi pi-folder-open text-4xl mb-3 opacity-50"></i>
                    <p className='italic text-sm'>No hay documentos adjuntos</p>
                </div>
            );
        }

        return (
            <div className='grid grid-cols-1 gap-4 p-5'>
                {attachedDocuments.map((doc, idx) => {
                    let details = {};
                    try {
                        details = typeof doc.file_detail === 'string'
                            ? JSON.parse(doc.file_detail)
                            : (doc.file_detail || {});
                    } catch (e) {
                        console.error("Error al procesar file_detail:", e);
                    }

                    return (
                        <div key={`doc-${idx}`} className='flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200'>
                            <div className='w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0'>
                                <i className='pi pi-file-pdf text-2xl'></i>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h4 className='text-sm font-bold text-gray-900 truncate mb-2' title={details.name || doc.file_name}>
                                    {details.name || doc.file_name || 'Documento sin nombre'}
                                </h4>
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm'>
                                    <DataField label="Tipo" value={doc.document_type_name || details.type} />
                                    <DataField label="Fecha de Carga" value={doc.created_at ? formatDate(doc.created_at, current_language) : null} />
                                    <DataField label="Tamaño" value={details.size ? `${(details.size / 1024).toFixed(2)} KB` : (doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : null)} />
                                    
                                    {doc.typeDocumental && (
                                        <div className='sm:col-span-3 pt-2 border-t border-gray-100 mt-1'>
                                            <span className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Tipo Documental</span>
                                            <div className='flex flex-wrap gap-2'>
                                                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium'>
                                                    <i className="pi pi-tag text-[10px]"></i>
                                                    {doc.typeDocumental?.['name_' + current_language] || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const responseListTemplate = () => {
        if (!responses || responses.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <i className="pi pi-inbox text-4xl mb-3 opacity-50"></i>
                    <p className='italic text-sm'>No hay respuestas registradas</p>
                </div>
            );
        }

        return (
            <div className='grid grid-cols-1 gap-4 p-5'>
                {responses.map((response, idx) => (
                    <div key={`response-${idx}`} className='flex items-start gap-4 p-4 rounded-xl border border-green-200 bg-green-50/30 hover:shadow-md transition-all duration-200 relative overflow-hidden'>
                        <div className='absolute top-0 left-0 w-1 h-full bg-green-400'></div>
                        <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0'>
                            <i className='pi pi-send text-xl'></i>
                        </div>
                        <div className='flex-1'>
                            <div className='flex justify-between items-start mb-3'>
                                <h4 className='text-sm font-bold text-gray-900'>{response.template?.name || 'Plantilla sin nombre'}</h4>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${configEstados[response.state]?.class || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                    {configEstados[response.state]?.label || 'Desconocido'}
                                </span>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                                <DataField label="Fecha de Respuesta" value={formatDate(response.created_at, current_language)} />
                                <DataField label="Destinatario" value={response.third?.email_sender} />
                                {response.observations && (
                                    <div className='sm:col-span-2 bg-white p-3 rounded-lg border border-green-100 mt-2'>
                                        <DataField label="Observaciones" value={response.observations} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <i className="pi pi-receipt text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 leading-tight">Detalle del Radicado</h2>
                        <span className="text-sm font-medium text-gray-500">{filing?.filing_number || 'S.N'}</span>
                    </div>
                </div>
            }
            modal
            maximizable
            style={{ width: '90vw', height: '90vh' }}
            className='p-fluid custom-dialog-modern'
            contentClassName="p-0 bg-gray-50/50" // Fondo global sutil
        >
            <div className='flex flex-col h-full'>
                {/* Contenido scrolleable */}
                <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6'>
                    
                    {/* SECCIÓN GENERAL Y ADMINISTRATIVA (Grid de 2 columnas en pantallas grandes) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* GENERAL */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            <SectionHeader icon="pi-info-circle" title="Información General" />
                            <div className='p-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <DataField label="Número de Radicado" value={filing?.filing_number} />
                                <DataField label="Fecha" value={formatDate(filing?.created_at, current_language)} />
                                <DataField label="Tipo de Radicado" value={filing?.types_filings?.name} />
                                <DataField label="Prioridad" value={prioridad} />
                            </div>
                        </div>

                        {/* ADMINISTRATIVA */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                            <SectionHeader icon="pi-building" title="Información Administrativa" />
                            <div className='p-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <DataField label="Dependencia" value={filing?.dependency?.name} />
                                <DataField label="Funcionario" value={filing?.official?.persona ? `${filing.official.persona.nombre} ${filing.official.persona.apellido || ''}` : null} />
                                <DataField label="Medio de Recepción" value={filing?.reception_media?.['name_' + current_language]} />
                                <DataField label="Ubicación" value={[filing?.city?.nom_ciudad, filing?.department?.nombre, filing?.country?.name].filter(Boolean).join(', ')} />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN REMITENTE */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <SectionHeader icon="pi-user" title="Información del Remitente" />
                        <div className='p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
                            <DataField label="Nombre/Razón Social" value={filing?.name_social_reason_sender} colSpan="sm:col-span-2 md:col-span-1" />
                            <DataField label="Documento/NIT" value={filing?.document_nit_sender} />
                            <DataField label="Email" value={filing?.email_sender} />
                            <DataField label="Teléfono" value={filing?.phone_sender} />
                        </div>
                    </div>

                    {/* SECCIÓN CONTENIDO */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <SectionHeader icon="pi-align-left" title="Contenido del Radicado" />
                        <div className='p-5'>
                            <DataField label="Asunto" value={filing?.subject} colSpan="col-span-1" />
                        </div>
                    </div>

                    {/* SECCIÓN DOCUMENTOS */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <SectionHeader icon="pi-copy" title="Documentos Adjuntos" count={attachedDocuments.length} />
                        {documentListTemplate()}
                    </div>

                    {/* SECCIÓN RESPUESTAS */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        <SectionHeader icon="pi-comments" title="Respuestas" count={responses.length} />
                        {responseListTemplate()}
                    </div>

                                        {/* Trazabilidad - Sección de ancho completo para mejor lectura */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <SectionHeader icon="pi-history" title="Trazabilidad y Seguimiento" />
                        <div className='p-6'>
                            <Traza 
                                logs={filing.filing_logs} 
                                dependency={filing.dependency} 
                                official={filing.official} 
                            />
                        </div>
                    </div>


                </div>

                {/* BOTONES DE ACCIÓN (Sticky Footer con estilo Glassmorphism) */}
                <div className='p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex gap-3 justify-end shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] sticky bottom-0'>

                    <Button
                        label='Archivar'
                        icon='pi pi-folder'
                        disabled={!canArchive}
                        className={`px-6 rounded-lg font-medium ${
                            canArchive
                                ? 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-300 border-gray-300 cursor-not-allowed'
                        }`}
                        onClick={() => onArchive(filing)}
                    />

                    <Button
                        label='Cerrar'
                        icon='pi pi-times'
                        outlined
                        severity="secondary"
                        className='px-6 rounded-lg font-medium'
                        onClick={onHide}
                    />
                </div>
            </div>
        </Dialog>
    );
}