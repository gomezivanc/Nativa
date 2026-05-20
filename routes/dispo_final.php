<?php

use App\Http\Controllers\DispositionFinalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('disposition-final', [DispositionFinalController::class, 'index'])->name('dispo_final.index');
});
