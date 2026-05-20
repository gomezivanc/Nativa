<?php

use App\Http\Controllers\CancellationRequestFilingController;
use App\Http\Controllers\DistributionShippingFilingController;
use App\Http\Controllers\DistributionUnitController;
use App\Http\Controllers\MassiveReassignmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group( function () {
    Route::get('correspondence-management/distribution-units', [DistributionUnitController::class, 'indexmane'])->name('distribution-units.index');
    Route::get('distribution-unit/{id}/filings', [DistributionUnitController::class, 'showFilings'])->name('distribution-unit.show-filings');
    Route::get('distribution-unit/{id}/received-emails-list', [DistributionUnitController::class, 'listReceivedEmails'])->name('distribution-unit.list-received-emails');
    Route::get('distribution-unit/{id}/{id2}/filingsOther',[DistributionUnitController::class, 'showOther'])->name('distribution-unit.other-view');
    Route::get('distribution-unit/{id}/filings-list', [DistributionUnitController::class, 'listFilings'])->name('distribution-unit.list-filings');
    Route::post('filing-copy/{copyId}/transfer', [DistributionUnitController::class, 'transferFilingCopy'])->name('filing.transfer-copy');
    Route::post('filing-copy/{copyId}/finish', [DistributionUnitController::class, 'finishCopy'])->name('filing.finish-copy');
    Route::post('filing/{id}/transfer', [DistributionUnitController::class, 'transferFiling'])->name('filing.transfer');
    Route::post('filing/{id}/assign-official', [DistributionUnitController::class, 'assignOfficial'])->name('filing.assign-official');
    Route::post('filing-copy/{copyId}/assign-official', [DistributionUnitController::class, 'assignOfficialCopy'])->name('filing.assign-official-copy');
    Route::get('filing/{id}/copies', [DistributionUnitController::class, 'getFilingCopies'])->name('filing.copies');
    
    Route::resource('correspondence-management/distributionshipping', DistributionShippingFilingController::class);
    Route::get('distribution-shipping/distributionshipping-list', [DistributionShippingFilingController::class, 'list'])->name('distributionshipping.list');
    Route::get('distribution-shipping/distributionshipping-showdistribution', [DistributionShippingFilingController::class, 'showdistribution'])->name('distributionshipping.showdistribution');
    Route::get('distribution-shipping/distributionshipping-listdistribution', [DistributionShippingFilingController::class, 'listdistri'])->name('distributionshipping.listdistribution');
    Route::get('distribution-shipping/distributionshipping-export', [DistributionShippingFilingController::class, 'export'])->name('distributionshipping.export');
    Route::post('distribution-shipping/send-shipping-mail', [DistributionShippingFilingController::class, 'sendShippingMail'])->name('distributionshipping.send-shipping-mail');
    Route::post('distribution-shipping/update-state-correspondece', [DistributionShippingFilingController::class, 'updateStateCorrespondece'])->name('distributionshipping.update-state-correspondece');

    Route::get('distribution-shipping/new-state-correspondece', [DistributionShippingFilingController::class, 'newStateCorrespondece'])->name('distributionshipping.new-state-correspondece');
    
    Route::resource('correspondence-management/mass-reasing', MassiveReassignmentController::class);
    Route::post('mass-reasing/reassing-massive', [MassiveReassignmentController::class, 'reassingMassive'])->name('mass-reasing.reassing-massive');
    
    Route::get('correspondence-accusation/accusation-index', [DistributionShippingFilingController::class, 'indexAcus'])->name('accusation.indexAcus');
    Route::get('correspondence-accusation/accusation-list', [DistributionShippingFilingController::class, 'listAcus'])->name('accusation.list');

    Route::resource('correspondence-management/cancellation-request', CancellationRequestFilingController::class);
    Route::get('cancellation-request/cancellation-request-list', [CancellationRequestFilingController::class, 'list'])->name('cancellation-request.list');
    Route::post('cancellation-request/update-state-cancelation', [CancellationRequestFilingController::class, 'updateStateCancelation'])->name('cancellation-request.update-state-cancelation');
});
