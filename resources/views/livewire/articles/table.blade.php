<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($articles as $article)
            <flux:card class="space-y-6" wire:key="article-{{$article->id}}">
                <div>
                    <flux:heading>{{$article->title}}</flux:heading>
                    <flux:subheading>{{$article->created_at}}</flux:subheading>
                </div>
                <div class="w-full flex">
                    <flux:spacer />
                    <div class="flex space-x-4">
                        <flux:button href="{{route('app.articles.edit', ['article' => $article->id])}}" variant="primary">Edit</flux:button>
                        <flux:button wire:click="publishPost({{$article->id}})">Publish</flux:button>
                        <flux:button wire:click="previewPost({{$article->id}})">Preview</flux:button>
                        <flux:button wire:click="deletePost({{$article->id}})" variant="danger">Delete</flux:button>
                    </div>
                </div>
            </flux:card>
        @endforeach
    <flux:modal name="delete-article" class="space-y-6">
        <div>
            <flux:heading>Delete article?</flux:heading>
            <flux:subheading>
                <p>You are about to delete this article.</p>
                <p>This action cannot be reversed</p>
            </flux:subheading>
        </div>
        <div class="flex gap-2">
            <flux:spacer />

            <flux:modal.close>
                <flux:button variant="ghost">cancel</flux:button>
            </flux:modal.close>
            <flux:button wire:click="destroyPost()" type="submit" variant="danger">Delete article</flux:button>
        </div>
    </flux:modal>
    <flux:modal name="preview-article" class="space-y-6">
        <div class="text-black dark:text-white">
            {{ $previewContent }}
        </div>
        <div class="flex w-full">
            <flux:spacer />
            <flux:modal.close>
                <flux:button variant="ghost">close</flux:button>
            </flux:modal.close>
        </div>
    </flux:modal>
</div>

