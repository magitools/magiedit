import { db, type Article } from "$lib/storage/db";
import type {IBasePlatform} from "./base";


export class DevPlatform implements IBasePlatform {

    public getRequiredSettings(): string[] {
        return ["dev_token"];
    }

    public async publish(article: Article) {
        const settings = await db.settings.toArray();
        const setting = settings.find((e) => e.name === "dev_token" && e.value)
        if (!setting) return;
        await fetch("https://dev.to/api/articles", {
            method: "post",
            body: JSON.stringify({
                article: {
                    "title": article.title,
                    "body_markdown": article.content,
                    "published": article.published
                }
            }),
            headers: {
                "accept": "application/vnd.forem.api-v1+json",
                "api-Key": setting.value,
            }
        })
    }
}