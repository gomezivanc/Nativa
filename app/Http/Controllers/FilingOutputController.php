<?php

namespace App\Http\Controllers;

use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\ReceptionMediumRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\TypePersonRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;

class FilingOutputController extends Controller
{
        public function __construct(
            private ExpFilesClasificationsRepository $expFilesClasificationsRepository,
            private ExpFilesTypeDocRepository $expFilesTypeDocRepository,
            private ReceptionMediumRepository $receptionMediumRepository,
            private PriorityRepository $priorityRepository,
            private TypePersonRepository $typePersonRepository,

        )
    {
    }

    function create(Request $request)
    {
        $clasifications = $this->expFilesClasificationsRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        $receptionMedium = $this->receptionMediumRepository->all();
        $priorities = $this->priorityRepository->all();
        $typePerson = $this->typePersonRepository->all();
        $currentLocale = App::getLocale();
        return Inertia::render("filing/output_filing/Create", compact('clasifications', 'currentLocale', 'typeDocs', 'receptionMedium', 'priorities', 'typePerson'));
    }
}
