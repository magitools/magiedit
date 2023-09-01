import { GIPHY_TOKEN } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async({fetch, request, url}) => {
    const query = url.searchParams.get("query")
    const page = url.searchParams.has("page") ? parseInt(url.searchParams.get("page")!) : 0
    if (!query) {
        throw "Invalid url format"
    }
    const requestUrl = new URL("https://api.giphy.com/v1/gifs/search")
    requestUrl.searchParams.append("api_key", GIPHY_TOKEN)
    requestUrl.searchParams.append("q", query)
    requestUrl.searchParams.append("page", (page * 25).toString())

    const results = await (await fetch(requestUrl)).json()
    console.log(results)
    return json({data: results.data})
}