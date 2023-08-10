import  { db, type Article } from "$lib/storage/db";
import type { BasePlatform } from "./base";

export class HashnodePlatform implements BasePlatform {

    public getRequiredSettings(): string[] {
        return ["hashnode_token", "hashnode_publication_id"]
    }

    public async publish(article: Article) {
        const token = await db.settings.where("name").equals("hashnode_token").toArray();
        const publication = await db.settings.where("name").equals("hashnode_publication_id").toArray();

        await fetch("https://api.hashnode.com", {
            headers: {
                "Authorization": token[0].value,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                query:
      'mutation createStory($input: CreateStoryInput!){ createStory(input: $input){ code success message } }',
                variables: {
                    input: {
                        title: article.title,
                        contentMarkdown: article.content,
                        tags: [],
                        isPartOfPublication: {
                            publicationId: publication[0].value
                        }
                    }
                }
            })
        })
    }
}