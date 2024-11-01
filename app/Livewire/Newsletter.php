<?php

namespace App\Livewire;

use Flux\Flux;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Http;
use Livewire\Component;

class Newsletter extends Component
{
    public string $email;
    public string $name;

    public function render(): View
    {
        return view('livewire.newsletter');
    }

    public function addToNewsletter(): void
    {
        $res = Http::withBasicAuth(config('newsletter.username'), config('newsletter.password'))->post(
            config('newsletter.url') . '/api/subscribers',
            [
            "email" => $this->email,
            "name" => $this->name,
            "status" => "enabled",
            "lists" => [intval(config('newsletter.listId'))],
            'attribs' => [
                'magitools' => 'magiedit'
            ]
        ]
        );
        if ($res->status() < 300) {
            Flux::toast('Thank you for subscribing!');
        } else {
            Flux::toast('Something went wrong, please try subscribing again');
        }
    }
}
