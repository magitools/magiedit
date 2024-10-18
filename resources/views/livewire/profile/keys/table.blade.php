<div>
    <div class="flex w-full">
        <flux:spacer />
        <flux:modal.trigger name="key-create">
            <flux:button variant="primary">Create API Key</flux:button>
        </flux:modal.trigger>
    </div>
    <flux:table>
        <flux:columns>
            <flux:column>Name</flux:column>
            <flux:column>Created At</flux:column>
            <flux:column>Actions</flux:column>
        </flux:columns>
        <flux:rows>
            @foreach($this->keys as $key)
                <flux:row wire:key="key-{{$key->id}}">
                    <flux:cell>{{$key->name}}</flux:cell>
                    <flux:cell>{{$key->created_at}}</flux:cell>
                    <flux:cell>
                        <flux:dropdown>
                            <flux:button icon-trailing="chevron-down">...</flux:button>
                            <flux:menu>
                                <flux:menu.item wire:click="deleteKey({{$key->id}})" variant="danger" icon="trash">Delete</flux:menu.item>
                            </flux:menu>
                        </flux:dropdown>
                    </flux:cell>
                </flux:row>
            @endforeach
        </flux:rows>
    </flux:table>

    <flux:modal name="key-create" class="space-y-6">
        <form wire:submit="createApiKey()" class="space-y-6">
            <div>
                <flux:heading>Create API Key ?</flux:heading>
                <flux:subheading>
                    <p></p>
                </flux:subheading>
            </div>
            <div>
                <flux:input label="API Key name" required wire:model="tokenName" placeholder="write your api key name here" />
            </div>
            <div class="flex w-full gap-2">
                <flux:modal.close>
                    <flux:button variant="ghost">Cancel</flux:button>
                </flux:modal.close>
                    <flux:button type="submit">Create API Key</flux:button>
            </div>
        </form>
    </flux:modal>
    <flux:modal name="key-preview" class="space-y-6">
        <div x-data="">
            <flux:heading>Here's your new API key</flux:heading>
            <flux:subheading>
                <p>Make sure to save it somewhere; you won't be able to see it again</p>
                <p x-clipboard>{{$this->textToken}}</p>
            </flux:subheading>
        </div>
        <div class="flex w-full">
            <flux:modal.close>
                <flux:button variant="ghost">Ok</flux:button>
            </flux:modal.close>
        </div>
    </flux:modal>
    <flux:modal name="key-delete" class="space-y-6">
        <div>
            <flux:heading>Delete Key?</flux:heading>
            <flux:subheading>
                <p>You are about to delete this API Key</p>
                <p>this action is irreversible</p>
            </flux:subheading>
        </div>
        <div class="flex w-full gap-2">
            <flux:modal.close>
                <flux:button variant="ghost">Cancel</flux:button>
            </flux:modal.close>
            <flux:button wire:click="destroyKey()" >Delete API Key</flux:button>
        </div>
    </flux:modal>
</div>
