import { router, usePage } from "@inertiajs/react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useState } from "react";

export const DecisionNode = ({ data }) => {
    const [visible, setVisible] = useState(false);
    const { translations } = usePage()?.props;

    function deleteNode() {
        const res = axios.delete(route('workflow.deleteNode', data.id));
        router.visit(route('workflow.node', data.wk_id));
    }

    return (
        <div onClick={(e) => setVisible(!visible)}>
            <div
                className="flex items-center justify-center relative shadow-md"
                style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff',
                    borderRadius: '6px',
                    border: '2px solid #b45309',
                    width: '44px',
                    height: '44px',
                    transform: 'rotate(45deg)',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
                }}
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{ top: "-5px", left: "50%", transform: "translateX(-50%) rotate(-45deg)", background: '#b45309', width: 7, height: 7 }}
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="left"
                    style={{ left: "-5px", top: "50%", transform: "translateY(-50%) rotate(-45deg)", background: '#b45309', width: 7, height: 7 }}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="yes"
                    style={{ right: "-5px", top: "50%", transform: "translateY(-50%) rotate(-45deg)", background: '#b45309', width: 7, height: 7 }}
                />
                <Handle
                    type="source"
                    id="no"
                    position={Position.Bottom}
                    style={{ bottom: "-5px", left: "50%", transform: "translateX(-50%) rotate(-45deg)", background: '#b45309', width: 7, height: 7 }}
                />
                <div
                    className="absolute text-center font-bold leading-none whitespace-nowrap"
                    style={{ transform: 'rotate(-45deg)', fontSize: '7px', width: '80px' }}
                >
                    {data.label}
                </div>
                {data.current_node && (
                    <span
                        className="absolute text-red-800 text-[8px] font-bold whitespace-nowrap border-b border-red-800"
                        style={{ transform: 'rotate(-45deg)', top: '28px' }}
                    >
                        {translations.workflow.workflow_standart.current}
                    </span>
                )}
            </div>
            <NodeToolbar isVisible={visible} position="bottom">
                <div
                    className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-50"
                    onClick={() => deleteNode()}
                >
                    <i className="pi pi-trash text-red-600" />
                </div>
            </NodeToolbar>
        </div>
    );
};
