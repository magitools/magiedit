<div class="w-full h-"full">
<div>
    <flux:button id="saveButton">Save</flux:button>
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
