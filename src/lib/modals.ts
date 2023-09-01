import type { ModalComponent } from "@skeletonlabs/skeleton";
import Giphy from "$lib/components/commands/giphy.svelte"

export const modalRegistry: Record<string, ModalComponent> = {
    giphyModal: {
        ref: Giphy
    }
}