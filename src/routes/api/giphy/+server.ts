import { GIPHY_TOKEN } from "$env/static/private";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { json, type RequestHandler } from "@sveltejs/kit";

const client = new GiphyFetch(GIPHY_TOKEN)

export const GET: RequestHandler = async({fetch, request, url}) => {
    const query = url.searchParams.get("query")
    const page = url.searchParams.has("page") ? parseInt(url.searchParams.get("page")!) : 0
    if (!query) {
        throw "Invalid url format"
    }
    const results = await client.search(query, {
        type: "gifs",
        offset: page * 25
    })
    return json({data: results.data})
}