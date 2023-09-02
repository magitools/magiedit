import { UNSPLASH_ACCESS } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";
import {createApi} from "unsplash-js"
const client = createApi({accessKey: UNSPLASH_ACCESS})

export const GET: RequestHandler = async({url}) => {
    const query = url.searchParams.get("query")
    const page = url.searchParams.has("page") ? parseInt(url.searchParams.get("page")) : 1
    if(query) {
        const res = await client.search.getPhotos({query, page})
        return json({photos: res.response?.results || []})
    } else {
        throw new Error("Malformed request")
    }
}