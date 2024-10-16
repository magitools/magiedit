<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($this->publishers as $publisher)
            <flux:card class="space-y-6" wire:key="publisher-{{$publisher->id}}">
                <div>
                    <flux:heading>{{$publisher->name}}</flux:heading>
                    <flux:subheading>{{$publisher->created_at}}</flux:subheading>
                </div>
                <div class="w-full flex">
                    <flux:spacer />
                    <div class="flex space-x-4">
                        <flux:button href="{{route('app.publishers.edit', ['publisher' => $publisher->id])}}" variant="primary">Edit</flux:button>
                        <flux:button wire:click="deletePublisher({{$publisher->id}})" variant="danger">Delete</flux:button>
                    </div>
                </div>
            </flux:card>
        @endforeach
    <flux:modal name="delete-publisher" class="space-y-6">
        <div>
            <flux:heading>Delete publisher?</flux:heading>
            <flux:subheading>
                <p>You are about to delete this publisher.</p>
                <p>This action cannot be reversed</p>
            </flux:subheading>
        </div>
        <div class="flex gap-2">
            <flux:spacer />

            <flux:modal.close>
                <flux:button variant="ghost">cancel</flux:button>
            </flux:modal.close>
            <flux:button wire:click="destroyPublisher()" type="submit" variant="danger">Delete article</flux:button>
        </div>
    </flux:modal>
</div>
