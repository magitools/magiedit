<?php

namespace App\Livewire\Articles;

use Livewire\Attributes\Computed;
use Livewire\Component;

class Editor extends Component
{
    public string $content = "";

    #[Computed]
    public function frontmatter() {
        return [];
    }

    public function render()
    {
        return view('livewire.articles.editor');
    }
}
