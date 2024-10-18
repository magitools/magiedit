<?php

namespace App\Livewire\Profile\Keys;

use Flux\Flux;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Table extends Component
{
    public Collection $keys;

    public int $keyToDelete;

    public string $tokenName;

    public string $textToken = "";

    public function getKeys()
    {
        $this->keys = Auth::user()->tokens;
    }

    public function deleteKey(int $id)
    {
        $this->keyToDelete = $id;
        Flux::modal('key-delete')->show();
    }

    public function destroyKey()
    {
        Auth::user()->tokens()->where('id', $this->keyToDelete)->delete();
        Flux::toast('API key deleted');
        Flux::modal('key-delete')->close();
        $this->getKeys();
    }

    public function createApiKey() {
        $data = Auth::user()->createToken($this->tokenName);
        $this->textToken = $data->plainTextToken;
        $this->getKeys();
        Flux::modal('key-create')->close();
        Flux::modal('key-preview')->show();
    }

    public function mount()
    {
        $this->getKeys();
    }
    public function render()
    {
        return view('livewire.profile.keys.table');
    }
}
