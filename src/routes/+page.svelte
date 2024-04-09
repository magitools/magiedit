<script lang="ts">
	import '$lib/articles/platforms';
	import { supportedPlatforms } from '$lib/articles/platforms/base';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import ToyBrick from 'lucide-svelte/icons/toy-brick';
	import Pen from 'lucide-svelte/icons/pen';
	import Newspaper from 'lucide-svelte/icons/newspaper';
</script>

<div class="w-full h-full flex flex-col justify-center items-center bg-background space-y-4">
	<div>
		<h1 class="font-bold text-5xl uppercase">magiedit</h1>
	</div>
	<div>
		<p>your companion for writing and publishing markdown</p>
	</div>
	<div>
		<Button href="/app" class="w-full">Get Writing</Button>
	</div>
	<p class="font-bold text-3xl capitalize mt-4 mb-2">features</p>
	<div class="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		<div
			class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
		>
			<Pen />
			<h2 class="capitalize mt-4 text-xl font-bold text-dark dark:text-white">Write markdown</h2>
			<p class="mt-1 text-sm text-gray-800 dark:text-gray-300">
				take advantage of codemirror and the live preview beside it to write <b>blazingly fast</b> markdown
			</p>
		</div>
		<div
			class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
		>
			<ToyBrick />
			<h2 class="capitalize mt-4 text-xl font-bold text-black dark:text-white">integrations</h2>
			<p>need an image? A gif? get them right from your editor with our integrations</p>
		</div>
		<div
			class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
		>
			<Newspaper />
			<h2 class="mt-4 capitalize text-xl font-bold text-black dark:text-white">publications</h2>
			<p class="mt-1 text-sm text-gray-800 dark:text-gray-300">
				send your articles off directly from your homepage, to as many providers as you need
			</p>
		</div>
	</div>
	<p class="font-bold text-3xl capitalize mt-4 mb-2">platforms</p>
	<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 capitalize">
		{#each supportedPlatforms as platform}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-center">
						{new platform().getPlatformName()}
					</Card.Title>
				</Card.Header>
			</Card.Root>
		{/each}
	</div>
</div>
