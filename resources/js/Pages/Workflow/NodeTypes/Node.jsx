import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { DecisionNode } from "./ConditionalNode";
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";
import { useLoading } from "../../../Context/preloadContext";

export const FlowNode = ({ data }) => {
    const [visible, setVisible] = useState(false);
    const { translations } = usePage()?.props;
    const { setIsLoading } = useLoading();

    async function deleteNode() {
        setIsLoading(true);
        const res = await axios.delete(route('workflow.deleteNode', data.id));
        router.visit(route('workflow.node', data.wk_id), {
            onFinish: () => setIsLoading(false)
        });
    }

    return (
        <div onClick={(e) => setVisible(!visible)}>
            <div
                className="cursor-pointer flex flex-col items-center justify-center text-center shadow-md transition-shadow hover:shadow-lg"
                style={{
                    padding: "10px",
                    background: "#ffffff",
                    color: "#1e293b",
                    borderRadius: "10px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "12px",
                    width: "130px",
                    minHeight: "56px",
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
            >
                <Handle type="target" position={Position.Top} id="target" style={{ background: '#3c648b', width: 7, height: 7 }} />
                <Handle type="source" position={Position.Left} id="left" style={{ background: '#3c648b', width: 7, height: 7 }} />
                <Handle type="source" position={Position.Right} id="right" style={{ background: '#3c648b', width: 7, height: 7 }} />
                <strong className="leading-tight">{data.label}</strong>
                <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#3c648b', width: 7, height: 7 }} />
                {data.current_node && (
                    <span className="text-red-700 text-[10px] font-semibold whitespace-nowrap border-b border-red-700 mt-1">
                        {translations.workflow.workflow_standart.current}
                    </span>
                )}
            </div>

            <NodeToolbar isVisible={visible} position="bottom">
                {(!data.no_actions || data.no_actions !== true) &&
                    <div
                        className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-50"
                        onClick={() => deleteNode()}
                    >
                        <i className="pi pi-trash text-red-600" />
                    </div>
                }
                {data.infos &&
                    <div className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-50">
                        <i className="pi pi-box text-ibg-600" />
                    </div>
                }
            </NodeToolbar>
        </div>
    );
};
