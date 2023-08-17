import { db } from "$lib/storage/db";

export const generateArticleBlob = async (id: number) : Promise<Blob> => {
    const article = await db.articles.get(id);

    const text = `${article?.content}`

    const blob = new Blob([text], {type: "text/plain"});

    return blob;
}