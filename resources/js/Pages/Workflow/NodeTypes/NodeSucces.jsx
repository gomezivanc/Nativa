import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useState } from "react";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";
import { useLoading } from "../../../Context/preloadContext";
import { formatDate } from '../../../hooks/useDate'
import { Dialog } from "primereact/dialog";

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
                className="cursor-pointer flex flex-col items-center justify-center text-center shadow-md transition-shadow hover:shadow-lg"
                style={{
                    padding: "10px",
                    background: "#ffffff",
                    color: "#1e293b",
                    borderRadius: "10px",
                    border: "2px solid #10b981",
                    fontSize: "12px",
                    width: "130px",
                    minHeight: "56px",
                    boxShadow: '0 2px 8px rgba(16,185,129,0.12)',
                }}
            >
                <Handle type="target" position={Position.Top} id="target" style={{ background: '#10b981', width: 7, height: 7 }} />
                <Handle type="source" position={Position.Left} id="left" style={{ background: '#10b981', width: 7, height: 7 }} />
                <Handle type="source" position={Position.Right} id="right" style={{ background: '#10b981', width: 7, height: 7 }} />
                <strong className="leading-tight">{data.label}</strong>
                <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#10b981', width: 7, height: 7 }} />
                {data.current_node && (
                    <span className="text-red-700 text-[10px] font-semibold whitespace-nowrap border-b border-red-700 mt-1">
                        {translations.workflow.workflow_standart.current}
                    </span>
                )}
            </div>
            <NodeToolbar isVisible={visible} position="bottom">
                {(!data.no_actions || data.no_actions !== true) && (
                    <div
                        className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-50"
                        onClick={() => deleteNode()}
                    >
                        <i className="pi pi-trash text-red-600" />
                    </div>
                )}
                {data.infos && (
                    <div
                        className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-50"
                        onClick={() => setInfoModal(true)}
                    >
                        <i className="pi pi-box text-amber-500" />
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
                className="dark"
            >
                <div className="overflow-hidden rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full border-collapse bg-white dark:bg-slate-900">
                        <thead className="bg-ibg-900 text-white">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">{translations.workflow.workflow_standart.table.observation}</th>
                                <th className="p-3 text-left text-sm font-semibold">
                                    {translations.workflow.workflow_standart.table.created_at}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.infos.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`border-b border-slate-100 dark:border-slate-800 ${
                                        index % 2 === 0
                                            ? "bg-slate-50 dark:bg-slate-800"
                                            : "bg-white dark:bg-slate-900"
                                    } hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
                                >
                                    <td
                                        className={`p-3 font-semibold text-sm ${
                                            item.is_devolution
                                                ? "text-red-500"
                                                : "text-slate-700 dark:text-slate-200"
                                        }`}
                                    >
                                        {item.observation}
                                    </td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400 text-sm">
                                        {formatDate(item.created_at, true)}
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
