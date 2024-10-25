<x-layouts.app>
    <div class="space-y-6">
        <section class="space-y-6">
            <div>
                <flux:heading size="xl">Write Once, Publish Everywhere</flux:heading>
                <flux:subheading>Create, edit, and publish your articles to multiple platforms with ease. Streamline your content creation process with our powerful online editor.</flux:subheading>
            </div>
            <div>
                <flux:button href="{{route('app.articles.index')}}">Get Started</flux:button>
            </div>
        </section>
        <section class="space-y-6">
            <div class="text-center">
                <flux:heading size="xl">Key Features</flux:heading>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <flux:card>
                    <div>
                        <flux:heading size="lg">Powerful Editor</flux:heading>
                        <flux:subheading>Rich text editing with markdown support and real-time preview.</flux:subheading>
                    </div>
                </flux:card>
                <flux:card>
                    <div>
                        <flux:heading size="lg">Multi-Platform Publishing</flux:heading>
                        <flux:subheading>Publish your content to multiple platforms with a single click.</flux:subheading>
                    </div>
                </flux:card>
            </div>
        </section>
        <section class"space-y-6">
            <div class="text-center">
                <flux:heading size="xl">Supported Platforms</flux:heading>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2">
                <div class="flex flex-col items-center justify-center">
                    <div class="h-20 w-20 rounded-full bg-zinc-800 dark:bg-zinc-200 flex flex-col items-center justify-center">
                        <x-phosphor-dev-to-logo-fill class="h-16 w-16" />
                        <span>Dev.to</span>
                    </div>
                </div>
            </div>
            <div>
                <flux:button href="">Add your own</flux:button>
            </div>
        </section>
        <section class="space-y-6">

        </section>
        <section class="space-y-6">
            <div class="text-center">
                <flux:heading size="xl">Keep up with the changes!</flux:heading>
                <flux:subheading>Join your fellow editors and keep up to date with all new releases and more!</flux:subheading>
            </div>
            <livewire:newsletter />
        </section>
    </div>
</x-layouts.app>
