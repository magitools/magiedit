import type { ModalComponent } from '@skeletonlabs/skeleton';
import Giphy from '$lib/components/commands/giphy.svelte';
import Unsplash from '$lib/components/commands/unsplash.svelte';
import OpenAIIMage from '$lib/components/commands/openai/image.svelte';
export const modalRegistry: Record<string, ModalComponent> = {
	giphyModal: {
		ref: Giphy
	},
	unsplashModal: {
		ref: Unsplash
	},
	openAiImageModal: {
		ref: OpenAIIMage
	}
};
