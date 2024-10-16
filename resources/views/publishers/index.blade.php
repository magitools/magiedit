<x-layouts.app>
    <div class="flex">
        <flux:spacer />
        <flux:button variant="primary" href="{{route('app.publishers.create')}}">Create Püblisher</flux:button>
    </div>
    <livewire:publishers.table />
</x-layouts.app>
