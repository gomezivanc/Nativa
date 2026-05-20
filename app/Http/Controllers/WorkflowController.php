<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\WorkflowNodes;
use App\Repositories\WorkflowEdgesRepository;
use App\Repositories\WorkflowNodesRepository;
use App\Repositories\WorkflowRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    public function __construct(private WorkflowRepository $workflowRepository, private WorkflowNodesRepository $workflowNodesRepository, private WorkflowEdgesRepository $workflowEdgesRepository)
    {
    }

    function index(Request $request) {
        return Inertia::render("Workflow/Index",[
        ]);
    }

    function create(Request $request) {

        return Inertia::render("Workflow/Create");
    }

    // store - update
    function store(Request $request) {
        if(empty($request['id'])) {
            $request['creado_por_id'] = Auth::user()->id;
        }
        $data = $this->workflowRepository->storeGeneral($request->all());
        return response()->json($data);
    }

    function list(Request $request) {
        $data = $this->workflowRepository->list($request->all(),[]);
        return response()->json($data);
    }

    function edit(String $id) {
        return Inertia::render("Workflow/Create",compact('id'));
    }

    function show(String $id) {
        $object = $this->workflowRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id) {
        $object = $this->workflowRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request) {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->workflowRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at','updated_at','deleted_at','id']);
        }
        return $this->workflowRepository->export($type,$data->toArray(),'Excel.Export.generalExport','workflow.table');
    }

    function node(Workflow $workflow) {
        $nodes = $workflow->nodes;
        $edges = $workflow->edges;
        return Inertia::render('Workflow/Nodes',compact('workflow','nodes','edges'));
    }

    function getNodesWorkflows(Workflow $workflow) {
        return $workflow->nodes;
    }

    function storeNode(Request $request) {
        $node_ref = null;
        $none_node_red = false;

        if(empty($request['last_node'])) {
            $node_ref = $this->workflowNodesRepository->getModel()->where('workflow_id',$request->workflow_id)->latest()->first();
            if($node_ref?->is_parallel_flow == 1 || $node_ref?->conditional_true == 1) {
                $node_ref = $this->workflowNodesRepository->getModel()->where('is_parallel_flow',0)->where(function ($q) {
                    $q->whereNull('conditional_true')->orWhere('conditional_true',0);
                })->where('workflow_id',$request->workflow_id)->latest()->first();
                $none_node_red = true;
            }
        } else {
            $node_ref = $this->workflowNodesRepository->find($request->last_node);
        }
        $position = [ 'x' =>  210, 'y' => 150 ];
        $node_ref_last = null;
        if($request->conditional_true == 1) {
            $node_ref_last = $this->workflowNodesRepository->getModel()->where('workflow_id',$request->workflow_id)
                ->where('is_parallel_flow',0)->where('conditional_true',1)
                ->where('last_node',$request['last_node'])->where(function ($query) use($request) {
                    if($request['conditional_true_yes'] == 1) {
                        $query->where('conditional_true_yes',1);
                    } else {
                        $query->where('conditional_true_yes',0);
                        $query->orWhereNull('conditional_true_yes');
                    }
                })->latest()->first();
            if(empty($node_ref_last)) {
                $node_ref_last = $node_ref;
            }
        }
        if(!empty($request['next_node'])) {
            $this->workflowEdgesRepository->storeGeneral([
                'workflow_id' => $request->workflow_id,
                'node_id' => $node_ref_last?->id,
                'second_node_id' => $request['next_node'],
                'edge_data' => [
                    'id' => "node_{$node_ref_last?->id}-node_{$request['next_node']}", 'source' => "node_".$node_ref_last?->id,
                    'sourceHandle' => 'bottom','target' => "node_".$request['next_node'], 'no_delete_masive' => true ]
            ]);
            $data = $this->workflowNodesRepository->storeGeneral([
                'id' => $node_ref_last?->id,
                'next_node' => $request->next_node,
            ]);
            return response()->json();
        }

        $node = [
            'id' => $request->id,
            'node_data' => [],
            'workflow_id' => $request->workflow_id,
            'is_parallel_flow' => $request->is_parallel_flow ? $request->is_parallel_flow : 0,
            'text_conditional' => $request->text_conditional,
            'conditional_true_yes' => $request->conditional_true_yes,
            'conditional_true' => $request->conditional_true,
            'conditional_wf_node_id' => $node_ref_last?->id,
            'is_finish' => $request->is_finish ? $request->is_finish : 0,
            'last_node' => $node_ref?->id,
            'next_node' => $request->next_node,
        ];

        $data = $this->workflowNodesRepository->storeGeneral($node);
        $data->node_data = [
            'id' => "node_$data->id",
            'type' => $request->is_parallel_flow !== 1 ? "flowNode" : "decisionNode",
            'data' => [ 'label' => $request->name ],
            'position' => $position,
            'no_edge' => $none_node_red
        ];

        $data->save();

        $this->workflowNodesRepository->calculateAndSavePositions($data->workflow);
        return response()->json($data);
    }
    function calculateAndSavePositions(Workflow $workflow) {
        $this->workflowNodesRepository->calculateAndSavePositions($workflow);
    }

    function deleteNode(WorkflowNodes $workflowNodes) {
        $workflowNodes->edges_node()->delete();
        $workflowNodes->edges_node_second()->delete();
        $workflowNodes->delete();
        return response()->json();
    }

    function exportNodes(Workflow $workflow, Request $request) {
        $type = $request->type;
        $data = [];

        foreach ($workflow->nodes as $key => $nd) {
            $item = [
                'name' => $nd->node_data['data']['label'],
                'conditional_node' => $nd->conditional_node == 1 ? 'Si' : 'No',
                'conditional_true' => $nd->conditional_true == 1 ? 'Si' : 'No',
                'is_end' => $nd->is_finish == 1 ? 'Si' : 'No',
            ];

            $data[] = $item;
        }

        return $this->workflowRepository->export($type,$data,'Excel.Export.generalExport','workflow.form',"Nodos_{$workflow->id}");
    }

    function copyWorkflow(Workflow $workflow, Request $request) {
        DB::beginTransaction(); // Inicia una transacción para evitar datos inconsistentes

        try {
            // 1️⃣ Clonar el workflow sin ID
            $newWorkflow = $workflow->replicate();
            $newWorkflow->name = $workflow->name . ' (Copia)'; // Cambia algún campo para evitar duplicados
            $newWorkflow->save(); // Guarda el nuevo workflow

            // 2️⃣ Clonar los nodes
            foreach ($workflow->nodes as $node) {
                $newNode = $node->replicate();
                $newNode->workflow_id = $newWorkflow->id; // Asignar el nuevo workflow_id
                $newNode->save();
            }

            // 3️⃣ Clonar los edges
            foreach ($workflow->edges as $edge) {
                $newEdge = $edge->replicate();
                $newEdge->workflow_id = $newWorkflow->id; // Asignar el nuevo workflow_id
                $newEdge->save();
            }

            DB::commit(); // Confirma la transacción
            return response()->json(['message' => 'Workflow duplicado con éxito', 'workflow' => $newWorkflow]);

        } catch (\Exception $e) {
            DB::rollBack(); // Revierte cambios si hay error
            return response()->json(['error' => 'Error al duplicar el Workflow', 'message' => $e->getMessage()], 500);
        }
    }

}
