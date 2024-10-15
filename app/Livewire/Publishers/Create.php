<?php

namespace App\Livewire\Publishers;

use App\Publishers\PublisherContract;
use Livewire\Attributes\Computed;
use Spatie\StructureDiscoverer\Discover;
use Livewire\Component;

class Create extends Component
{
    public array $providers = [];

    public function mount()
    {
        $providers = Discover::in(app_path("Publishers"))->classes()->implementing(PublisherContract::class)->get();

        $this->providers = array_map(function ($el) {
            $classInstance = new $el();
            return [
                'name' => $classInstance->getName()
            ];
        }, $providers);
    }

    public function render()
    {
        return view('livewire.publishers.create');
    }
}
