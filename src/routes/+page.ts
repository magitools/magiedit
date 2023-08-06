import { db } from "$lib/storage/db";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const articles = await db.articles.toArray();

    return {
        articles
    }
};

export const ssr = false