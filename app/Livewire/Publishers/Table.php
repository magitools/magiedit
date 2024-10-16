<?php

namespace App\Livewire\Publishers;

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

    public function destroyPublisher()
    {
        Flux::modal('delete-publisher')->close();
        Flux::toast('publisher deleted');
    }

    public function mount() {
        $this->publishers = Auth::user()->publishers;
    }

    public function render()
    {
        return view('livewire.publishers.table');
    }
}
