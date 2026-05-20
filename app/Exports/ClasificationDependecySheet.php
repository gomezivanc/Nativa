<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromView;

class ClasificationDependecySheet implements FromView
{
    protected $data = [];
    protected $page = 1;

    public function __construct(Collection $data, Int $page) {
        $this->data = $data;
        $this->page = $page;
    }

    /**
    * @return \Illuminate\Support\View
    */
    public function view(): View
    {   
        return view('Exports.ClasificationDependency',[
            'data' => $this->data,
            'page' => $this->page
        ]);
    }
}
