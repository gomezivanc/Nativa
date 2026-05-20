<?php

use App\Http\Controllers\AccumulatedFundController;
use App\Http\Controllers\ExpFilesArchivedController;
use App\Http\Controllers\PhysicalSpaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group( function () {
    Route::resource('archive-gestion/physicalspace', PhysicalSpaceController::class);
    Route::get('archive-gestion/physicalspace-show-ubication/{id}', [PhysicalSpaceController::class, 'showUbication'])->name('physicalspace.showUbication');
    Route::get('archive-gestion/physicalspace-list', [PhysicalSpaceController::class, 'list'])->name('physicalspace.list');
    Route::get('archive-gestion/physicalspace-export', [PhysicalSpaceController::class, 'export'])->name('physicalspace.export');
    Route::get('archive-gestion/physicalspace-select', [PhysicalSpaceController::class, 'select'])->name('physicalspace.select');
    Route::get('archive-gestion/physicalspace-floor-select', [PhysicalSpaceController::class, 'selectFloors'])->name('physicalspace.floor-select');
    Route::get('archive-gestion/physicalspace-filesareas-select', [PhysicalSpaceController::class, 'selectFilesArea'])->name('physicalspace.filesareas-select');

    Route::resource('archive-gestion/exp-files-archived', ExpFilesArchivedController::class);
    Route::get('archive-gestion/exp-files-archived-list/{id}', [ExpFilesArchivedController::class, 'detail'])->name('exp-files-archived.detail');
    Route::get('archive-gestion/exp-files-archived-list', [ExpFilesArchivedController::class, 'list'])->name('exp-files-archived.list');
    Route::get('archive-gestion/exp-files-archived-exportSheets', [ExpFilesArchivedController::class, 'exportSheets'])->name('exp-files-archived.exportSheets');
    Route::get('archive-gestion/exp-files-archived-folderRotule', [ExpFilesArchivedController::class, 'FolderRotule'])->name('exp-files-archived.FolderRotule');

    Route::resource('archive-gestion/accumulated-fund', AccumulatedFundController::class);
    Route::get('archive-gestion/accumulated-fund-list', [AccumulatedFundController::class, 'list'])->name('accumulated-fund.list');
    Route::get('archive-gestion/accumulated-fund-export', [AccumulatedFundController::class, 'export'])->name('accumulated-fund.export');
});
