<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TenantAssetsController extends Controller
{
    function __invoke(Request $request)
    {
        // dd(storage_path('app/public/' . $request->query('path')));
        return response()->file(storage_path('app/public/' . $request->query('path')));
    }
}
