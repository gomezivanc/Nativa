<?php

use App\Http\Controllers\ChargeDocFilingController;
use App\Http\Controllers\FilingController;
use App\Http\Controllers\WorkflowController;
use App\Models\ChargeDocFiling;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::resource('workflow/workflow', WorkflowController::class);
    Route::get('workflow/workflow-list', [WorkflowController::class,'list'])->name('workflow.list');
    Route::get('workflow/workflow-export', [WorkflowController::class,'export'])->name('workflow.export');
    Route::get('workflow/workflow-node-export/{workflow}', [WorkflowController::class,'exportNodes'])->name('workflow.exportNodes');
    Route::get('workflow/workflow-node/{workflow}', [WorkflowController::class,'node'])->name('workflow.node');
    Route::get('workflow/get-nodes-workflows/{workflow}', [WorkflowController::class,'getNodesWorkflows'])->name('workflow.getNodesWorkflows');
    Route::post('workflow/store-node', [WorkflowController::class,'storeNode'])->name('workflow.storeNode');
    Route::delete('workflow/node/{workflowNodes}', [WorkflowController::class,'deleteNode'])->name('workflow.deleteNode');
    Route::get('workflow/workflow-node-copy/{workflow}', [WorkflowController::class,'copyWorkflow'])->name('workflow.copyWorkflow');
});
