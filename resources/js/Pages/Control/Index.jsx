import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Link, usePage } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast'
import { BreadCrumb } from 'primereact/breadcrumb'
import axios from 'axios'
import { toast } from 'react-toastify'
import SolicitudDialog from './Dialogs/SolicitudDialog'
import { comma } from 'postcss/lib/list'

export default function Index() {
    const { translations } = usePage()?.props
    const toastRef = useRef(null)
    
    // Estados
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("ampliacion");
    const [AData, setAData] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [currentActionType, setCurrentActionType] = useState(null);

    const [tablesData, setTablesData] = useState({
        ampliacion: { data: [], page: 1, lastPage: 0, total: 0 },
        reasignacion: { data: [], page: 1, lastPage: 0, total: 0 },
        desbloqueo: { data: [], page: 1, lastPage: 0, total: 0 },
        reabrir: { data: [], page: 1, lastPage: 0, total: 0 },
    });

    async function getData(page = 1) {
        setLoading(true);
        try {
            const res = await axios.get(route('controler.list'), {
                params: {
                    page,
                    perPage: 10,
                    tipo: tipoMap[activeTab]
                }
            });

            setTablesData(prev => ({
                ...prev,
                [activeTab]: {
                    data: res.data.data,
                    page: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total
                }
            }));

        } catch (error) {
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    }

    const openProcessDialog = (rowData) => {
        setSelectedSolicitud(rowData);
        setCurrentActionType(tipoMap[activeTab]);
        setDialogVisible(true);
    };

    const handlePageChange = (e) => {
        getData(e.page + 1);
    };

    const currentData = tablesData[activeTab];

    useEffect(() => {
        if (tablesData[activeTab].data.length === 0) {
            getData(1);
        }
    }, [activeTab]);

    // --- ACCIONES DE APROBAR / DENEGAR ---
    const handleApprove = (rowData) => {
        openProcessDialog(rowData);
    };

    const handleDeny = async (rowData) => {

        const result = await Swal.fire({
            title: '¿Denegar solicitud?',
            text: 'Por favor, escribe una observación.',
            icon: 'warning',

            input: 'textarea',
            inputPlaceholder: 'Escribe la observación...',
            inputAttributes: {
                'aria-label': 'Observación'
            },

            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',

            confirmButtonText: 'Sí, Denegar',
            cancelButtonText: 'Cancelar',

            inputValidator: (value) => {
                if (!value) {
                    return 'Debes escribir una observación';
                }
            }
        });
        if (!result.isConfirmed) return;
        try {
            const response = await axios.post(
                route('controler.negarSolicitud'),
                {
                    id: rowData.id,
                    observation: result.value,
                    type: rowData.tipo,
                    id_filing: rowData.filing.id
                }
            );

            if (response.data.success) {
                toast.success('Solicitud procesada correctamente');
                await getData(currentData.page);
            } else {
                toast.error(
                    response.data.message || 'Error al procesar'
                );
            }
        } catch (error) {
            console.error("DEBUG ERROR:", error); // Mira si el error es de Axios o de JS
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Error de servidor');
            } else {
                console.error("Error lógico en JS:", error.message);
            }
        }
    };

    const getPriorityBadge = (rowData) => {

        const hoy = new Date();
        const fechaExpiracion = new Date(rowData.filing.expiration_date);

        const tiempoRestante = fechaExpiracion - hoy;
        const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));
        let label = `${diasRestantes}`;

        return (
            <div>{label}</div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button 
                    icon="pi pi-check" 
                    rounded outlined 
                    severity="success" 
                    tooltip="Aprobar" 
                    onClick={() => handleApprove(rowData)} 
                />
                <Button 
                    icon="pi pi-times" 
                    rounded outlined 
                    severity="danger" 
                    tooltip="Denegar" 
                    onClick={() => handleDeny(rowData)} 
                />
            </div>
        );
    };

    const tipoMap = {
        ampliacion: 1,
        reasignacion: 2,
        reabrir: 3,
        desbloqueo: 4
    };

    const items = [{ label: translations?.menu?.navbar?.administration || 'Administración' }, { label: 'Gestión de Solicitudes' }];

    return (
        <div className="flex flex-col gap-4 p-4 lg:p-6 bg-slate-50 min-h-screen">
            <Toast ref={toastRef} />
            <BreadCrumb model={items} className="border-none bg-transparent p-0 mb-2" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header y Pestañas */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 px-4 pt-4 gap-4">
                    <Link>
                        <Button label={translations?.auth?.back || 'Volver'} icon="pi pi-arrow-left" size="small" outlined className="mb-2 md:mb-0" />
                    </Link>

                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center overflow-x-auto w-full md:w-auto">
                        {['ampliacion', 'reasignacion', 'desbloqueo', 'reabrir'].map((tabKey) => {
                            const labels = {
                                'ampliacion': 'Ampliación de tiempo',
                                'reasignacion': 'Reasignación',
                                'desbloqueo': 'Desbloqueo',
                                'reabrir': 'Reabrir Radicados'
                            };
                            return (
                                <li className="mr-2 whitespace-nowrap" key={tabKey}>
                                    <button
                                        onClick={() => setActiveTab(tabKey)}
                                        className={`inline-flex p-4 border-b-2 rounded-t-lg transition-colors ${
                                            activeTab === tabKey
                                                ? "text-blue-600 border-blue-600 bg-blue-50/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {labels[tabKey]}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Contenido de las Pestañas (Tablas) */}
                <div className="p-4">
                    {activeTab === "ampliacion" && (  //muestar solo datos tipo 1
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Solicitudes de Ampliación de Tiempo</h2>
                            <DataTable value={currentData.data} totalRecords={currentData.total} first={(currentData.page - 1) * 10}
                                paginator rows={10} onPage={handlePageChange} loading={loading} emptyMessage="No hay solicitudes pendientes."
                            >
                                <Column field="filing.filing_number" header="Numero de radicado"/>
                                <Column field={getPriorityBadge} header="Dias Actuales"/>
                                <Column field="official.usuario" header="Usuario Solicitante" />
                                <Column field="observation" header="Motivo de Ampliación"  />
                                <Column body={actionBodyTemplate} header="Acciones" />
                            </DataTable>
                        </div>
                    )}

                    {activeTab === "reasignacion" && ( //muestar solo datos tipo 2
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Solicitudes de Reasignación</h2>
                            <DataTable value={currentData.data} totalRecords={currentData.total} first={(currentData.page - 1) * 10}
                                paginator rows={10} onPage={handlePageChange} loading={loading} emptyMessage="No hay solicitudes de reasignación."
                            >
                                <Column field="filing.filing_number" header="Numero de radicado"/>
                                <Column field="filing.official.usuario" header="Usuario Actual" />
                                <Column field="filing.dependency.name" header="Dependencia Actual" />
                                <Column field="observation" header="Justificación" />
                                <Column body={actionBodyTemplate} header="Acciones" align="center" />
                            </DataTable>
                        </div>
                    )}

                    {activeTab === "desbloqueo" && (  //muestar solo datos tipo 4
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Solicitudes de Desbloqueo de Usuarios</h2>
                            <DataTable value={currentData.data} totalRecords={currentData.total} first={(currentData.page - 1) * 10}
                                paginator rows={10} onPage={handlePageChange} loading={loading} emptyMessage="No hay usuarios pendientes de desbloqueo." 
                            >
                                <Column field="filing.filing_number" header="Numero de radicado"/> 
                                <Column field="filing.dependency.name" header="Dependencia" />
                                <Column field="observation" header="Motivo de Bloqueo / Solicitud" />
                                <Column body={actionBodyTemplate} header="Acciones" align="center" />
                            </DataTable>
                        </div>
                    )}

                    {activeTab === "reabrir" && ( //muestar solo datos tipo 3
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Solicitudes para Reabrir Radicados</h2>
                            <DataTable
                                value={currentData.data}
                                totalRecords={currentData.total}
                                first={(currentData.page - 1) * 10}
                                paginator
                                rows={10}
                                onPage={handlePageChange}
                                loading={loading}
                                emptyMessage="No hay solicitudes para reabrir radicados."
                            >
                                <Column field="filing.filing_number" header="Numero de radicado"/>
                                <Column field="official.usuario" header="Usuario Solicitante" />
                                <Column field="observation" header="Motivo de Reapertura" />
                                <Column body={actionBodyTemplate} header="Acciones" align="center" />
                            </DataTable>
                        </div>
                    )}
                </div>
                <SolicitudDialog 
                    visible={dialogVisible}
                    onHide={() => setDialogVisible(false)}
                    solicitud={selectedSolicitud}
                    actionType={currentActionType}
                    onSuccess={() => {
                        getData(currentData.page);
                        setDialogVisible(false);
                    }}
                />
            </div>
        </div>
    )
}