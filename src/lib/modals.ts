import type { ModalComponent } from '@skeletonlabs/skeleton';
import Giphy from '$lib/components/commands/giphy.svelte';
import Unsplash from './components/commands/unsplash.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	giphyModal: {
		ref: Giphy
	},
	unsplashModal: {
		ref: Unsplash
	}
};
