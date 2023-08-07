import type {Actions} "$types"

export const actions: Actions = {
    default: async (ev) => {
        if (ev.url.searchParams.get("search")) {
            const data = ev.fetch(`/api/unsplash?search=${ev.url.searchParams.get("search")}`)
        }
    }
};