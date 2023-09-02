<script lang="ts">
    import type { GifsResult } from "@giphy/js-fetch-api";
	import { getModalStore } from "@skeletonlabs/skeleton";
    let query = "";
    const modalStore = getModalStore()
    const handleSearch = async() => {
        const data = await (await fetch(`/api/giphy?query=${query}`)).json()
        console.log(data)
        results = data.data
    }
    const handleImageSelected = (idx: number) => {
        if ($modalStore[0].response) {
            $modalStore[0].response(`![${results[idx].alt_text || results[idx].title}](${results[idx].images.original.url})`)
            modalStore.close();
        }
    }

    let results: GifsResult["data"] = []
</script>

<div class="w-modal-wide max-h-[50%]">
    <label for="query" class="label"><span>Search</span>
        <input type="search" name="query" id="query" class="input" bind:value={query}>
    </label>
    <button class="btn variant-filled" on:click={handleSearch} >Search</button>
    <div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
        {#each results as result, idx}
            <button on:click={() => handleImageSelected(idx)}>
                <img src={result.images.downsized_medium.url} alt={result.alt_text}  />
            </button>
        {/each}
    </div>
</div>