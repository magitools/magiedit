import { db } from "$lib/storage/db";
import type { PageLoad } from "./$types";


export const load: PageLoad = async () => {

    const settings = await db.settings.toArray();


    return {settings}
};


export const ssr = false