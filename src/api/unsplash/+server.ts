import { UNSPLASH_ACCESS } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";
import { createApi } from "unsplash-js";

export const GET: RequestHandler = async({request, url}) => {
    if(url.searchParams.get("search")) {
        const data = await (await (fetch(`https://api.unsplash.com/search/photos?search=${url.searchParams.get("search")}&page=${url.searchParams.get("page") ?? 1}`, {
            headers: {
                "Authorization":`Client-ID ${UNSPLASH_ACCESS}`
            }
        }))).json()
        if (data) {
            return json({
                photos: data.results
            })
        }
    }
}