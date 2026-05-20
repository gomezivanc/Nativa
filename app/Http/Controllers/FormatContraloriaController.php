<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FormatContraloriaController extends Controller
{
    
    function index()
    {
        return Inertia::render('JudicialProcess/FormatContraloria/Index'); 
    }

    function f21()
    {
        return Inertia::render('JudicialProcess/F21/Index'); 
    }
    function Closesf21()
    {
        return Inertia::render('JudicialProcess/FormatContraloria/Index'); 
    }
}
