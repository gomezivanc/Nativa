<?php

use App\Http\Controllers\ExpFilesArchivedController;
use App\Http\Controllers\ExpFilesFilesController;
use App\Http\Controllers\GDDependencyController;
use App\Http\Controllers\LoansExpFilesController;
use App\Http\Controllers\PhysicalSpaceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::resource('loans/request-loans', ExpFilesFilesController::class);
    Route::get('loans/request-loans-list', [ExpFilesFilesController::class, 'list'])->name('request-loans.list');
    Route::get('loans/request-loans-export', [ExpFilesFilesController::class, 'export'])->name('request-loans.export');
    
    Route::get('loans/request-loans-listAdminLoan-export', [ExpFilesFilesController::class, 'exportAdmin'])->name('request-loans.listAdminLoanExport');
    Route::get('loans/request-loans-listAdminLoan', [ExpFilesFilesController::class, 'listAdminLoan'])->name('request-loans.listAdminLoan');
    Route::get('loans/admin-loans-update', [ExpFilesFilesController::class, 'adminLoans'])->name('admin-loans.adminLoans');
    Route::post('loans/admin-loans-storeLoanState', [ExpFilesFilesController::class, 'storeLoanState'])->name('admin-loans.storeLoanState');
    Route::post('loans/request-loans-store', [ExpFilesFilesController::class, 'storeLoan'])->name('request-loans.storeLoan');

    Route::get('loans/admin-loans-historic/{expFilesFiles}', [ExpFilesFilesController::class, 'historicLoans'])->name('admin-loans.historicLoans');

    Route::resource('loans/loans-exp', LoansExpFilesController::class);
    Route::post('loans/request-loans-exp-store', [LoansExpFilesController::class, 'storeLoan'])->name('request-loans-exp.storeLoan');
    Route::get('loans/request-loans-export', [LoansExpFilesController::class, 'export'])->name('request-loans-exp.export');

    Route::get('loans/request-loans-listAdminLoan-export', [LoansExpFilesController::class, 'exportAdmin'])->name('request-loans-exp.listAdminLoanExport');
    Route::get('loans/request-loans-exp-listAdminLoan', [LoansExpFilesController::class, 'listAdminLoan'])->name('request-loans-exp.listAdminLoan');
    Route::get('loans/admin-loans-exp-update', [LoansExpFilesController::class, 'adminLoans'])->name('admin-loans-exp-exp.adminLoans');
    Route::post('loans/admin-loans-exp-storeLoanState', [LoansExpFilesController::class, 'storeLoanState'])->name('admin-loans-exp.storeLoanState');

    Route::get('loans/admin-loans-historic-exp/{expFiles}', [LoansExpFilesController::class, 'historicLoans'])->name('admin-loans-exp.historicLoans');
});
