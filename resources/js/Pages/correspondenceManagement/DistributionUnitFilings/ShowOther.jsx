import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BreadCrumb } from 'primereact/breadcrumb'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import PdfViewerDialog from './Dialogs/PdfViewerDialog';
import TransferFilingDialog from './Dialogs/TransferFilingDialog';
import FinishSettled from './Dialogs/FinishSettled';
import { Dialog } from 'primereact/dialog';
import Swal from 'sweetalert2';

export default function ShowOther({ correosCentral , distributionUnit }) {
    const { translations, current_language } = usePage()?.props
    const [loading, setLoading] = useState(false)
    const [correos, setCorreos] = useState(correosCentral?.data || [])
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedBody, setSelectedBody] = useState('');
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 5,
        page: 1,
        totalRecords: 0,
    })
    
    // Estados para modales
    const [displayTransferDialog, setDisplayTransferDialog] = useState(false)
    const [selectedFiling, setSelectedFiling] = useState(null)
    const [distributionUnits, setDistributionUnits] = useState([])
    const [officials, setOfficials] = useState([])
    const [pdfShow, setpdfShow] = useState(false);
    const [pdfViewer, setPdfViewer] = useState(null);
    const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [displayAssignDialog, setDisplayAssignDialog] = useState(false)
    const [selectedOfficial, setSelectedOfficial] = useState(null)
    const [transferData, setTransferData] = useState({
        distribution_id_filing: null,
        transfer_type: null,
        observation: '',
    })
    
    useEffect(() => {
        loadDistributionUnits()
        loadOfficials()
        loadCorreos(1, 5)
    }, [])

    const loadCorreos = async (page = 1, perPage = 10) => {
        try {
            setLoading(true)
            const res = await axios.get(route('distribution-unit.list-received-emails', distributionUnit.id_mail), {
                params: {
                    page: page,
                    per_page: perPage
                }
            })
            setCorreos(res.data.data || [])
            setPagination({
                first: (page - 1) * perPage,
                rows: perPage,
                page: page,
                totalRecords: res.data.total || 0
            })
        } catch (error) {
            toast.error('Error cargando correos')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (e) => {
        loadCorreos(e.page + 1, e.rows)
    }
    
    const loadDistributionUnits = async () => {
        try {
            const res = await axios.get(route('distribution.list'), {
                params: { per_page: 100 }
            })
            setDistributionUnits(res.data.data)
        } catch (error) {
            toast.error('Error cargando unidades de distribución')
        }
    }

    const loadOfficials = async () => {
        try {
            const res = await axios.get(route('usuarios.getUsers'), {
                params: {
                    by_dependency: distributionUnit.id_dependency
                }
            })
            setOfficials(res.data.data || res.data)
        } catch (error) {
            toast.error('Error cargando funcionarios')
        }
    }

    const showEmail = (body) => {
        setSelectedBody(body);
        setDisplayModal(true);
    };

    const showAttachments = (rowData) => {
        const files = typeof rowData.attachments === 'string' 
            ? JSON.parse(rowData.attachments) 
            : rowData.attachments;

        setSelectedFiles(files || []);
        setSelectedMail(rowData);
        setShowAttachmentsModal(true);
    };

    const openAssignDialog = (filing) => {
        setSelectedFiling(filing)
        setSelectedOfficial(null)
        setDisplayAssignDialog(true)
    }

    async function Idelete(id,deleted_at) {
        const res = await Swal.fire({
            icon: 'question',
            text: !deleted_at ? translations.auth.confirmation_delete.question_deactivate : translations.auth.confirmation_delete.question_activate,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: translations.auth.yes_not.no
            ,confirmButtonText: translations.auth.yes_not.yes
        })

        if(!res.isConfirmed) {
            return
        }
        try {
            await axios.delete(route("ReceivedEmail.destroyReceivedEmail",id))
            toast.success(translations.auth.confirmation_delete.success)
        } catch (error) {
            toast.error(translations.auth.error)
        }
    }

    const actionBodyTemplate = (rowData) => (
        <div className='flex gap-2 justify-center flex-wrap'>
            <Button
                icon='pi pi-trash'
                tooltip='Anular Radicado'
                className='p-button-rounded p-button-info p-button-sm'
                onClick={() => Idelete(rowData.id)}
            />
            <Button
                icon='pi pi-arrow-right'
                tooltip={'Transferir a otra unidad'}
                className='p-button-rounded p-button-warning p-button-sm'
                // disabled={isFilingOlderThanTwoDays(rowData.created_at)}
                onClick={() => openAssignDialog(rowData)}
            />
        </div>
    )

    const iaSeccion = (rowData) => {
        // 1. Extraer y parsear la data de forma segura
        let data = {};
        try {
            data = typeof rowData.sugerencia_ia === 'string' 
                ? JSON.parse(rowData.sugerencia_ia) 
                : rowData.sugerencia_ia;
        } catch (error) {
            return <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded border border-red-200">Error de formato IA</span>;
        }

        // Si hubo un error capturado en el Job
        if (!data || data.error) {
            return <span className="text-amber-700 text-xs font-medium px-2 py-1 bg-amber-50 rounded border border-amber-200">Procesamiento Incompleto</span>;
        }

        return (
            /* Contenedor Principal: Estilo Clean/Corporativo */
            <div className="p-3 w-full min-w-[300px] max-w-[400px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                
                <div className="flex flex-col gap-2.5">
                    {/* Cabecera del Panel */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-[11px] font-bold tracking-wide text-indigo-600 uppercase flex items-center gap-1.5">
                            {/* Icono de destellos (Sparkles), muy usado hoy para indicar "IA" de forma formal */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                            </svg>
                            Análisis Asistido por IA
                        </span>
                    </div>

                    {/* Etiquetas de Clasificación */}
                    <div className="flex flex-wrap gap-2">
                        {/* Badge Unidad */}
                        <div className="flex-1 min-w-[120px] bg-blue-50/50 px-2.5 py-1.5 rounded border border-blue-100">
                            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wide block mb-0.5">Unidad Sugerida</span>
                            <span className="text-[13px] text-slate-700 font-semibold truncate block" title={data.nombre_unidad}>
                                {data.nombre_unidad || 'N/A'}
                            </span>
                        </div>

                        {/* Badge Tipo Documental */}
                        <div className="flex-1 min-w-[120px] bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide block mb-0.5">Tipo Documental</span>
                            <span className="text-[13px] text-slate-700 font-semibold truncate block" title={data.name_TipoDocumental || data.TipoDocumental}>
                                {data.name_TipoDocumental || data.TipoDocumental || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Zona de Anexos con Scroll Integrado */}
                    {data.Anexos && data.Anexos.length > 0 && (
                        <div className="mt-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5 block">Resumen de Anexos</span>
                            
                            <div className="max-h-[90px] overflow-y-auto pr-1 space-y-1.5 custom-ia-scrollbar-light">
                                {data.Anexos.map((anexo, idx) => (
                                    <div key={idx} className="bg-gray-50 p-2 rounded border border-gray-100 text-[11px] text-gray-600 leading-relaxed">
                                        <span className="text-indigo-500 font-bold mr-1">•</span> 
                                        {anexo.resumen}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const breadcrumbItems = [
        { label: translations.auth.home || 'Inicio', command: () => router.visit(route('dashboard.index')) },
        { label: translations.auth.management || 'Gestión', disabled: true },
        { label: translations.auth.correspondence || 'Correspondencia', command: () => router.visit(route('correspondence.index')) },
        { label: `${distributionUnit.name} - ${translations.auth.filings || 'Radicados'}`, disabled: true },
    ]

    return (
        <div className='p-4'>
            <BreadCrumb model={breadcrumbItems} home={{ icon: 'pi pi-home', command: () => router.visit(route('dashboard.index')) }} />

            <Card className='mt-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div>
                        <h3 className='font-bold text-gray-700'>{translations.auth.name || 'Nombre'}</h3>
                        <p className='text-gray-900 text-lg'>{distributionUnit.name}</p>
                    </div>
                    <div>
                        <h3 className='font-bold text-gray-700'>{translations.auth.dependency || 'Dependencia'}</h3>
                        <p className='text-gray-900 text-lg'>{distributionUnit.dependency?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className='font-bold text-gray-700'>{translations.auth.observation || 'Observación'}</h3>
                        <p className='text-gray-900 text-lg'>{distributionUnit.observation || 'Sin observaciones'}</p>
                    </div>
                </div>

                <div className='mt-6'>

                    <DataTable value={correos} loading={loading} responsiveLayout='scroll' className='mt-4'
                        emptyMessage={translations.auth.no_data || 'No hay datos'} rows={pagination.rows} lazy
                        first={pagination.first} onPage={handlePageChange} paginator
                        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        totalRecords={pagination.totalRecords}
                    >
                        <Column field='filing_number' header={'Numero de Radicado'}/>
                        <Column header={'Correo de recepcion'} field='sender' />
                        <Column header={'Asunto'} field='subject' />
                        <Column header={'Contenido'} 
                            body={(rowData) => (
                                <button onClick={() => showEmail(rowData.body)} className="p-button p-component p-button-text">
                                    Ver Mensaje
                                </button>
                            )} 
                        />
                        <Column header={'Archivos Adjuntos'} 
                            body={(rowData) => {
                                const files = typeof rowData.attachments === 'string' 
                                    ? JSON.parse(rowData.attachments) 
                                    : rowData.attachments;

                                if (!files || files.length === 0) {
                                    return <span>Sin adjuntos</span>;
                                }

                                return (
                                    <button 
                                        onClick={() => showAttachments(rowData)}
                                        className="p-button p-component p-button-sm"
                                    >
                                        Ver documentos ({files.length})
                                    </button>
                                );
                            }} 
                        />
                        
                        <Column header="Sugerencia IA"body={iaSeccion}/>

                        <Column field='received_at' header={'Fecha Envio'} body={(rowData) => formatDate(rowData.received_at, current_language)}/>
                        
                        <Column header={'Acciones'} body={actionBodyTemplate} />

                    </DataTable>
                </div>

                <div className='mt-6 flex justify-start gap-2'>
                    <Button
                        label={translations.auth.back || 'Volver'}
                        icon='pi pi-arrow-left'
                        onClick={() => router.visit(route('distribution-units.index'))}
                        className='p-button-secondary'
                    />
                </div>
                {/* Dialog para transferencia */}
                <TransferFilingDialog visible={displayTransferDialog} onHide={() => setDisplayTransferDialog(false)} selectedFiling={selectedFiling}
                    distributionUnits={distributionUnits}
                    onSuccess={() => {
                        window.location.reload(); 
                    }}
                />

                <Dialog 
                    header="Contenido del Correo" 
                    visible={displayModal} 
                    style={{ width: '70vw' }} 
                    onHide={() => setDisplayModal(false)}
                >
                    {/* dangerouslySetInnerHTML es necesario para renderizar el HTML que viene de Gmail */}
                    <div 
                        className="email-container"
                        dangerouslySetInnerHTML={{ __html: selectedBody }} 
                    />
                </Dialog>

                <Dialog header="Archivos Adjuntos" visible={showAttachmentsModal} style={{ width: '50vw' }} modal onHide={() => setShowAttachmentsModal(false)}>
                    <div className="flex flex-column gap-2">
                        {selectedFiles.length > 0 ? (
                            selectedFiles.map((file, index) => (
                                <a 
                                    key={index}
                                    href={`/api/gmail/download-attachment/${selectedMail.mail_config_id}/${selectedMail.gmail_message_id}/${file.id}/${file.name}`}
                                    target="_blank"
                                    className="p-button p-component p-button-outlined"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                >
                                    <i className="pi pi-download mr-2"></i>
                                    {file.name}
                                </a>
                            ))
                        ) : (
                            <span>No hay archivos</span>
                        )}
                    </div>
                </Dialog>

                <FinishSettled visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} selectedFiling={selectedFiling}
                    officials={officials}
                    dependencyId={distributionUnit.id_dependency}
                    onSuccess={() => {
                        // Aquí refrescas la tabla
                        window.location.reload(); 
                    }}
                />

                <PdfViewerDialog visible={pdfShow} setVisible={setpdfShow} pdfViewer={pdfViewer} setPdfViewer={setPdfViewer}/>
            </Card>
        </div>
    )
}
