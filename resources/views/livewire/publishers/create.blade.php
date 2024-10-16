<div>
    <flux:select variant="listbox" searchable placeholder="choose a publishers" wire:model.live="selectedProvider">
        <x-slot name="search">
            <flux:select.search placeholder="Search..." />
        </x-slot>
        @foreach($this->providers as $provider)
            <flux:option value="{{$provider['value']}}">{{$provider['name']}}</flux:option>
        @endforeach
    </flux:select>

    <form wire:submit="save">
        @foreach($this->inputs as $input)
            @if ($input['input'] == 'input')
                <flux:input required wire:model.defer="formData.{{$input['name']}}" label='{{$input["label"]}}' description='{{$input["placeholder"]}}' />
            @endif
        @endforeach
        <flux:button type="submit" variant="primary">Create Publisher</flux:button>
    </form>
</div>
