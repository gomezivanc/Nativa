<?php

use App\Http\Controllers\ChargeTrdController;
use App\Http\Controllers\DependencyHistoricController;
use App\Http\Controllers\ExpFilesChargeDocumentsController;
use App\Http\Controllers\ExpFilesController;
use App\Http\Controllers\ExpFilesReferencecrusadeController;
use App\Http\Controllers\GDDependencyController;
use App\Http\Controllers\RetencionIndiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::resource('documental-gestion/dependencies', GDDependencyController::class);
    Route::get('documental-gestion/dependencies-list', [GDDependencyController::class, 'list'])->name('dependencies.list');
    Route::get('documental-gestion/dependencies-export', [GDDependencyController::class, 'export'])->name('dependencies.export');
    Route::get('documental-gestion/dependencies-export-trd', [GDDependencyController::class, 'exportTrd'])->name('dependencies.exportTrd');

    Route::get('documental-gestion/charge-trd', [ChargeTrdController::class, 'index'])->name('charge.trd');
    Route::post('documental-gestion/charge-store', [ChargeTrdController::class, 'store'])->name('charge.store');

    Route::get('documental-gestion/dependencies/versioning/{id}',[GDDependencyController::class,'versioning'])->name('dependencies.versioning');
    Route::get('documental-gestion/dependencies/detail/{id}',[GDDependencyController::class,'detail'])->name('dependencies.detail');
    Route::get('documental-gestion/dependencies/type-docs/{id}',[GDDependencyController::class,'getTypeDocsByDependency'])->name('dependencies.typeDocsByDependency');
    Route::post('documental-gestion/dependencies/historic',[GDDependencyController::class,'updateHistoric'])->name('dependencies.updateHistoric');

    Route::resource('documental-gestion/trd-versioning', DependencyHistoricController::class);
    Route::get('documental-gestion/trd-versioning-list', [DependencyHistoricController::class, 'list'])->name('trd-versioning.list');
    Route::post('documental-gestion/trd-versioning-activeH', [DependencyHistoricController::class, 'activeH'])->name('trd-versioning.activeH');
    Route::get('documental-gestion/trd-versioning-export', [DependencyHistoricController::class, 'export'])->name('trd-verioning.export');
    Route::get('documental-gestion/trd-versioning-show-view/{id}', [DependencyHistoricController::class, 'show_view'])->name('trd-versioning.show_view');
    Route::get('documental-gestion/dependencies-serie-select', [DependencyHistoricController::class, 'seriesSelect'])->name('dependencies.seriesSelect');
    Route::get('documental-gestion/dependencies-subserie-select', [DependencyHistoricController::class, 'SubseriesSelect'])->name('dependencies.SubseriesSelect');

    Route::resource('documental-gestion/files-exp', ExpFilesController::class);
    Route::get('documental-gestion/files-exp-detail/{id}', [ExpFilesController::class,'detail'])->name('files-exp.Detail');
    Route::get('documental-gestion/files-exp-detailex', [ExpFilesController::class,'detailex'])->name('files-exp.detailex');
    Route::get('documental-gestion/files-exp-expFilesTypeDocs', [ExpFilesController::class,'expFilesTypeDocs'])->name('files-exp.expFilesTypeDocs');
    Route::get('documental-gestion/files-exp-list', [ExpFilesController::class, 'list'])->name('files-exp.list');
    Route::get('documental-gestion/files-exp-export', [ExpFilesController::class, 'export'])->name('files-exp.export');
    Route::get('documental-gestion/files-exp-exportTableControl', [ExpFilesController::class, 'exportTableControl'])->name('files-exp.exportTableControl');
    Route::get('documental-gestion/files-exp-export-archive', [ExpFilesController::class, 'exportArchive'])->name('files-exp.exportArchive');
    Route::get('documental-gestion/files-exp-exportFuid', [ExpFilesController::class, 'exportFuid'])->name('files-exp.exportFuid');
    Route::post('documental-gestion/files-exp-close', [ExpFilesController::class, 'close'])->name('files-exp.close');
    Route::post('documental-gestion/files-exp-storeOnlyExpFile', [ExpFilesController::class, 'storeOnlyExpFile'])->name('files-exp.storeOnlyExpFile');
    Route::get('documental-gestion/files-exp-export-package-zip', [ExpFilesController::class, 'exportPackageZip'])->name('files-exp.exportPackageZip');
    Route::get('documental-gestion/files-exp-archive', [ExpFilesController::class,'archive'])->name('files-exp.archive');
    Route::get('documental-gestion/files-exp-transfer', [ExpFilesController::class,'transfer'])->name('files-exp.transfer');
    Route::get('documental-gestion/files-exp-transfer-export-transfer', [ExpFilesController::class,'exportTransfer'])->name('files-exp.exportTransfer');

    Route::resource('documental-gestion/exp-files-referencecrusade', ExpFilesReferencecrusadeController::class);
    Route::get('documental-gestion/exp-files-referencecrusade-list', [ExpFilesReferencecrusadeController::class, 'list'])->name('exp-files-referencecrusade.list');
    Route::get('documental-gestion/exp-files-referencecrusade-export', [ExpFilesReferencecrusadeController::class, 'export'])->name('exp-files-referencecrusade.export');

    Route::resource('documental-gestion/exp-files-charge-docs', ExpFilesChargeDocumentsController::class);
    Route::get('documental-gestion/exp-files-charge-docs-list', [ExpFilesChargeDocumentsController::class, 'list'])->name('exp-files-charge-docs.list');
    Route::get('documental-gestion/exp-files-charge-docs-export', [ExpFilesChargeDocumentsController::class, 'export'])->name('exp-files-charge-docs.export');

    Route::get('documental-gestion/files-exp-table-control', [ExpFilesController::class,'tableControl'])->name('files-exp.tableControl');
    Route::get('documental-gestion/files-exp-table-control-pdf/{expFile}', [ExpFilesController::class,'exportTableControlPdf'])->name('files-exp.exportTableControlPdf');
    Route::get('documental-gestion/files-exp-table-logs/{expFile}', [ExpFilesController::class,'exportLogs'])->name('files-exp.exportLogs');

    Route::post('documental-gestion/files-exp-move-documents', [ExpFilesController::class, 'moveDocuments'])->name('files-exp.moveDocuments');
    Route::post('documental-gestion/files-exp-generate-index/{id}', [ExpFilesController::class, 'generateIndex'])->name('files-exp.generateIndex');
    Route::get('documental-gestion/files-exp-download-index/{fileName}', [ExpFilesController::class, 'downloadIndex'])->name('files-exp.downloadIndex');

    //Series Subseries y retenciones
    Route::post('documental-gestion/series/{serie}/subseries', [GDDependencyController::class, 'storeSubserie'])->name('subseries.create');
    Route::put('documental-gestion/subseries/{id}', [GDDependencyController::class, 'updateSubserie'])->name('subseries.update');
    Route::delete('documental-gestion/subseries/{id}', [GDDependencyController::class, 'destroySubserie'])->name('subseries.delete');

    Route::post('documental-gestion/dependencies/{dependencyId}/series', [GDDependencyController::class, 'storeSerie'])->name('series.create');
    Route::put('documental-gestion/series/{id}', [GDDependencyController::class, 'updateSerie'])->name('series.update');
    Route::delete('documental-gestion/series/{id}', [GDDependencyController::class, 'destroySerie'])->name('series.delete');

    // tipo documentales
    Route::get('documental-gestion/tipos-documentales', [GDDependencyController::class, 'getTypeDocs'])->name('tipos.documentales');
    Route::post('documental-gestion/tipos-documentales-create', [GDDependencyController::class, 'storeTypeDoc'])->name('tipos.createTypeDoc');

    //
    Route::post('documental-gestion/store-retencion-indice', [RetencionIndiceController::class, 'store'])->name('retencion_indices.store');
    Route::put('documental-gestion/retencion-indice/{id}', [RetencionIndiceController::class, 'update'])->name('retencion_indices.update');
    Route::delete('documental-gestion/retencion-indice/{id}', [RetencionIndiceController::class, 'destroy'])->name('retencion_indices.delete');
});
