import { db, type Article } from "$lib/storage/db";
import type {IBasePlatform} from "./base";


export class DevPlatform implements IBasePlatform {

    public getRequiredSettings(): string[] {
        return ["dev_token"];
    }

    public async publish(article: Article) {
        const token = await db.settings.get({name: "dev_token"});
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
                "Content-Type": "application/json",
                "api-Key": token.value,
            }
        })
    }
}