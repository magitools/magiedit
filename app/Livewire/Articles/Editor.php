<?php

namespace App\Livewire\Articles;

use App\Models\Article;
use Flux\Flux;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Spatie\YamlFrontMatter\YamlFrontMatter;

class Editor extends Component
{
    public string $content = 'write your article here';

    protected ?Article $article = null;

    #[Computed]
    public function frontmatter(): array
    {
        return [];
    }

    public function mount(?Article $article): void
    {
        $this->article = $article ?? null;
        $this->content = $this->article->content ?? 'write your article here';
    }

    public function save(string $content): void
    {
        $parsed = YamlFrontMatter::parse($content);
        $title = $parsed->matter('title');
        if ($this->article) {
            $this->article->update(['content' => $content, 'fm' => $parsed->matter(), 'title' => $title]);
        } else {
            $title = $title ? $title : fake()->unique()->realText(16);
            $this->article = Auth::user()->articles()->create(['content' => $content, 'fm' => $parsed->matter(), 'title' => $title]);
        }
        Flux::toast('article saved');
    }

    public function render(): View
    {
        return view('livewire.articles.editor');
    }
}
