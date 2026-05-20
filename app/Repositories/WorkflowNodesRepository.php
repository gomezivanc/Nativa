<?php

namespace App\Repositories;

use App\Models\Workflow;
use App\Models\WorkflowNodes;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class WorkflowNodesRepository extends BaseRepository
{
    public function __construct(WorkflowNodes $modelo, private WorkflowEdgesRepository $workflowEdgesRepository)
    {
        parent::__construct($modelo);
    }

    public function list($request = [], $with = [], $withCount = [], $select = ['*'], $idsIsNotAllowed = [], $roleIdsIsNotAllowed = []): array|Collection|LengthAwarePaginator
    {
        $data = $this->model->select($select)
            ->with($with)
            ->withCount($withCount)
            ->where(function ($query) use ($request) {
                if (!empty($request['name'])) {
                    $query->where('name', 'like', '%' . $request['name'] . '%');
                }
                if (!empty($request['created_at_init'])) {
                    $query->orWhere('created_at', '>=', $request['created_at_init']);
                }
                if (!empty($request['created_at_end'])) {
                    $query->orWhere('created_at', '<=', $request['created_at_end']);
                }
            });

        if (!empty($request['active'])) {
            if ($request['active'] == "false") {
                $data->onlyTrashed();
            }
        }

        if (empty($request['typeData'])) {
            $data = $data->paginate($request['perPage'] ?? 10);
        } else {
            $data = $data->get();
        }

        return $data;
    }

    public function calculateAndSavePositions(Workflow $workflow)
    {
        $nodes = $workflow->nodes;

        $ignoreIds = [];
        $nextSpace = 0;

        foreach ($nodes as $key => $node) {
            if (in_array($node->id, $ignoreIds)) {
                continue;
            }

            // Buscar si el nodo es un punto de decisión (tiene condicionales)
            $nodeCon = $nodes->where('is_parallel_flow', 1)->where('last_node', $node->id)->first();

            if (!empty($nodeCon)) {
                // Asegurar espacio para bifurcaciones
                $last_node = $nodeCon->lastNode;
                $nodeCon->node_data = [
                    ...$nodeCon->node_data,
                    'position' => [
                        'y' => $last_node->node_data['position']['y'],
                        'x' => $last_node->node_data['position']['x'] + 350,
                    ]
                ];
                $ignoreIds[] = $nodeCon->id;
                $nodeCon->save();

                // Encontrar nodos condicionales
                $case_yes = $nodes
                    ->where('conditional_true', 1)
                    ->where('last_node', $nodeCon->id)
                    ->where('conditional_true_yes', 1);

                $case_no = $nodes
                    ->where('conditional_true', 1)
                    ->where('last_node', $nodeCon->id)
                    ->reject(fn($node) => $node->conditional_true_yes == 1);
                // Organizar nodos condicionales
                foreach ($case_no as $index => $value) {
                    $val = 0;
                    if($index == $case_no->keys()->first()) {
                        $val = 80;
                    }
                    $last_node = $value->lastNodeConditional;
                    $node_data = [
                        ...$value->node_data,
                        'position' => [
                            'y' => $last_node->node_data['position']['y'] + 80,
                            'x' => $last_node->node_data['position']['x'] - $val,
                        ]
                    ];
                    $value->node_data = $node_data;
                    $value->save();
                    $ignoreIds[] = $value->id;
                }

                foreach ($case_yes as $index => $value) {
                    $val = 0;
                    if($index == $case_yes->keys()->first()) {
                        $val = 80;
                    }
                    $last_node = $value->lastNodeConditional;
                    $node_data = [
                        ...$value->node_data,
                        'position' => [
                            'y' => $last_node->node_data['position']['y'] + 80,
                            'x' => $last_node->node_data['position']['x'] + $val,
                        ]
                    ];
                    $value->node_data = $node_data;
                    $value->save();
                    $ignoreIds[] = $value->id;
                }

                continue;
            }

            // Si el nodo es lineal, lo ubicamos debajo del anterior
            $last_node = $node->lastNode;
            if ($last_node) {
                $node_data = [
                    ...$node->node_data,
                    'position' => [
                        'y' => $last_node->node_data['position']['y'] + 120 + $nextSpace,
                        'x' => $last_node->node_data['position']['x'],
                    ]
                ];
                $node->node_data = $node_data;
                $node->save();
            }
            $nextSpace = 0;
        }

        $this->assignEdges($nodes,$workflow);
    }

    /**
     * @param Collection $nodes
     * @param Workflow $workflow
     */
    private function assignEdges($nodes,$workflow) {
        $workflow->edges()->where('edge_data->no_delete_masive',false)->delete();
        foreach ($nodes as $key => $nd) {
            if(empty($nd->last_node)) {
                continue;
            }
            if($nd->node_data['no_edge'] ?? false) {
                continue;
            }
            if($nd->is_parallel_flow == 1) {
                $this->workflowEdgesRepository->storeGeneral([
                    'workflow_id' => $workflow->id,
                    'node_id' => $nd->lastNode->id,
                    'second_node_id' => $nd->id,
                    'edge_data' => [ 'id' => "node_{$nd->lastNode->id}-node_{$nd->id}", 'source' => "node_".$nd->lastNode->id, 'sourceHandle' => 'right','target' => "node_".$nd->id ]
                ]);
                continue;
            }
            if($nd->conditional_true == 1) {
                $first_true = $nodes->where('last_node',$nd->last_node)->where('conditional_true_yes',1)->first();
                $first_false = $nodes->where('last_node',$nd->last_node)->reject(function ($i) {
                    return $i->conditional_true_yes == 1;
                })->first();
                if($nd->conditional_true_yes == 1 && $first_true->id == $nd->id) {
                    $this->workflowEdgesRepository->storeGeneral([
                        'workflow_id' => $workflow->id,
                        'node_id' => $nd->conditional_wf_node_id,
                        'second_node_id' => $nd->id,
                        'edge_data' => [ 'id' => "node_{$nd->conditional_wf_node_id}-node_{$nd->id}",'source' => "node_".$nd->conditional_wf_node_id, 'sourceHandle' => 'yes','target' => "node_".$nd->id, 'label' => 'Si']
                    ]);
                    continue;
                } else if($first_false->id == $nd->id) {
                    $this->workflowEdgesRepository->storeGeneral([
                        'workflow_id' => $workflow->id,
                        'node_id' => $nd->conditional_wf_node_id,
                        'second_node_id' => $nd->id,
                        'edge_data' => [ 'id' => "node_{$nd->conditional_wf_node_id}-node_{$nd->id}", 'source' => "node_".$nd->conditional_wf_node_id, 'sourceHandle' => 'no','target' => "node_".$nd->id, 'label' => 'No']
                    ]);
                    continue;
                }
                if($nd->conditional_true_yes == 1) {
                    $this->workflowEdgesRepository->storeGeneral([
                        'workflow_id' => $workflow->id,
                        'node_id' => $nd->conditional_wf_node_id,
                        'second_node_id' => $nd->id,
                        'edge_data' => [ 'id' => "node_{$nd->conditional_wf_node_id}-node_{$nd->id}",'source' => "node_".$nd->conditional_wf_node_id,'target' => "node_".$nd->id]
                    ]);
                    continue;
                } else {
                    $this->workflowEdgesRepository->storeGeneral([
                        'workflow_id' => $workflow->id,
                        'node_id' => $nd->conditional_wf_node_id,
                        'second_node_id' => $nd->id,
                        'edge_data' => [ 'id' => "node_{$nd->conditional_wf_node_id}-node_{$nd->id}", 'source' => "node_".$nd->conditional_wf_node_id,'target' => "node_".$nd->id]
                    ]);
                    continue;
                }
            }
            $this->workflowEdgesRepository->storeGeneral([
                'workflow_id' => $workflow->id,
                'node_id' => $nd->lastNode->id,
                'second_node_id' => $nd->id,
                'edge_data' => [ 'id' => "node_{$nd->lastNode->id}-node_{$nd->id}", 'source' => "node_".$nd->lastNode->id, 'sourceHandle' => 'bottom','target' => "node_".$nd->id ]
            ]);
        }

    }
}
