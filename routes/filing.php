<?php

use App\Http\Controllers\ChargeDocFilingController;
use App\Http\Controllers\FilingController;
use App\Http\Controllers\OfficialFilingController;
use App\Http\Controllers\FilingEmailController;
use App\Http\Controllers\FilingOutputController;
use App\Models\ChargeDocFiling;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::resource('filing/filing', FilingController::class);
    Route::get('filing/filing-list', [FilingController::class, 'list'])->name('filing.list');
    Route::get('filing/filing/detail/{filing}', [FilingController::class, 'showFiling'])->name('filing.show-filing');
    Route::get('filing/filing-filing_number', [FilingController::class, 'filing_number'])->name('filing.filing_number');
    Route::get('filing/search-third-by-document', [FilingController::class, 'searchThirdByDocument'])->name('filing.search-third-by-document');
    Route::get('filing/search-ias-filed', [FilingController::class, 'searchIasFiled'])->name('filing.search-ias-filed');          
    Route::get('filing/export', [FilingController::class, 'export'])->name('filing.export');
    Route::get('filing/export-stiker', [FilingController::class, 'exportSticker'])->name('filing.export-stiker');
    Route::post('filing/send-response-mail', [FilingController::class, 'sendResponseMail'])->name('filing.send-response-mail');
    Route::post('filing/send-responseOfici-mail', [FilingController::class, 'sendEmailOfficial'])->name('filing.send-official-mail');
    Route::post('filing/reassing-to', [FilingController::class, 'reassingTo'])-> name('filing.reassing-to');
    Route::post('filing/associate-template', [FilingController::class, 'associateTemplate'])->name('filing.associate-template');
    Route::post('filing/finish-filing', [FilingController::class, 'finishFiling'])->name('filing.finish-filing');
    Route::post('filing/cancellation-request', [FilingController::class, 'cancellationRequest'])->name('filing.cancellation-request');
    Route::post('filing/sing-filing', [FilingController::class, 'singFiling'])->name('filing.sing-filing');
    Route::post('filing/include-exp-filing', [FilingController::class, 'includeExpFiling'])->name('filing.include-exp-filing');
    Route::post('filing/no-response-required', [FilingController::class, 'noResponseRequired'])->name('filing.no-response-required');
    
    Route::get('filing/documentaprovado', [FilingController::class, 'documentaprovado'])->name('filing.documentaprovado');

    //para pasar copias a funcionario o unidad de distribucion
    Route::get('filing/copy-official-uniti', [FilingController::class, 'copyUfficialUniti'])->name('filing.copy-official-uniti');

    //Generar Filing de radicado por GMAIL
    Route::post('filing/filing/store/gmail', [FilingController::class, 'filingStoreGmail'])->name('filing.store-gmail');

    //Radicado De Salida
    Route::resource('filingOutput/filingOutput', FilingOutputController::class);

    //plantillas de respuesta
    Route::get('filing/associate-template-user', [FilingController::class, 'associateTemplateUser'])->name('filing.associate_template');
    Route::get('filing/edition-template-user', [FilingController::class, 'editionTemplateUser'])->name('filing.online_edition');
    Route::get('filing/new-state-correspondece', [FilingController::class, 'newStateCorrespondece'])->name('filing.new-state-correspondece');

    //firmar
    Route::get('filing/sign-document',[FilingController::class, 'signDocument'])->name('filing.sign_document');

    Route::resource('filing/charge-doc-filing', ChargeDocFilingController::class);
    Route::post('filing/charge-doc-storeAcuse', [ChargeDocFilingController::class, 'storeAcuse'])->name('charge.storeAcuse');
    Route::post('filing/charge-doc-filing-de', [ChargeDocFilingController::class, 'destroy'])->name('charge.destroydata');

    Route::post('filing/workflow/assing_wk',[FilingController::class, 'assingWk'])->name('filing.assingWk');
    Route::get('filing/workflow/{filing}',[FilingController::class, 'workflow'])->name('filing.workflow');
    Route::get('filing/workflow-reject/{filing}',[FilingController::class, 'rejectStep'])->name('filing.rejectStep');
    Route::post('filing/workflow',[FilingController::class, 'storeStep'])->name('filing.workflow.store');
    Route::delete('filing/workflow/{filingWorkflow}',[FilingController::class, 'deletefilingWorkflow'])->name('filing.workflow.delete');

    // Radicados Tipos Tramite
    Route::get('filing/type-process', [FilingController::class, 'typeProcess'])->name('filing.type-process');

    // Radicados Con Funcionario
    Route::resource('filingOfficial/filingOfficial', OfficialFilingController::class);
    Route::get('filingOfficial/filingOfficial-list', [OfficialFilingController::class, 'list'])->name('filingOfficial.list');
    Route::get('filingOfficial/newProcedures', [OfficialFilingController::class, 'indexProcedures'])->name('newProcedures.index');
    Route::get('filingOfficial/newProcedures-create', [OfficialFilingController::class, 'createProcedures'])->name('newProcedures.create');
    Route::get('filingOfficial/newProcedures-list', [OfficialFilingController::class, 'listProcedures'])->name('newProcedures.list');

    /*
    * Modulo de radicación por correo
    **/
    Route::resource('filing/email',FilingEmailController::class);
    Route::get('filing/email-list',[FilingEmailController::class,'list'])->name('email.list');
    Route::get('filing/masive-list',[FilingController::class,'masiveFilingView'])->name('filing.masiveFilingView');

    // Asociar plantilla a radicado
    Route::post('filing/storeResponseTemplate', [FilingController::class, 'storeResponseTemplate'])->name('filing.storeResponseTemplate');
    Route::get('filing/typPerson', [FilingController::class, 'typePerson'])->name('filing.type_person');

    Route::get('filing/getExpirationDate', [FilingController::class, 'getExpirationDate'])->name('filing.getExpirationDate');

    // Acuses de Recibo - Acknowledgments
    Route::get('/acuse/{filing}', [FilingController::class, 'showAcuse'])->name('acuse.show');
});
