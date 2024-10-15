<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

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
}
