<?php

namespace App\Livewire\Articles;

use Livewire\Attributes\Computed;
use Livewire\Component;

class Editor extends Component
{
    public string $content = "write your article here";
    public bool $initialLoad = true;

    #[Computed]
    public function frontmatter() {
        return [];
    }

    public function save(string $content) {
        dd($content);
    }

    public function render()
    {
        return view('livewire.articles.editor');
    }
}
