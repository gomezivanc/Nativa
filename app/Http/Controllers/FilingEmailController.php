<?php

namespace App\Http\Controllers;

use App\Repositories\ExpFilesClasificationsRepository;
use App\Repositories\ExpFilesTypeDocRepository;
use App\Repositories\FilingEmailRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\ReceptionMediumRepository;
use App\Repositories\TypePersonRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FilingEmailController extends Controller
{
    public function __construct(private FilingEmailRepository $filingEmailRepository, private ExpFilesClasificationsRepository $expFilesClasificationsRepository,
        private ExpFilesTypeDocRepository $expFilesTypeDocRepository,  private ReceptionMediumRepository $receptionMediumRepository, private PriorityRepository $priorityRepository,
        private TypePersonRepository $typePersonRepository
    ) {}

    function index(Request $request)
    {

        $clasifications = $this->expFilesClasificationsRepository->all();
        $typeDocs = $this->expFilesTypeDocRepository->all();
        $receptionMedium = $this->receptionMediumRepository->all();
        $priorities = $this->priorityRepository->all();
        $typePerson = $this->typePersonRepository->all();
        $currentLocale = App::getLocale();

        return Inertia::render("filing/email_filing/Index", compact(
            'clasifications',
            'typeDocs',
            'receptionMedium',
            'priorities',
            'typePerson',
            'currentLocale'
        ));
    }

    function create(Request $request)
    {

        return Inertia::render("Configuration/filingEmail/Create");
    }

    // store - update
    function store(Request $request)
    {
        if (empty($request['id'])) {
            $request['from_id'] = Auth::user()->id;
        }
        $data = $this->filingEmailRepository->storeGeneral($request->except('users','filesA'));
        if(!empty($request->filesA)) {
            $this->filingEmailRepository->attachSendUsers($data,$request->filesA);
        }
        if(!empty($request->users)) {
            $this->filingEmailRepository->storeSendUsers($data,$request->users);
        }
        return response()->json($data);
    }

    function list(Request $request)
    {
        $data = $this->filingEmailRepository->list($request->all(), ['to:id,to_id,is_read,filing_email_id',
        'to.user:id,id_persona,email','to.user.persona:id,nombre,apellido','user.persona:id,nombre,apellido','attachments'],['attachments']);
        return response()->json($data);
    }

    function edit(String $id)
    {
        return Inertia::render("Configuration/filingEmail/Create", compact('id'));
    }

    function show(String $id)
    {
        $object = $this->filingEmailRepository->find($id);
        return response()->json($object);
    }

    function destroy(String $id)
    {
        $object = $this->filingEmailRepository->find($id);
        $object->delete();
        return response()->json($object);
    }

    function export(Request $request)
    {
        $type = $request->type;
        $filters = $request->except('type');
        $data = $this->filingEmailRepository->list(array_merge($filters, ['typeData' => 'todos']));
        foreach ($data as $item) {
            $item->makeHidden(['created_at', 'updated_at', 'deleted_at', 'id']);
        }
        return $this->filingEmailRepository->export($type, $data->toArray(), 'Excel.Export.generalExport', '');
    }
}
