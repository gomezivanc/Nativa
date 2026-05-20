<?php

use App\Http\Controllers\ReportController;
use App\Http\Controllers\ControlerApro;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('report/report-permissions', [ReportController::class, 'permissions'])->name('permissions.reports');
    Route::get('/logs', [ReportController::class, 'showLogs'])->name('logs.index');

    Route::get('/filing-days-response', [ReportController::class, 'filingDaysResponse'])->name('filing-days.reports');
    Route::get('/filing-days-response-export', [ReportController::class, 'exportFilingDaysResponse'])->name('filing-days.export');

    Route::get('/filing-by-type', [ReportController::class, 'FilingByType'])->name('filing-by-type.reports');
    Route::get('/filing-by-type-export', [ReportController::class, 'exportFilingByType'])->name('filing-by-type.export');

    Route::get('/filing-person', [ReportController::class, 'FilingByPerson'])->name('filing-person.reports');

    Route::get('/exp-file-class', [ReportController::class, 'ExpFileClassReport'])->name('exp-file-class.reports');


    // ROL CONTROL
    Route::resource('controler/controler', ControlerApro::class);
    Route::get('controler/controler-list', [ControlerApro::class, 'list'])->name('controler.list');
    Route::post('controler/controler-aprobarSolicitud', [ControlerApro::class, 'aprobarSolicitud'])->name('controler.aprobarSolicitud');
    Route::post('controler/controler-negarSolicitud', [ControlerApro::class, 'negarSolicitud'])->name('controler.negarSolicitud');
    Route::post('controler/controler-accionEspecial', [ControlerApro::class, 'accionEspecial'])->name('controler.accionEspecial');
    Route::post('controler/controler-apliacionTiempo', [ControlerApro::class, 'apliacionTiempo'])->name('controler.apliacionTiempo');
});
