<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Publisher;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use League\HTMLToMarkdown\HtmlConverter;
use Spatie\YamlFrontMatter\YamlFrontMatter;

class ArticleController extends Controller
{
    public function index()
    {
        return Inertia::render('App/Articles/Index', [
            "articles" => Auth::user()->articles,
            "publishers" => Auth::user()->publishers
        ]);
    }

    public function create()
    {
        return Inertia::render('App/Articles/Create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'content' => 'required|string',
            'fm' => 'required|array'
        ]);
        $title = $validated['fm']['title'] ?? 'default title';
        $article = Auth::user()->articles()->create(['content' => $validated['content'], 'fm' => $validated['fm'], 'title' => $title]);
        return to_route('app.articles.edit', ['article' => $article->id]);
    }

    public function edit(Article $article)
    {
        return Inertia::render('App/Articles/Edit', [
            'article' => $article
        ]);
    }

    public function update(Article $article, Request $request) {
        $validated = $request->validate([
            'content' => 'required|string',
            'fm' => 'required|array'
        ]);
        $article->update($validated);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return to_route('app.articles.index');
    }

    public function publish(Article $article, Request $request) {
        $validated = $request->validate([
            'publishers' => 'required|array'
        ]);
        $converter = new HtmlConverter();
        $content = $converter->convert($article->content);
        $parsed = YamlFrontMatter::parse($content);
        $publishers = Publisher::query()->whereIn('id', $validated['publishers'])->get();
        $res = [];
        foreach ($publishers as $publisher) {
            $className = $publisher->class_name;
            /** @var PublisherContract */
            $instance = new $className();
            $valid = $instance
                ->setData($publisher->data)
                ->setFm($parsed->matter())
                ->publish($content);
            $res[$publisher->name] = $valid;
        }
        return response()->json(['status' => $res]);

    }
}
