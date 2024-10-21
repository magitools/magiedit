<?php

namespace App\Livewire\Articles;

use App\Models\Article;
use Flux\Flux;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use League\HTMLToMarkdown\HtmlConverter;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Locked;
use Livewire\Component;
use Spatie\YamlFrontMatter\YamlFrontMatter;

class Editor extends Component
{
    public string $content = '<p>write your article here</p>';
    public array $fm = [];

    #[Locked]
    public ?Article $article = null;


    public function mount(?Article $article): void
    {
        $this->article = $article ?? null;
        $this->content = $this->article->content ?? '<p>write your article here</p>';
        $this->fm = $this->article?->fm ?? [];
    }

    public function save(string $content, array $state): void
    {
        $title = $state['title'] ?? fake()->unique()->realText(16);;
        if ($this->article) {
            $this->article->update(['content' => $content, 'fm' => $state, 'title' => $title]);
        } else {
            $this->article = Auth::user()->articles()->create(['content' => $content, 'fm' => $state, 'title' => $title]);
        }
        Flux::toast('article saved');
    }

    public function render(): View
    {
        return view('livewire.articles.editor');
    }
}
