<div>
    <form wire:submit="addToNewsletter" class="space-y-6">
        <flux:input required wire:model="name" label="name" placeholder="your name here..." description="what is your name ?" />
        <flux:input required wire:model="email" type="email" label="email" placeholder="type your email here..." description="enter the email address you wish to receive messages on" />
        <flux:button type="submit">Subscribe</flux:button>
    </form>
</div>
