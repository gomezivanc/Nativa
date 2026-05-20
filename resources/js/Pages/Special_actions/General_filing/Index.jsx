import { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatDate } from '../../../hooks/useDate';
import FilingPreviewDialog from './Dialogs/FilingPreviewDialog';
import ExtensionOfTime from './Dialogs/ExtensionOfTime';
import {IncludeExpFiles} from './Dialogs/IncludeExpFiles';

export default function GeneralFilings({ filters: initialFilters, archiveClasification, dependencies}) {
    const { translations, current_language } = usePage()?.props;

    const [filters, setFilters] = useState({
        number: initialFilters?.number || '',
        person: initialFilters?.person || '',
        email: initialFilters?.email || '',
        document: initialFilters?.document || '',
        phone: initialFilters?.phone || '',
        subject: initialFilters?.subject || '',
        date_from: initialFilters?.date_from || null,
        date_to: initialFilters?.date_to || null,
        priority: initialFilters?.priority || '',
        per_page: initialFilters?.per_page || 10,
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 10,
        page: 0,
        totalRecords: 0,
    });

    const [previewDialog, setPreviewDialog] = useState(false);
    const [includeDialog, setIncludeDialog] = useState(false);
    const [selectedFiling, setSelectedFiling] = useState(null);

    const [dialogConfig, setDialogConfig] = useState({
        visible: false,
        id: null,
        type: null,
        header: ''
    });

    const handleOpenIncludeDialog = (filing) => {
        setPreviewDialog(false);
        setSelectedFiling(filing);
        setIncludeDialog(true);
    };

    const openAction = (id, type, header) => {
        setDialogConfig({ visible: true, id, type, header });
    };

    const handleSearch = async (pageNumber = 0) => {
        try {
            setLoading(true);
            const response = await axios.get(route('special-actions.general-filings-search'), {
                params: {
                    ...filters,
                    page: pageNumber + 1,
                    per_page: filters.per_page,
                }
            });

            setResults(response.data.data || []);
            setPagination({
                first: pageNumber * filters.per_page,
                rows: filters.per_page,
                page: pageNumber,
                totalRecords: response.data.total || 0,
            });
        } catch (error) {
            toast.error('Error al realizar la búsqueda');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({
            number: '',
            person: '',
            email: '',
            document: '',
            phone: '',
            subject: '',
            date_from: null,
            date_to: null,
            priority: '',
            per_page: 10,
        });
        setResults([]);
        setPagination({ first: 0, rows: 10, page: 0, totalRecords: 0 });
    };

    const handlePageChange = (e) => {
        setPagination({ ...pagination, first: e.first, page: e.page, rows: e.rows });
        setFilters({ ...filters, per_page: e.rows });
        handleSearch(e.page);
    };

    const breadcrumbItems = [
        { label: translations?.auth?.home || 'Inicio', command: () => router.visit(route('dashboard.index')) },
        { label: 'Acciones Especiales', disabled: true },
        { label: 'Búsqueda General de Radicados', disabled: true },
    ];

    const handleFilingPreview = (rowData) => {
        setSelectedFiling(rowData);
        setPreviewDialog(true);
    };

    const statusBodyTemplate = (rowData) => {
        if (!rowData.expiration_date) {
            return <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded-md">Sin fecha</span>;
        }

        const hoy = new Date();
        const fechaExpiracion = new Date(rowData.expiration_date);
        const tiempoRestante = fechaExpiracion - hoy;
        const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));

        let prioridad = "";
        let colorClasses = ""; 

        if (diasRestantes < 0) {
            prioridad = "Vencido";
            colorClasses = "bg-red-100 text-red-700 border-red-200";
        } else if (diasRestantes <= 2) {
            prioridad = "Crítica";
            colorClasses = "bg-orange-100 text-orange-700 border-orange-200";
        } else if (diasRestantes <= 4) {
            prioridad = "Alta";
            colorClasses = "bg-amber-100 text-amber-700 border-amber-200";
        } else if (diasRestantes <= 7) {
            prioridad = "Media";
            colorClasses = "bg-yellow-100 text-yellow-700 border-yellow-200";
        } else {
            prioridad = "Baja";
            colorClasses = "bg-green-100 text-green-700 border-green-200";
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses} shadow-sm whitespace-nowrap`}>
                <i className="pi pi-circle-fill mr-1 text-[8px] align-middle"></i>
                {prioridad}
            </span>
        );
    };

    const AccionesSolicitudes = (rowData) => (
        <div className="flex gap-2 justify-center">
            { ((!rowData.finished || !rowData.deleted_at) && rowData.finished != 2 ) && (
                <Button
                    icon="pi pi-sitemap"
                    onClick={() => openAction(rowData.id, 2, 'Reasignación')}
                    tooltip="Reasignar"
                    tooltipOptions={{ position: 'top' }}
                    className="p-button-rounded p-button-text p-button-sm hover:bg-indigo-50"
                    style={{ color: '#4f46e5' }}
                />
            )}
            { ((rowData.finished || rowData.deleted_at) && rowData.finished != 2) && (
                <Button
                    icon="pi pi-sync"
                    onClick={() => openAction(rowData.id, 3, 'Reabrir Radicado')}
                    tooltip="Reabrir"
                    tooltipOptions={{ position: 'top' }}
                    className="p-button-rounded p-button-text p-button-sm hover:bg-indigo-50"
                    style={{ color: '#4f46e5' }}
                />
            )}
        </div>
    );

    const filingNumberTemplate = (rowData) => (
        <Button
            label={rowData.filing_number}
            className='p-button-link text-indigo-600 font-bold hover:text-indigo-800 p-0 text-sm'
            onClick={() => handleFilingPreview(rowData)}
        />
    );

    const filinEstado = (rowData) => {
        let label = "En proceso";
        let colorClasses = "bg-blue-100 text-blue-700 border-blue-200";
        if (rowData.finished == 2) {
            label = 'Archivado';
            colorClasses = "bg-purple-100 text-purple-700 border-purple-200";
        }
        else if (rowData.finished == 1 || rowData.deleted_at) {
            label = 'Finalizado';
            colorClasses = "bg-red-100 text-red-700 border-red-200";
        }
        else if (isFilingAttended(rowData)) {
            label = 'Atendido';
            colorClasses = "bg-emerald-100 text-emerald-700 border-emerald-200";
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses} whitespace-nowrap`}>
                {label}
            </span>
        );
    };

    const isFilingAttended = (rowData) => {
        if (!rowData) return false;
        return !!(( rowData.template_name && rowData.template_url ) || rowData.distribution_shipping_status);
    };

    const isFilingFinished = (rowData) => {
        if (!rowData) return false;

        return !!(
            rowData.finished ||
            rowData.deleted_at
        );
    };

    return (
        <div className='p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen'>
            <div className="mb-4">
                <BreadCrumb 
                    model={breadcrumbItems} 
                    home={{ icon: 'pi pi-home', command: () => router.visit(route('dashboard.index')) }} 
                    className="border-none bg-transparent p-0"
                />
            </div>

            <Card className='shadow-md border-none rounded-xl overflow-hidden'>
                <div className="flex align-items-center mb-6">
                    <i className="pi pi-search text-2xl mr-3 text-indigo-500"></i>
                    <h1 className='text-2xl font-bold text-gray-800 m-0'>Búsqueda General de Radicados</h1>
                </div>

                <div className='bg-gray-50/50 p-5 rounded-xl border border-gray-100 mb-6'>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Filtros de Búsqueda</h2>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Número de Radicado</label>
                            <InputText value={filters.number} onChange={(e) => setFilters({ ...filters, number: e.target.value })} placeholder='Ej: CRT-1E26' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Nombre de Remitente</label>
                            <InputText value={filters.person} onChange={(e) => setFilters({ ...filters, person: e.target.value })} placeholder='Nombre o Apellido' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Email</label>
                            <InputText value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} placeholder='correo@ejemplo.com' type='email' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Documento/NIT</label>
                            <InputText value={filters.document} onChange={(e) => setFilters({ ...filters, document: e.target.value })} placeholder='Número de documento' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Teléfono</label>
                            <InputText value={filters.phone} onChange={(e) => setFilters({ ...filters, phone: e.target.value })} placeholder='Teléfono' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Asunto</label>
                            <InputText value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} placeholder='Asunto del radicado' className='p-inputtext-sm w-full' />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Fecha Desde</label>
                            <Calendar value={filters.date_from} onChange={(e) => setFilters({ ...filters, date_from: e.value })} dateFormat='dd/mm/yy' placeholder='Selecciona fecha' className='p-inputtext-sm w-full' showIcon />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Fecha Hasta</label>
                            <Calendar value={filters.date_to} onChange={(e) => setFilters({ ...filters, date_to: e.value })} dateFormat='dd/mm/yy' placeholder='Selecciona fecha' className='p-inputtext-sm w-full' showIcon />
                        </div>

                        <div className='flex flex-col '>
                            <label className='text-xs font-semibold mb-1 text-gray-600'>Registros por pág.</label>
                            <InputNumber value={filters.per_page} onChange={(e) => setFilters({ ...filters, per_page: e.value })} placeholder='10' min={5} max={100} inputClassName="p-inputtext-sm w-full" className='w-full' />
                        </div>

                    </div>

                    <div className='flex gap-3 mt-6 pt-4 border-t border-gray-200 justify-end'>
                        <Button label='Limpiar' icon='pi pi-filter-slash' onClick={handleClear} outlined severity="secondary" size="small" />
                        <Button label='Buscar Radicados' icon='pi pi-search' onClick={() => handleSearch(0)} loading={loading} size="small" className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600" />
                    </div>
                </div>

                {/* TABLA DE RESULTADOS - MEJORADA VISUALMENTE */}
                {results.length > 0 || results.length === 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <DataTable
                            value={results}
                            loading={loading}
                            responsiveLayout='scroll'
                            emptyMessage='No se encontraron radicados con los filtros seleccionados.'
                            className='p-datatable-sm'
                            stripedRows
                            rowHover
                            showGridlines={false}
                        >
                            <Column field='filing_number' header='Radicado' body={filingNumberTemplate} style={{ minWidth: '8rem' }}/>
                            <Column field='status' header='Estado' body={filinEstado} style={{ minWidth: '8rem' }}/>
                            
                            <Column header='Remitente' style={{ minWidth: '12rem' }}
                                body={(rowData) => (
                                    <span className="text-gray-700 font-medium">
                                        {`${rowData.name_social_reason_sender || ''} ${rowData.first_surname_legal_representative_sender || ''}`.trim()}
                                    </span>
                                )}
                            />

                            <Column field='subject' header='Asunto' style={{ minWidth: '10rem' }}
                                body={(rowData) => {
                                    const text = rowData.subject || '';
                                    const truncatedText = text.length > 20 ? text.substring(0, 20) + '...' : text;
                                    return (
                                        <span title={text} className="cursor-help border-b border-dashed border-gray-400 text-gray-600">
                                            {truncatedText}
                                        </span>
                                    );
                                }}
                            />

                            <Column header='Fecha' body={(rowData) => <span className="text-gray-600 text-sm">{formatDate(rowData.created_at, current_language)}</span>} style={{ minWidth: '8rem' }}/>
                            <Column header='Prioridad' body={statusBodyTemplate} align="center" style={{ minWidth: '8rem' }}/>
                            
                            <Column header='Funcionario' style={{ minWidth: '10rem' }}
                                body={(rowData) => <span className="text-gray-600 text-sm">{`${rowData.official?.persona?.nombre || 'N/A'} ${rowData.official?.persona?.apellido || ''}`.trim()}</span>}
                            />

                            <Column header='Dependencia' body={(rowData) => <span className="text-gray-600 text-sm">{rowData.dependency?.name || 'N/A'}</span>} style={{ minWidth: '10rem' }}/>
                            <Column header='Acciones' body={AccionesSolicitudes} align="center" style={{ minWidth: '6rem' }}/>
                        </DataTable>

                        {pagination.totalRecords > 0 && (
                            <Paginator
                                first={pagination.first}
                                rows={pagination.rows}
                                totalRecords={pagination.totalRecords}
                                onPageChange={handlePageChange}
                                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                template='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} radicados"
                                className="border-t border-gray-200 bg-gray-50"
                            />
                        )}
                    </div>
                ) : null}
            </Card>

            <FilingPreviewDialog
                visible={previewDialog}
                onHide={() => setPreviewDialog(false)}
                filing={selectedFiling}
                onArchive={handleOpenIncludeDialog}
                canArchive={isFilingFinished(selectedFiling)}
            />

            <ExtensionOfTime
                visible={dialogConfig.visible}
                onHide={() => setDialogConfig({ ...dialogConfig, visible: false })}
                filingId={dialogConfig.id}
                type={dialogConfig.type}
                header={dialogConfig.header}
            />
            <IncludeExpFiles
                visible={includeDialog}
                onHide={() => setIncludeDialog(false)}
                filing={selectedFiling}
                archiveClasification={archiveClasification}
                dependencies={dependencies}
                onFinish={() => {
                    setIncludeDialog(false);
                }}
            />

        </div>
    );
}