<x-layouts.app>
    <div class="flex">
        <flux:spacer />
        <flux:button variant="primary" href="{{route('app.articles.create')}}">Create Article</flux:button>
    </div>
    <livewire:articles.table />
</x-layouts.app>
