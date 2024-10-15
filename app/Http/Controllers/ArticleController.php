<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Contracts\View\View;

class ArticleController extends Controller
{
    public function index(): View
    {
        return view('articles.index');
    }

    public function create(): View
    {
        return view('articles.create');
    }

    public function edit(Article $article): View
    {
        return view('articles.edit', ['article' => $article]);
    }
}
