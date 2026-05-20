<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConfigureMailController;
use App\Http\Controllers\OnlyOfficeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('register', 'App\Http\Controllers\UserController@register');
Route::post('login', 'App\Http\Controllers\Auth\LoginController@login');

Route::post('/gmail/webhook', [ConfigureMailController::class, 'receiveWebhook']);
Route::get('/google/redirect/{id}', [ConfigureMailController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/google/callback', [ConfigureMailController::class, 'handleGoogleCallback']);
Route::get('/gmail/download-attachment/{mail_config_id}/{message_id}/{attachment_id}/{filename}', [ConfigureMailController::class, 'downloadAttachment']);

Route::get('/getfileOnly', [OnlyOfficeController::class, 'getfileOnly'])->name('getfileOnly');
Route::get('/ver-documento-linea', [OnlyOfficeController::class, 'verDocumentoLinea'])->name('verDocumentoLinea');
Route::get('/ver-documento-verDocumentoLineaSolo', [OnlyOfficeController::class, 'verDocumentoLineaSolo'])->name('verDocumentoLineaSolo');
Route::post('/guardar-documento-en-linea/{id}', [OnlyOfficeController::class, 'guardarDocumentoEnLinea'])->name('guardarDocumentoEnLinea');
Route::get('/ver-convertirPdf', [OnlyOfficeController::class, 'convertirPdf'])->name('convertirPdf');

Route::group(['middleware' => ['jwt.verify']], function() {

    Route::post('user','App\Http\Controllers\Auth\LoginController@getAuthenticatedUser');
    Route::get('tipoDoc/gettipodoc','App\Http\Controllers\UserController@getTipoDoc');
});