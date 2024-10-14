<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
        @vite('resources/css/app.css')
        @fluxStyles
    </head>
    <body class="min-h-screen bg-white dark:bg-zinc-800">
        <flux:header container class="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
        <flux:sidebar.toggle class="lg:hidden" icon="bars-2" inset="left" />

        <flux:brand href="#" logo="https://fluxui.dev/img/demo/logo.png" name="Magiedit" class="max-lg:hidden dark:hidden" />
        <flux:brand href="#" logo="https://fluxui.dev/img/demo/dark-mode-logo.png" name="Magiedit" class="max-lg:!hidden hidden dark:flex" />
        @auth
        <flux:navbar class="-mb-px max-lg:hidden">
            <flux:navbar.item icon="home" href="#" current>Articles</flux:navbar.item>
            <flux:navbar.item icon="inbox" badge="12" href="#">Publishers</flux:navbar.item>
        </flux:navbar>

        <flux:spacer />

        <flux:navbar class="mr-4">
            <flux:navbar.item icon="magnifying-glass" href="#" label="Search" />
            <flux:navbar.item class="max-lg:hidden" icon="cog-6-tooth" href="#" label="Settings" />
            <flux:navbar.item class="max-lg:hidden" icon="information-circle" href="#" label="Help" />
        </flux:navbar>

        <flux:dropdown position="top" align="start">
            <flux:profile avatar="https://robohash.org/{{Auth::user()->email}}" />

            <flux:menu>
                <flux:menu.separator />

                <flux:menu.item href="{{route('logout')}}" icon="arrow-right-start-on-rectangle">Logout</flux:menu.item>
            </flux:menu>
        </flux:dropdown>
        @endauth
    </flux:header>
        <flux:sidebar stashable sticky class="lg:hidden bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
            <flux:sidebar.toggle class="lg:hidden" icon="x-mark" />

            <flux:brand href="#" logo="https://fluxui.dev/img/demo/logo.png" name="Magiedit" class="px-2 dark:hidden" />
            <flux:brand href="#" logo="https://fluxui.dev/img/demo/dark-mode-logo.png" name="Magiedit" class="px-2 hidden dark:flex" />
        @auth
        <flux:navlist variant="outline">
            <flux:navlist.item icon="home" href="#" current>Articles</flux:navlist.item>
            <flux:navlist.item icon="inbox" badge="12" href="#">Publishers</flux:navlist.item>
        </flux:navlist>

        <flux:spacer />

        <flux:navlist variant="outline">
            <flux:navlist.item icon="cog-6-tooth" href="#">Settings</flux:navlist.item>
            <flux:navlist.item icon="information-circle" href="#">Help</flux:navlist.item>
        </flux:navlist>
        @endauth
    </flux:sidebar>
        <flux:main container>
        {{ $slot }}
        </flux:main>
        @fluxScripts
    </body>
</html>
