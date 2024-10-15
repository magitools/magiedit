<div>
    <flux:select placeholder="choose a publishers">
        @foreach($this->providers as $provider)
            <flux:option>{{$provider['name']}}</flux:option>
        @endforeach
    </flux:select>
</div>
