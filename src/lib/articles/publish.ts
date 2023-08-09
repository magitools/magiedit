import { db } from "../storage/db"
import { DevPlatform } from "./platforms/dev";

export const publish = async (id: string) => {
    const article = await db.articles.get(id);
    if (!article) return;
    const settings = await db.settings.toArray();

    if (settings.find((e) => e.name === "dev_token")) {
        await new DevPlatform().publish(article)
    }

}