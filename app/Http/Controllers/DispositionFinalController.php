<?php

namespace App\Http\Controllers;

use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\TypeAnnexesRepository;
use App\Repositories\TypesBodyRepository;
use Inertia\Inertia;

class DispositionFinalController extends Controller
{
    function __construct(private TypeAnnexesRepository $typeAnnexesRepository, private ExpFilesTypeDocRepository $expFilesTypeDocRepository, private TypesBodyRepository $typesBodyRepository) {
        
    }

    function index() {
        $typeAnex = $this->typeAnnexesRepository->all();
        $expFilesTypeDocs = $this->expFilesTypeDocRepository->all();
        $typesBody = $this->typesBodyRepository->all();
        return Inertia::render('DispositionFinal/Index',
            compact('typeAnex','expFilesTypeDocs','typesBody')
        );
    }
}
