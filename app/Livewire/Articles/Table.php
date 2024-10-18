<?php

namespace App\Livewire\Articles;

use App\Models\Article;
use App\Models\Publisher;
use App\Publishers\PublisherContract;
use Flux\Flux;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Locked;
use Livewire\Component;

class Table extends Component
{
    public Collection $articles;

    #[Locked]
    public int $selectedId = -1;

    public string $previewContent = '';

    public Collection $publishers;

    public array $selectedProviders = [];

    public function mount()
    {
        $this->articles = Auth::user()->articles;
        $this->publishers = Auth::user()->publishers;
    }

    public function render()
    {
        return view('livewire.articles.table');
    }

    public function deletePost(int $id)
    {
        $this->selectedId = $id;
        Flux::modal('delete-article')->show();
    }

    public function destroyPost()
    {
        Flux::modal('delete-article')->close();
        Article::destroy([$this->selectedId]);
        $this->articles = Auth::user()->articles;
        Flux::toast('Deleted article');
    }

    public function previewPost(int $id)
    {
        // get content
        // show content
        $this->previewContent = Article::query()->find($id)->content;
        Flux::modal('preview-article')->show();
    }

    public function publishPost(int $id)
    {
        $this->selectedId = $id;
        Flux::modal('publisher-select')->show();
    }

    public function sendPost()
    {
        // get article content and fm
        $article = Article::query()->find($this->selectedId);
        $publishers = Publisher::query()->whereIn('id', $this->selectedProviders)->get();
        foreach($publishers as $publisher) {
            /**
             * @var PublisherContract $className
             */
            $className = $publisher->class_name;
            $instance = new $className();
            $res = $instance->setFm($article->fm)
                ->setData($publisher->data)
                ->publish($article->content);
            Flux::modal('publisher-select')->close();
        }
    }
}
