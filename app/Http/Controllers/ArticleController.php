<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index(): View {
        return view('articles.index');
    }

    public function create(): View {
        return view('articles.create');
    }
}
