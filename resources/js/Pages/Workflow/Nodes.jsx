import React, { useCallback, useEffect, useState } from "react";
import {
    Background,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
} from "@xyflow/react";
import { nodeTypes } from "./NodeTypes/StartNode";
import "@xyflow/react/dist/style.css";
import { Card } from 'primereact/card';
import CreateNode from "./Dialogs/CreateNode";
import { Button } from "primereact/button";
import { Link, usePage } from "@inertiajs/react";

const hide = (hidden) => (nodeOrEdge) => {
    return {
        ...nodeOrEdge,
        hidden,
    };
};

export default function Nodes({ className, nodes: nodesWorkflow, edges: edgesWorkflow, notEditable = false }) {
    const { translations, workflow } = usePage()?.props;

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains('dark'));
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const initialNodes = [
        {
            id: "start",
            type: "startEndNode",
            data: { label: translations.auth.start_end.start, isStart: true },
            position: { x: 250, y: 50 },
        },
    ];
    const initialEdges = [
        { id: "start-end", source: "start", target: "end" }
    ];

    const [visible, setVisible] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [hidden, setHidden] = useState(false);

    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.menu.options_speed_dial.add,
            icon: "pi pi-plus",
            command: () => {
                setVisible(true)
            },
        },
    ]);

    const onConnect = useCallback(
        (params) => setEdges((els) => addEdge(params, els)),
        []
    );

    function initFlow(e) {
        setReactFlowInstance(e);

        let nds = [...initialNodes, ...nodesWorkflow.map(nds => {
            return {
                ...nds.node_data,
                data: {
                    ...nds.node_data.data,
                    id: nds.id,
                    wk_id: nds.workflow_id
                }
            }
        })]
        let eds = edgesWorkflow.map(eds => eds.edge_data)
        let nodesOnyNormal = nodesWorkflow.filter(i => {
            return i.is_parallel_flow !== 1
        })
        let last_nd = nodesOnyNormal[nodesOnyNormal.length - 1]

        let position = { x: 250, y: 150 }

        if (last_nd !== undefined) {
            position = { x: last_nd.node_data.position.x + 40, y: last_nd.node_data.position.y + 150 }
        }

        nodesWorkflow.filter(nd => nd.is_finish).map(i => {
            let position = { x: i.node_data.position.x, y: i.node_data.position.y + 100 }

            nds.push({
                id: "end_" + i.node_data.id,
                type: "startEndNode",
                data: { label: translations.auth.start_end.end, isStart: false },
                position: position,
            })

            let new_edge = {
                id: `node_${i.node_data.id}-end`,
                source: i.node_data.id,
                target: "end_" + i.node_data.id,
                sourceHandle: "bottom"
            }
            eds.push(new_edge)
        })

        let first_nd = nodesWorkflow[0]

        if (first_nd) {
            let new_edge = {
                id: `start-node_${first_nd.node_data.id}`,
                source: 'start',
                target: `${first_nd.node_data.id}`,
            }
            eds.unshift(new_edge)
        }
        setNodes(nds);
        setEdges(eds);
        e.fitView()
    }

    const onNodeDrag = (event, node) => {
        console.log("Clicked node:", node);
    };

    useEffect(() => {
        if (reactFlowInstance && nodes.length > 0) {
            reactFlowInstance.fitView();
        }
    }, [reactFlowInstance, nodes]);

    const exportI = (type) => {
        axios.get(route('workflow.exportNodes', workflow.id), {
            params: { type: type },
            responseType: 'blob',
        })
        .then(response => {
            const fileName = response.headers['x-file-name'] || 'default.csv';
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error al exportar el archivo:', error);
        });
    };

    return (
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 h-full " + className}>
            {
                !notEditable &&
                <Card className="shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                    <Link href={route("workflow.index")}>
                        <Button label={translations.auth.back} className="w-full bg-ibg-900 hover:bg-ibg-950 text-white border-none" icon="pi pi-angle-left" />
                    </Link>
                    <CreateNode className="mt-4" />
                </Card>
            }
            <div className="w-full md:col-span-2">
                <div className="flex gap-2 w-full mb-3">
                    <Button onClick={() => exportI('csv')} size='small' label='CSV' className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700" />
                    <Button onClick={() => exportI('excel')} size='small' label='EXCEL' className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700" />
                    <Button onClick={() => exportI('pdf')} size='small' label='PDF' className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700" />
                    <Button onClick={() => exportI('pdf')} size='small' label={translations.auth.exports.print} className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700" />
                </div>
                <ReactFlow
                    onInit={(e) => initFlow(e)}
                    className={isDark ? 'dark' : ''}
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeDrag={onNodeDrag}
                    draggable
                    nodesDraggable
                    style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '1rem' }}
                >
                    <Controls />
                    <Background color={isDark ? '#334155' : '#cbd5e1'} gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
