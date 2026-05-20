<?php

use App\Http\Controllers\SpecialActionsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    
    // Acciones Especiales - General Filing
    Route::get('special-actions/general-filings', [SpecialActionsController::class, 'generalFilings'])->name('special-actions.general-filings');
    Route::get('special-actions/general-filings-search', [SpecialActionsController::class, 'searchGeneralFilings'])->name('special-actions.general-filings-search');
    
});
