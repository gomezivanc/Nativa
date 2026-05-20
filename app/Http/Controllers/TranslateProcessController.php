<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TranslateProcessController extends Controller
{
    function index(Request $request) {
        return Inertia::render('Utilities/TranslateProcess/Index');
    }
    function repetitions(Request $request) {
        return Inertia::render('Utilities/TranslateProcessRepetitions/Index');
    }
}
