import { Handle, Position } from "@xyflow/react";
import { DecisionNode } from "./ConditionalNode";
import { FlowNode } from "./Node";
import { FlowNodeSuccess } from "./NodeSucces";

// 🔹 Estilo para nodos ovalados (Inicio y Fin)
const ovalNodeStyle = {
    padding: "10px",
    background: "#2E86C1", // Azul
    color: "#fff",
    borderRadius: "100%", // Hace que sea ovalado
    border: "2px solid #1B4F72",
    textAlign: "center",
    fontSize: "8px",
    width: "40px",
};

// 🔹 Componente de Nodo Personalizado
const StartEndNode = ({ data }) => {
    return (
        <div style={ovalNodeStyle}>
            {data.isStart ? (
                <Handle type="source" position={Position.Bottom} />
            ) : (
                <Handle type="target" position={Position.Top} />
            )}
            <strong>{data.label}</strong>
        </div>
    );
};

// 🔹 Registrar el nodo personalizado
export const nodeTypes = { 
    startEndNode: StartEndNode ,
    decisionNode: DecisionNode,
    flowNode: FlowNode,
    flowNodeSucces: FlowNodeSuccess,
};
