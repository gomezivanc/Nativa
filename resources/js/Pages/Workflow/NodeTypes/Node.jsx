import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { DecisionNode } from "./ConditionalNode";
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";
import { useLoading } from "../../../Context/preloadContext";
// 🔹 Estilo para el nodo estándar de diagrama de flujo
const flowNodeStyle = {
    padding: "10px",
    background: "#F4D03F", // Amarillo
    color: "#000",
    borderRadius: "5px",
    border: "2px solid #B7950B",
    textAlign: "center",
    fontSize: "12px",
    width: "120px",
};

// 🔹 Nodo de Flujo General
export const FlowNode = ({ data }) => {
    const [visible,setVisible] = useState(false)
    const { translations } = usePage()?.props
    const { setIsLoading } = useLoading();

    async function deleteNode() {
        setIsLoading(true)
        const res = await axios.delete(route('workflow.deleteNode',data.id))
        router.visit(route('workflow.node',data.wk_id),{
            onFinish: () => setIsLoading(false)
        })
    }

    return (
        <div onClick={(e) => setVisible(!visible)} >
            <div style={flowNodeStyle} className="cursor-pointer">
                {/* Entrada arriba */}
                <Handle type="target" position={Position.Top} id="target" />
                <Handle type="source" position={Position.Left} id="left" />
                <Handle type="source" position={Position.Right} id="right" />
                <strong>{data.label}</strong>
                {/* Salida abajo */}
                <Handle type="source" position={Position.Bottom} id="bottom" />
                <br />
                {
                    data.current_node && <span className="text-red-800 text-nowrap border-b-2 border-b-red-800">{ translations.workflow.workflow_standart.current }</span>
                }
            </div>
            
                
            <NodeToolbar isVisible={visible} position="bottom" >
                {
                    (!data.no_actions || data.no_actions !== true) &&     
                    <div className="flex gap-2 bg-white p-2 border shadow-md cursor-pointer" onClick={() => deleteNode()}>
                        <i className="pi pi-trash text-red-700 " />
                    </div>
                }  
                {
                    data.infos &&     
                    <div className="flex gap-2 bg-white p-2 border shadow-md cursor-pointer" >
                        <i className="pi pi-box text-red-700" />
                    </div>
                }  
            </NodeToolbar>
                
            
        </div>
    );
};


