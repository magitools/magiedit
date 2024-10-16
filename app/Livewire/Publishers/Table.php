<?php

namespace App\Livewire\Publishers;

use App\Models\Publisher;
use Flux\Flux;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Table extends Component
{
    public Collection $publishers;

    public int $selectedPublisher;

    public function deletePublisher(int $id)
    {
        $this->selectedPublisher = $id;
        Flux::modal('delete-publisher')->show();
    }

    public function getPublishers()
    {
        $this->publishers = Auth::user()->publishers;
    }

    public function destroyPublisher()
    {
        Flux::modal('delete-publisher')->close();
        Publisher::destroy([$this->selectedPublisher]);
        $this->getPublishers();
        Flux::toast('publisher deleted');
    }

    public function mount()
    {
        $this->getPublishers();
    }

    public function render()
    {
        return view('livewire.publishers.table');
    }
}
