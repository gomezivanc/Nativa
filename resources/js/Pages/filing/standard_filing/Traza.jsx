import { usePage } from "@inertiajs/react";
import { Timeline } from "primereact/timeline";
import { useState } from "react";
import { formatDate } from "../../../hooks/useDate";
import { Dialog } from 'primereact/dialog'

function Traza({ logs, dependency, official }) {
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [hoveredItem, setHoveredItem] = useState(null);
    const { current_language } = usePage().props;
    const processedLogs = preprocessLogs(logs);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const toggleExpand = (index) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const openModal = (content) => {
        setModalContent(content);
        setModalVisible(true);
    };

    return (
    <>
        <Timeline
            value={Array.isArray(processedLogs) ? processedLogs : []}
            align="left"
            marker={(item, index) => customizedMarker(item, index, setHoveredItem, hoveredItem, toggleExpand)}
            content={(item, index) =>
                customizedContent(item, index, setHoveredItem, hoveredItem, toggleExpand, expandedItems, dependency, official, openModal)
            }
        />

        <Dialog
            header="Nota de Observación"
            visible={modalVisible}
            style={{ width: '400px' }}
            modal
            onHide={() => setModalVisible(false)}
        >
            <p>{modalContent}</p>
        </Dialog>
    </>
    );


}

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


const customizedMarker = (item,index,setHoveredItem,hoveredItem,toggleExpand) => {
  return (
    <span
      className="relative flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-md transition-transform transform"
      style={{ backgroundColor: item.color }}
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => toggleExpand(index)}
    >
      <i className={"pi " + item.icon}></i>

      <span className="absolute -bottom-1 -right-1 bg-white text-gray-800 text-[10px] font-bold rounded-full px-1 shadow">
        {index + 1}
      </span>
    </span>
  );
};

const customizedContent = (item, index, setHoveredItem, hoveredItem, toggleExpand, expandedItems , dependency, official, openModal) => {
    const { current_language } = usePage().props;

    const isExpanded = expandedItems.has(index);
    const isHovered = hoveredItem === index;

    return (
        <>
        <div
            className="flex flex-col justify-end p-2 w-full cursor-pointer"
            onClick={() => toggleExpand(index)}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {/* Icono de clip si está anclado */}
            {isExpanded && (
                <span className="absolute top-0 right-0 text-gray-500">
                    <i className="fa fa-thumb-tack"></i>
                </span>
            )}

            {/* Título siempre visible */}
            <h3 className="text-md font-semibold text-gray-800">
                {item['action_' + current_language]}
            </h3>

            {/* Detalles visibles en hover o si está anclado */}
            <div
                className={`transition-all duration-300 ${
                    isExpanded || isHovered ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
                } overflow-hidden`}
            >
                <p className="text-xs text-gray-500">{formatDate(item.created_at, true)}</p>

                <p className="mt-1 text-gray-700 text-sm lowercase"><strong>Usuario: </strong>
                    {item.creador?.persona ? `${item.creador.persona.nombre}` : item.creador?.usuario}
                </p>

                <p className="mt-1 text-gray-700 text-sm lowercase"><strong>Dependencia: </strong>
                    {item.creador?.dependency?.name ? item.creador.dependency.name : item.creador?.usuario}
                </p>

                <p className="mt-1 text-gray-700 text-sm"><strong>Observacion: </strong>{item['description_' + current_language]}</p>


            </div>
            {item.extraObservation && (
                <div
                    className="mt-2 flex items-center gap-1 text-sm text-gray-600 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal(item.extraObservation.description);
                    }}
                >
                    <i className="pi pi-info-circle"></i>
                    <span>Nota de Observacion</span>
                </div>
            )}
        </div>

      </>  
    );

    
};

export default Traza;
