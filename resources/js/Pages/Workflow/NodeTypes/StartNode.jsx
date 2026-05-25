import { Handle, Position } from "@xyflow/react";
import { DecisionNode } from "./ConditionalNode";
import { FlowNode } from "./Node";
import { FlowNodeSuccess } from "./NodeSucces";

// Nodo Start/End — forma ovalada con paleta moderna
const StartEndNode = ({ data }) => {
    const isStart = data.isStart;
    return (
        <div
            className="flex items-center justify-center text-center text-white text-[10px] font-bold shadow-lg"
            style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3c648b, #1e3a5f)',
                border: '2px solid #d4a843',
                boxShadow: '0 4px 14px rgba(30,58,95,0.35)',
            }}
        >
            {isStart ? (
                <Handle type="source" position={Position.Bottom} style={{ background: '#d4a843', width: 8, height: 8 }} />
            ) : (
                <Handle type="target" position={Position.Top} style={{ background: '#d4a843', width: 8, height: 8 }} />
            )}
            <span className="leading-tight px-1">{data.label}</span>
        </div>
    );
};

export const nodeTypes = {
    startEndNode: StartEndNode,
    decisionNode: DecisionNode,
    flowNode: FlowNode,
    flowNodeSucces: FlowNodeSuccess,
};
