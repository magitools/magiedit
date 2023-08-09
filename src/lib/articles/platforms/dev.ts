import { db, type Article } from "$lib/storage/db";
import type { BasePlatform } from "./base";


export class DevPlatform implements BasePlatform {
    public async publish(article: Article) {
        const token = await db.settings.where("name").equals("dev_token").toArray();
        if (!token) return;
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
                "api-Key": token[0].value,
            }
        })
    }
}