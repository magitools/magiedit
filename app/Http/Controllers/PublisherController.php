<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublisherResource;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PublisherController extends Controller
{
    public function index(): View
    {
        return view('publishers.index');
    }

    public function create(): View
    {
        return view('publishers.create');
    }

    public function indexApi() {
            return response()->json([
                'publishers' => PublisherResource::collection(Auth::user()->publishers)
            ]);
    }
}
