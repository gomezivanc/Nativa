import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator } from 'primereact/paginator'
import { BreadCrumb } from 'primereact/breadcrumb'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import PdfViewerDialog from './Dialogs/PdfViewerDialog';
import TransferFilingDialog from './Dialogs/TransferFilingDialog';
import AssignOfficialDialog from './Dialogs/AssignOfficialDialog';
import ExtensionOfTime  from './Dialogs/ExtensionOfTime'
import { Dialog } from 'primereact/dialog'

export default function Show({ distributionUnit }) {
    const { translations, current_language } = usePage()?.props
    const [loading, setLoading] = useState(false)
    const [filings, setFilings] = useState([])
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 10,
        page: 1,
        totalRecords: 0,
    })
    
    // Estados para modales
    const [displayTransferDialog, setDisplayTransferDialog] = useState(false)
    const [displayAssignDialog, setDisplayAssignDialog] = useState(false)
    const [selectedFiling, setSelectedFiling] = useState(null)
    const [distributionUnits, setDistributionUnits] = useState([])
    const [officials, setOfficials] = useState([])
    const [pdfShow, setpdfShow] = useState(false);
    const [pdfViewer, setPdfViewer] = useState(null);
    const [extensionOfTime, setExtensionOfTime] = useState(false);
    const [transferData, setTransferData] = useState({
        distribution_id_filing: null,
        transfer_type: null,
        observation: '',
    })
    const [selectedOfficial, setSelectedOfficial] = useState(null)
    
    useEffect(() => {
        loadDistributionUnits()
        loadOfficials()
        loadFilings(1, 10)
    }, [])

    const loadFilings = async (page = 1, perPage = 10) => {
        try {
            setLoading(true)
            const res = await axios.get(route('distribution-unit.list-filings', distributionUnit.id), {
                params: {
                    page: page,
                    per_page: perPage
                }
            })
            
            const filingsData = res.data.data || []
            
            // Marcar copias con "-copia" en el número si no lo tienen
            filingsData.forEach(filing => {
                if (filing.is_copy && !filing.filing_number.includes('-copia')) {
                    filing.filing_number = `${filing.filing_number}`
                }
            })
            
            setFilings(filingsData)
            setPagination({
                first: (page - 1) * perPage,
                rows: perPage,
                page: page,
                totalRecords: res.data.total || 0
            })
        } catch (error) {
            toast.error('Error cargando radicados')
        } finally {
            setLoading(false)
        }
    }
    
    const loadDistributionUnits = async () => {
        try {
            const res = await axios.get(route('distribution.listFull'))
            setDistributionUnits(res.data)
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

    const handlePageChange = (e) => {
        const newPage = e.page + 1
        const newRows = e.rows
        loadFilings(newPage, newRows)
    }

    const openTransferDialog = (filing) => {
        setSelectedFiling(filing)
        setTransferData({
            distribution_id_filing: null,
            transfer_type: null,
            observation: '',
        })
        setDisplayTransferDialog(true)
    }

    const openAssignDialog = (filing) => {
        setSelectedFiling(filing)
        setSelectedOfficial(null)
        setDisplayAssignDialog(true)
    }

    const documentTemplate = (rowData) => {
        if (!rowData.charge_doc_filings || rowData.charge_doc_filings.length === 0) {
            return <span className='text-gray-500 text-xs italic'>Sin documentos</span>;
        }

        return (
            <div className='flex flex-col gap-2'>
                {rowData.charge_doc_filings.map((doc, index) => {
                    let fileName = `Documento ${index + 1}`;
                    try {
                        const detail = typeof doc.file_detail === 'string' 
                            ? JSON.parse(doc.file_detail) 
                            : doc.file_detail;
                        fileName = detail?.name || fileName;
                    } catch (e) { console.error(e); }

                    const downloadUrl = route('file') + '?path=' + encodeURIComponent(doc.file);

                    return (
                        <div key={index} className="flex items-center gap-2">
                            <Button
                                icon="pi pi-eye"
                                className="p-button-rounded p-button-text p-button-sm"
                                style={{ height: '25px', width: '25px' }}
                                onClick={() => {
                                    setSelectedFiling(rowData);
                                    setPdfViewer({
                                        file: doc.file,
                                        segment: false,
                                        title: fileName
                                    });
                                    setpdfShow(true);
                                }}
                            />
                            
                            {/* Enlace de Descarga */}
                            <a
                                href={downloadUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline text-xs truncate max-w-[150px]'
                                title="Descargar"
                            >
                                {fileName}
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    };

    const filingNumberTemplate = (rowData) => {
        const isCopy = rowData.is_copy
        
        return (
            <div className='flex items-center gap-2'>
                <Link
                    href={route('filing.show', rowData.id)}
                    className='text-blue-600 font-semibold hover:underline'
                >
                    {rowData.filing_number}
                </Link>
                {isCopy && (
                    <span className='inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold'>
                        COPIA
                    </span>
                )}
            </div>
        )
    }

    const breadcrumbItems = [
        { label: translations.auth.home || 'Inicio', command: () => router.visit(route('dashboard.index')) },
        { label: translations.auth.management || 'Gestión', disabled: true },
        { label: translations.auth.correspondence || 'Correspondencia', command: () => router.visit(route('correspondence.index')) },
        { label: `${distributionUnit.name} - ${translations.auth.filings || 'Radicados'}`, disabled: true },
    ]

    const getFilingStatus = (filings) => {
        const hoy = new Date();
        const fechaExpiracion = new Date(filings.expiration_date);

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

    const isFilingOlderThanTwoDays = (createdDate) => {
        const hoy = new Date();
        const fechaCreacion = new Date(createdDate);
        const tiempoTranscurrido = hoy - fechaCreacion;
        const diasTranscurridos = Math.ceil(tiempoTranscurrido / (1000 * 60 * 60 * 24));
        return diasTranscurridos > 2;
    };

    const isFilingOlderThanTwoDaysElimi = (createdDate) => {
        const hoy = new Date();
        const fechaCreacion = new Date(createdDate);
        const tiempoTranscurrido = hoy - fechaCreacion;
        const diasTranscurridos = Math.ceil(tiempoTranscurrido / (1000 * 60 * 60 * 24));

        return diasTranscurridos < 2;
    };

    const priorityTemplate = (rowData) => {
        const { diasRestantes, prioridad } = getFilingStatus(rowData);

        const getSeverity = (p) => {
            switch (p) {
                case 'Vencido': return 'danger';   // Rojo
                case 'Crítica': return 'danger';   // Rojo
                case 'Alta':    return 'warning';  // Naranja
                case 'Media':   return 'info';     // Azul
                case 'Baja':    return 'success';  // Verde
                default:        return null;    
            }
        };

        return (
            <div className="flex flex-col gap-1">
                <span className={`font-bold text-${getSeverity(prioridad) === 'danger' ? 'red' : 'gray'}-600`}>
                    {prioridad}
                </span>
                <small className="text-gray-500">
                    {diasRestantes < 0 
                        ? `Vencido hace ${Math.abs(diasRestantes)} días` 
                        : `${diasRestantes} días restantes`}
                </small>
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => (
        <div className='flex gap-2 justify-center flex-wrap'> 
            {isFilingOlderThanTwoDays(rowData.created_at) && ! rowData.is_copy && (rowData?.solicitud?.estado == 2 && rowData?.solicitud?.tipo == 4 || !rowData.solicitud) &&(
                <>
                    <Button
                        icon='pi pi-megaphone'
                        tooltip={'Solicitud de Transferencia'}
                        className='p-button-rounded p-button-warning p-button-sm'   
                        onClick={() => {
                            setSelectedFiling(rowData);  
                            setExtensionOfTime(true);    
                        }}
                    />
                </>
            )}
            {!isFilingOlderThanTwoDaysElimi(rowData?.solicitud?.deleted_at) && !rowData.is_copy && rowData?.solicitud?.estado == 1 &&(
                <>
                    <Button
                        icon='pi pi-megaphone'
                        tooltip={'Solicitud de Transferencia'}
                        className='p-button-rounded p-button-warning p-button-sm'   
                        onClick={() => {
                            setSelectedFiling(rowData);  
                            setExtensionOfTime(true);    
                        }}
                    />
                </>
            )}
            {isFilingOlderThanTwoDays(rowData.created_at) && ! rowData.is_copy && (rowData?.solicitud?.estado == 0 && rowData?.solicitud?.tipo == 4) &&(
                <>
                    <Button
                        icon='pi pi-clock'
                        tooltip={'Solicitud por aprobacion'}
                        className='p-button-rounded p-button-help p-button-sm'   
                    />
                </>
            )}

            {(isFilingOlderThanTwoDaysElimi(rowData?.solicitud?.deleted_at)) &&(
                <>
                    <Button
                        icon='pi pi-arrow-right'
                        tooltip={'Transferir a otra unidad'}
                        className='p-button-rounded p-button-warning p-button-sm'
                        disabled={isFilingOlderThanTwoDays(rowData?.solicitud?.deleted_at)}
                        onClick={() =>  openTransferDialog(rowData)}
                        
                    />
                </>
            )}

            {!isFilingOlderThanTwoDays(rowData.created_at) &&(
                <>
                    <Button
                        icon='pi pi-arrow-right'
                        tooltip={isFilingOlderThanTwoDays(rowData.created_at) ? 'No se puede transferir (más de 2 días)' : 'Transferir a otra unidad'}
                        className='p-button-rounded p-button-warning p-button-sm'
                        disabled={isFilingOlderThanTwoDays(rowData.created_at)}
                        onClick={() =>  openTransferDialog(rowData)}
                        
                    />
                </>
            )}

            <Button
                icon='pi pi-users'
                tooltip='Asignar a funcionario'
                className='p-button-rounded p-button-info p-button-sm'
                onClick={() => openAssignDialog(rowData)}
            />
        </div>
    )

    const senderTemplate = (rowData) => {
        const name = rowData.name_social_reason_sender || '';
        const surname = rowData.first_surname_legal_representative_sender || '';
        
        return `${name} ${surname}`.trim();
    };

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

                    <DataTable value={filings} loading={loading} responsiveLayout='scroll' className='mt-4'
                        emptyMessage={translations.auth.no_data || 'No hay datos'}
                    >
                        <Column header={translations.filing?.priority || 'Prioridad / Días'} body={priorityTemplate} style={{ minWidth: '150px' }}/>

                        <Column field='filing_number' header={translations.auth.filing_number || 'Radicado'} body={filingNumberTemplate}/>

                        <Column header={'Remitente'} body={senderTemplate} />

                        <Column header={'Asunto'} field = 'subject'/>

                        <Column field='subject' header={translations.auth.subject || 'Asunto'} className='max-w-xs truncate'/>

                        <Column field='created_at' header={translations.auth.created_at || 'Fecha Radicacion'} body={(rowData) => formatDate(rowData.created_at, current_language)}/>

                        <Column header={'Tipo Tramite'} field='type_of_procedure.name'/>

                        <Column header={'Medio de Recepción'} field='reception_media.name_es' />

                        <Column header={'Documentos'} body={documentTemplate} style={{ minWidth: '200px' }} />

                        <Column body={actionBodyTemplate} header={translations.auth.actions || 'Acciones'} style={{ width: '150px' }} />

                    </DataTable>

                    <Paginator first={pagination.first} rows={pagination.rows} totalRecords={pagination.totalRecords}
                        onPageChange={handlePageChange}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        template='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
                    />
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

                <ExtensionOfTime
                    visible={extensionOfTime}
                    onHide={() => {
                        setExtensionOfTime(false);
                        setSelectedFiling(null);
                    }}
                    filingId={selectedFiling?.id}
                    type={4} // o el tipo que necesites
                    header="Solicitud tiempo de traspaso"
                />

                <PdfViewerDialog visible={pdfShow} setVisible={setpdfShow} pdfViewer={pdfViewer} setPdfViewer={setPdfViewer} selectedFiling={selectedFiling}/>
                    
                {/* Dialog para asignar funcionario */}
                <AssignOfficialDialog visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} selectedFiling={selectedFiling}
                    officials={officials}
                    dependencyId={distributionUnit.id_dependency}
                    onSuccess={() => {
                        // Aquí refrescas la tabla
                        window.location.reload(); 
                    }}
                />
            </Card>
        </div>
    )
}
