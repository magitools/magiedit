// @ts-nocheck
import { db } from "$lib/storage/db";
import type { PageLoad } from "./$types";

export const load = async (event: Parameters<PageLoad>[0]) => {
    if (event.params.id === "new") {
        return {}
    }
    const article = await db.articles.get(Number(event.params.id));
    return {article}
};


export const ssr = false