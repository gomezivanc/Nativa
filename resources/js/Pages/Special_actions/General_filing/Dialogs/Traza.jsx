import { usePage } from "@inertiajs/react";
import { Timeline } from "primereact/timeline";
import { useState } from "react";
import { formatDate } from "../../../../hooks/useDate";
import { Dialog } from 'primereact/dialog';

function Traza({ logs, dependency, official }) {
    const { current_language } = usePage().props;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    
    const processedLogs = preprocessLogs(logs);

    const openModal = (content) => {
        setModalContent(content);
        setModalVisible(true);
    };

    // Marcador minimalista y moderno
    const customizedMarker = (item) => (
        <span className="flex w-8 h-8 items-center justify-center text-white rounded-full shadow-lg border-2 border-white ring-1 ring-gray-200 shrink-0" 
              style={{ backgroundColor: item.color || '#6366f1' }}>
            <i className={`pi ${item.icon || 'pi-circle-fill'} text-xs`}></i>
        </span>
    );

    // Contenido estilo "Activity Feed"
    const customizedContent = (item) => (
        <div className="mb-8 ml-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-gray-800 text-sm m-0">
                    {item['action_' + current_language]}
                </h4>
                <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase italic">
                    {formatDate(item.created_at, true)}
                </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-blue-200 transition-colors">
                {/* Usuario y Dependencia Badge */}
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                        <i className="pi pi-user text-[9px]"></i>
                        {item.creador?.persona ? `${item.creador.persona.nombre}` : item.creador?.usuario || 'Sistema'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-tight">
                        <i className="pi pi-building text-[9px]"></i>
                        {item.creador?.dependency?.name || 'N/A'}
                    </span>
                </div>

                {/* Descripción / Observación */}
                <p className="text-gray-600 text-sm leading-relaxed m-0">
                    {item['description_' + current_language]}
                </p>

                {/* Nota Extra si existe */}
                {item.extraObservation && (
                    <button
                        onClick={() => openModal(item.extraObservation.description)}
                        className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-100 transition-all"
                    >
                        <i className="pi pi-comment"></i>
                        VER NOTA DE OBSERVACIÓN
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="traza-container max-w-4xl mx-auto">
                <Timeline
                    value={Array.isArray(processedLogs) ? processedLogs : []}
                    align="left"
                    marker={customizedMarker}
                    content={customizedContent}
                    className="custom-timeline"
                />
            </div>

            <Dialog
                header={<div className="flex items-center gap-2 text-orange-600"><i className="pi pi-comment"></i><span>Nota de Observación</span></div>}
                visible={modalVisible}
                style={{ width: '90%', maxWidth: '450px' }}
                onHide={() => setModalVisible(false)}
                draggable={false}
                resizable={false}
                className="rounded-xl overflow-hidden"
            >
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                    <p className="text-gray-700 leading-relaxed m-0 whitespace-pre-wrap">{modalContent}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => setModalVisible(false)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold"
                    >
                        Entendido
                    </button>
                </div>
            </Dialog>

            <style>{`
                .custom-timeline .p-timeline-event-opposite {
                    display: none;
                }
                .custom-timeline .p-timeline-event-content {
                    padding-left: 1.5rem !important;
                }
                .custom-timeline .p-timeline-event-separator {
                    flex: 0;
                }
                .custom-timeline .p-timeline-event-connector {
                    background-color: #e5e7eb;
                    width: 2px;
                }
            `}</style>
        </>
    );
}

// Mantenemos tu lógica de pre-procesamiento intacta
const preprocessLogs = (logs) => {
    if (!Array.isArray(logs)) return [];
    let processedLogs = [...logs];
    processedLogs.forEach((item) => {
        if (item.action_es === "Nota de Observacion") {
            const despacho = processedLogs.find(
                (d) => d.action_es === "Despacho a funcionario" && d.created_at === item.created_at
            );
            if (despacho) {
                despacho.extraObservation = {
                    description: item.description_es,
                    user: item.creador,
                };
            }
        }
    });
    return processedLogs.filter(item => item.action_es !== "Nota de Observacion");
};

export default Traza;