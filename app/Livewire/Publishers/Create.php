<?php

namespace App\Livewire\Publishers;

use App\Publishers\PublisherContract;
use Flux\Flux;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Spatie\StructureDiscoverer\Discover;

class Create extends Component
{
    public array $providers = [];

    public string $selectedProvider = '';

    public array $formData = [];

    #[Computed]
    public function inputs()
    {
        if (! class_exists($this->selectedProvider)) {
            return [];
        }

        $instance = new $this->selectedProvider;

        return $instance->getInputs();
    }

    public function mount()
    {
        $providers = Discover::in(app_path('Publishers'))->classes()->implementing(PublisherContract::class)->get();

        $this->providers = array_map(function ($el) {
            $classInstance = new $el;

            return [
                'name' => $classInstance->getName(),
                'value' => $el,
            ];
        }, $providers);
    }

    public function save()
    {
        Auth::user()->publishers()->create([
            'data' => $this->formData,
           'class_name' => $this->selectedProvider
        ]);
        Flux::toast('publisher created');
        $this->redirectRoute('app.publishers.index');
    }

    public function render()
    {
        return view('livewire.publishers.create');
    }
}
