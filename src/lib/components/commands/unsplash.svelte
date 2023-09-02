<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { Basic } from "unsplash-js/dist/methods/photos/types";
	
    let query = "";
    const modalStore = getModalStore()
    const handleSearch = async() => {
        const data = await (await fetch(`/api/unsplash?query=${query}`)).json()
        console.log(data)
        results = data.photos
    }
    const handleImageSelected = (idx: number) => {
        if ($modalStore[0].response) {
            $modalStore[0].response(`![${results[idx].alt_description || results[idx].description}](${results[idx].urls.regular})`)
            modalStore.close();
        }
    }

    let results: Basic[] = []
</script>

<div class="w-modal-wide max-h-[50%]">
    <label for="query" class="label"><span>Search</span>
        <input type="search" name="query" id="query" class="input" bind:value={query}>
    </label>
    <button class="btn variant-filled" on:click={handleSearch} >Search</button>
    <div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
        {#each results as result, idx}
            <button on:click={() => handleImageSelected(idx)}>
                <img src={result.urls.regular} alt={result.alt_description || result.description}  />
            </button>
        {/each}
    </div>
</div>