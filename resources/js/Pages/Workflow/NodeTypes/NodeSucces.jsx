import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { DecisionNode } from "./ConditionalNode";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";
import { useLoading } from "../../../Context/preloadContext";
import { formatDate } from '../../../hooks/useDate'
import { Dialog } from "primereact/dialog";
// 🔹 Estilo para el nodo estándar de diagrama de flujo
const flowNodeStyle = {
    padding: "10px",
    color: "#000",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "12px",
    width: "120px",
};

// 🔹 Nodo de Flujo General
export const FlowNodeSuccess = ({ data }) => {
    const [visible, setVisible] = useState(false);
    const { setIsLoading } = useLoading();
    const { translations } = usePage()?.props;
    const [infoModal, setInfoModal] = useState(false);

    async function deleteNode() {
        setIsLoading(true);
        const res = await axios.delete(route("workflow.deleteNode", data.id));
        router.visit(route("workflow.node", data.wk_id), {
            onFinish: () => setIsLoading(false),
        });
    }

    return (
        <div onClick={(e) => setVisible(!visible)}>
            <div
                style={flowNodeStyle}
                className="cursor-pointer bg-green-300 border-1 border-green-600"
            >
                {/* Entrada arriba */}
                <Handle type="target" position={Position.Top} id="target" />
                <Handle type="source" position={Position.Left} id="left" />
                <Handle type="source" position={Position.Right} id="right" />
                <strong>{data.label}</strong>
                {/* Salida abajo */}
                <Handle type="source" position={Position.Bottom} id="bottom" />
                <br />
                {data.current_node && (
                    <span className="text-red-800 text-nowrap border-b-2 border-b-red-800">
                        {translations.workflow.workflow_standart.current}
                    </span>
                )}
            </div>
            <NodeToolbar isVisible={visible} position="bottom">
                {(!data.no_actions || data.no_actions !== true) && (
                    <div
                        className="flex gap-2 bg-white p-2 border shadow-md cursor-pointer"
                        onClick={() => deleteNode()}
                    >
                        <i className="pi pi-trash text-red-700 " />
                    </div>
                )}
                {data.infos && (
                    <div
                        className="flex gap-2 bg-white p-2 border shadow-md cursor-pointer"
                        onClick={() => setInfoModal(true)}
                    >
                        <i className="pi pi-box text-yellow-600" />
                    </div>
                )}
            </NodeToolbar>

            <Dialog
                visible={infoModal}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!infoModal) return;
                    setInfoModal(false);
                }}
            >
                <div className="overflow-hidden rounded-lg shadow-lg">
                    <table className="w-full border-collapse bg-white">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-3 text-left">{translations.workflow.workflow_standart.table.observation}</th>
                                <th className="p-3 text-left">
                                    {translations.workflow.workflow_standart.table.created_at}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.infos.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`border-b ${
                                        index % 2 === 0
                                            ? "bg-gray-100"
                                            : "bg-gray-50"
                                    } hover:bg-gray-200`}
                                >
                                    <td
                                        className={`p-3 font-semibold ${
                                            item.is_devolution
                                                ? "text-red-500"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {item.observation}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {formatDate(item.created_at,true)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Dialog>
        </div>
    );
};
