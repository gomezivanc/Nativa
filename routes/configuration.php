<?php

use App\Http\Controllers\ConfProviderSendController;
use App\Http\Controllers\DefendantsController;
use App\Http\Controllers\DistributionUnitController;
use App\Http\Controllers\DocumentCategoriesController;
use App\Http\Controllers\ExternalRepresentsController;
use App\Http\Controllers\FilingSettingController;
use App\Http\Controllers\FilingStructureController;
use App\Http\Controllers\HoursNotWorkController;
use App\Http\Controllers\ChargesController;
use App\Http\Controllers\HoursWorkController;
use App\Http\Controllers\JudgeController;
use App\Http\Controllers\JudicialOfficesController;
use App\Http\Controllers\PayrollManagementController;
use App\Http\Controllers\ProcedureManagementController;
use App\Http\Controllers\PlaintiffsController;
use App\Http\Controllers\ProcessStateController;
use App\Http\Controllers\RadicationLabelController;
use App\Http\Controllers\ReceivedEmailController;
use App\Http\Controllers\RegionalController;
use App\Http\Controllers\SatisfactionSurveyController;
use App\Http\Controllers\SatisfactionSurveyResponsesController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\SmlvController;
use App\Http\Controllers\ThemesController;
use App\Http\Controllers\ThirdsController;
use App\Http\Controllers\TrdController;
use App\Http\Controllers\TypeProcessController;
use App\Http\Controllers\TypesFilingsController;
use App\Http\Controllers\ExpFilesTypeDocController;
use App\Http\Controllers\IndiceController;
use App\Http\Controllers\UserInteroperabilityController;
use App\Http\Controllers\UsersGroupController;
use App\Http\Controllers\VariablesTemplatesController;
use App\Http\Controllers\ConfigureMailController;
use App\Http\Controllers\UserController;
use App\Models\SatisfactionSurveyResponses;
use App\Models\TypesFilings;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Apoderados externos
    Route::resource('configuration/trd', TrdController::class);
    Route::get('configuration/trd-list', [TrdController::class, 'list'])->name('trd.list');
    Route::get('configuration/trd-export', [TrdController::class, 'export'])->name('trd.export');

    Route::resource('configuration/provider', ConfProviderSendController::class);
    Route::get('configuration/provider-list', [ConfProviderSendController::class, 'list'])->name('provider.list');
    Route::get('configuration/provider-export', [ConfProviderSendController::class, 'export'])->name('provider.export');

    Route::resource('configuration/users-group', UsersGroupController::class);
    Route::get('configuration/users-group-list', [UsersGroupController::class, 'list'])->name('users-group.list');
    Route::get('configuration/users-group-export', [UsersGroupController::class, 'export'])->name('users-group.export');

    Route::resource('configuration/hours-work', HoursWorkController::class);
    Route::get('configuration/hours-work-list', [HoursWorkController::class, 'list'])->name('hours-work.list');
    Route::get('configuration/hours-work-export', [HoursWorkController::class, 'export'])->name('hours-work.export');

    Route::resource('configuration/hours-not-work', HoursNotWorkController::class);
    Route::get('configuration/hours-not_work-list', [HoursNotWorkController::class, 'list'])->name('hours-not-work.list');
    Route::get('configuration/hours-not_work-export', [HoursNotWorkController::class, 'export'])->name('hours-not-work.export');

    Route::resource('configuration/charges', ChargesController::class);
    Route::get('configuration/charges-list', [ChargesController::class, 'list'])->name('charges.list');
    Route::get('configuration/charges-export', [ChargesController::class, 'export'])->name('charges.export');
    Route::post('configuration/charges-create-update', [ChargesController::class, 'storeUpdate'])->name('charges.storeUpdate');

    Route::get('configuration/indices/list', [IndiceController::class, 'list'])->name('indices.list');
    Route::resource('configuration/indices', IndiceController::class);
    Route::post('configuration/indices/store-update', [IndiceController::class, 'storeUpdate'])->name('indices.storeUpdate');
    Route::post('configuration/indices/indicesByRetencion', [IndiceController::class, 'indicesByRetencion'])->name('indices.indicesByRetencion');

    Route::resource('configuration/exp-type-doc', ExpFilesTypeDocController::class);


    Route::resource('configuration/payroll-management', PayrollManagementController::class);
    Route::get('configuration/payroll-management-list', [PayrollManagementController::class, 'list'])->name('payroll-management.list');
    Route::get('configuration/payroll-management-listVie', [PayrollManagementController::class, 'listVie'])->name('payroll-management.listVie');
    Route::get('payroll-management/show/{id}', [PayrollManagementController::class, 'showMor'])->name('payroll-management.showMor');
    Route::get('configuration/payroll-management-export', [PayrollManagementController::class, 'export'])->name('payroll-management.export');
    Route::get('payroll-management/templates', [PayrollManagementController::class, 'templates'])->name('payroll-management.templates');
    Route::post('payroll-management/assign', [PayrollManagementController::class, 'assign'])->name('payroll-management.assign');
    Route::delete('payroll-management/delete-assign/{id}', [PayrollManagementController::class, 'deleteAssign'])->name('payroll-management.delete-assign');

    Route::resource('configuration/procedure-management', ProcedureManagementController::class);
    Route::get('configuration/procedure-management-list', [ProcedureManagementController::class, 'list'])->name('procedure-management.list');
    Route::get('configuration/procedure-management-export', [ProcedureManagementController::class, 'export'])->name('procedure-management.export');

    Route::resource('configuration/variables-templates', VariablesTemplatesController::class);
    Route::get('configuration/variables-templates-list', [VariablesTemplatesController::class, 'list'])->name('variables-templates.list');
    Route::get('configuration/variables-templates-export', [VariablesTemplatesController::class, 'export'])->name('variables-templates.export');

    Route::resource('configuration/user-interoperability', UserInteroperabilityController::class);
    Route::get('configuration/user-interoperability-list', [UserInteroperabilityController::class, 'list'])->name('user-interoperability.list');
    Route::get('configuration/user-interoperability-export', [UserInteroperabilityController::class, 'export'])->name('user-interoperability.export');

    Route::resource('configuration/satisfaction-survey', SatisfactionSurveyController::class);
    Route::get('configuration/satisfaction-survey-list', [SatisfactionSurveyController::class, 'list'])->name('satisfaction-survey.list');
    Route::get('configuration/satisfaction-survey-response/{satisfaction_survey}', [SatisfactionSurveyResponsesController::class, 'response'])->name('satisfaction-survey.response');
    Route::post('configuration/satisfaction-survey-response-store/{satisfaction_survey}', [SatisfactionSurveyResponsesController::class, 'store'])->name('satisfaction-survey.response.store');
    Route::get('configuration/satisfaction-survey-response-resume', [SatisfactionSurveyResponsesController::class, 'resume'])->name('satisfaction-survey.response.resume');
    Route::get('configuration/satisfaction-survey-export', [SatisfactionSurveyController::class, 'export'])->name('satisfaction-survey.export');

    Route::resource('configuration/regional', RegionalController::class);
    Route::get('configuration/regional-list', [RegionalController::class, 'list'])->name('regional.list');
    Route::get('configuration/regional-export', [RegionalController::class, 'export'])->name('regional.export');
    Route::get('configuration/regional-countries', [RegionalController::class, 'countries'])->name('regional.countries');

    Route::resource('configuration/types-filings', TypesFilingsController::class);
    Route::get('configuration/types-filings-list', [TypesFilingsController::class, 'list'])->name('types-filings.list');
    Route::get('configuration/types-filings-export', [TypesFilingsController::class, 'export'])->name('types-filings.export');

    Route::resource('configuration/filling-setting', FilingSettingController::class);
    Route::get('configuration/filling-setting-list', [FilingSettingController::class, 'list'])->name('filling-setting.list');

    Route::get('configuration/filling-structure-list', [FilingStructureController::class, 'list'])->name('filling-structure.list');

    Route::resource('configuration/radication-labels', RadicationLabelController::class);
    Route::get('configuration/radication-labels-list', [RadicationLabelController::class,'list'])->name('radication-labels.list');
    Route::get('configuration/radication-labels-export', [RadicationLabelController::class, 'export'])->name('radication-labels.export');

    Route::resource('configuration/third', ThirdsController::class);
    Route::get('configuration/third-list', [ThirdsController::class,'list'])->name('third.list');
    Route::get('configuration/third-export', [ThirdsController::class, 'export'])->name('third.export');

    Route::resource('configuration/distribution', DistributionUnitController::class)->except(['show']);
    Route::get('configuration/distribution-list', [DistributionUnitController::class, 'list'])->name('distribution.list');
    Route::get('configuration/distribution/{id}', [DistributionUnitController::class, 'show'])->name('distribution.show');
    Route::get('configuration/distribution-export', [DistributionUnitController::class, 'export'])->name('distribution.export');
    Route::get('configuration/distribution-listFull', [DistributionUnitController::class, 'listFull'])->name('distribution.listFull');

    // Mail Configs Routes
    Route::resource('configuration/mail_configs', ConfigureMailController::class)->except(['show']);
    Route::get('configuration/mail_configs-list', [ConfigureMailController::class, 'mailConfigList'])->name('mail_configs.list');
    Route::get('configuration/mail_configs/{id}', [ConfigureMailController::class, 'mailConfigShow'])->name('mail_configs.show');

    Route::delete('configuration/destroyReceivedEmail/{id}', [ConfigureMailController::class, 'destroyReceivedEmail'])->name('ReceivedEmail.destroyReceivedEmail');
});
