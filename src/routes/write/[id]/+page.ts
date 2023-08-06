import { db } from "$lib/storage/db";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
    if (event.params.id === "new") {
        return {}
    }
    const article = await db.articles.get(Number(event.params.id));
    return {article}
};


export const ssr = false