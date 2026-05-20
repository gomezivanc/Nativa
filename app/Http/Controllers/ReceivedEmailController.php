<?php

namespace App\Http\Controllers;

use App\Repositories\ReceivedEmailRepository;
use Illuminate\Http\Request;

class ReceivedEmailController extends Controller
{
    public function __construct(private ReceivedEmailRepository $receivedEmailRepository)
    {
    }

    public function list(Request $request)
    {
        $data = $this->receivedEmailRepository->list($request->all(), ['mailConfig']);
        return response()->json($data);
    }

    public function show(String $id)
    {
        $object = $this->receivedEmailRepository->find($id);
        return response()->json($object);
    }

    public function byDistribution(String $distributionUnitId)
    {
        $emails = $this->receivedEmailRepository->getByDistributionUnit($distributionUnitId);
        return response()->json($emails);
    }
}
