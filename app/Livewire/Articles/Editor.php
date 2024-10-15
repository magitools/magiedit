<?php

namespace App\Livewire\Articles;

use App\Models\Article;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Spatie\YamlFrontMatter\YamlFrontMatter;

class Editor extends Component
{
    public string $content = "write your article here";
    protected ?Article $article = null;

    #[Computed]
    public function frontmatter() {
        return [];
    }

    public function save(string $content) {
        $parsed = YamlFrontMatter::parse($content);
        $title = $parsed->matter('title');
        if ($this->article) {
            $this->article->update(['content' => $content, 'fm' => $parsed->matter, 'title' => $title]);
        } else {
            $title = $title ? $title : fake()->unique()->realText(16);
            $this->article = Auth::user()->articles()->create(['content' => $content, 'fm' => json_encode($parsed->matter), 'title' => $title]);
        }
    }

    public function render()
    {
        return view('livewire.articles.editor');
    }
}
