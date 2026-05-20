import { router, usePage } from "@inertiajs/react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useState } from "react";

// 🔹 Estilo del Nodo Condicional (Rombo)
const decisionNodeStyle = {
  background: "#F1C40F", // Amarillo
  color: "#000",
  borderRadius: "5px",
  border: "2px solid #B7950B",
  width: "40px",
  height: "40px",
  transform: "rotate(45deg)", // Rombo
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

// 🔹 Estilo del Texto (corrección de rotación)
const labelStyle = {
  transform: "rotate(-45deg)", // Corrige la orientación del texto
  textAlign: "center",
  fontSize: "6px",
  fontWeight: "bold",
  width: "10%",
  height: "10%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
};

// 🔹 Componente de Nodo Condicional
export const DecisionNode = ({ data }) => {
  const [visible,setVisible] = useState(false)
  const { translations } = usePage()?.props
  
  function deleteNode() {
    const res = axios.delete(route('workflow.deleteNode',data.id))
    router.visit(route('workflow.node',data.wk_id))
  }

  return (
    <div onClick={(e) => setVisible(!visible)}>
      <div style={decisionNodeStyle} >
        {/* Conector superior (Entrada) */}
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ top: "-5px", left: "50%", transform: "translateX(-50%) rotate(-45deg)" }} 
        />

        {/* Conector izquierdo (Salida "No") */}
        <Handle 
          type="source" 
          position={Position.Left} 
          id="left" 
          style={{ left: "-5px", top: "50%", transform: "translateY(-50%) rotate(-45deg)" }} 
        />

        {/* Conector derecho (Salida "Sí") */}
        <Handle 
          type="source" 
          position={Position.Right} 
          id="yes" 
          style={{ right: "-5px", top: "50%", transform: "translateY(-50%) rotate(-45deg)" }} 
        />

        {/* Conector inferior (Opcional, más conexiones) */}
        <Handle 
          type="source" 
          id="no"
          position={Position.Bottom} 
          style={{ bottom: "-5px", left: "50%", transform: "translateX(-50%) rotate(-45deg)" }} 
        />

        {/* Texto en el centro del nodo */}
        <div style={labelStyle}>{data.label}</div>
        <br />
        {
          data.current_node && <span className="text-red-800 text-nowrap border-b-2 border-b-red-800 mt-2 ml-2" style={labelStyle}>{ translations.workflow.workflow_standart.current }</span>
        }
      </div>
      <NodeToolbar isVisible={visible} position="bottom">
          <div className="flex gap-2 bg-white p-2 border shadow-md cursor-pointer"  onClick={() => deleteNode()}>
              <i className="pi pi-trash text-red-700 " />
          </div>
      </NodeToolbar>
    </div>
  );
};
