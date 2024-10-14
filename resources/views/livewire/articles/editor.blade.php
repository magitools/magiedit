<div class="w-full h-full relative" x-data="{loading:true}" @initial-done.window="loading = false">
    <div
    x-show="loading"
    x-transition:enter="transition-transform transition-opacity"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"

    class="absolute inset-0 bg-white dark:bg-zinc-800 z-50 flex flex-col items-center justify-center">
        <p>Parsing the initial file, please wait...</p>
    </div>
    <div>
        <flux:button id="saveButton" >Save</flux:button>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div id="editor" class="max-h-full">
        </div>
        <flux:card>
            <div class="w-full prose" id="preview"></div>
        </flux:card>
    </div>
</div>

@vite('resources/js/editor.js')
