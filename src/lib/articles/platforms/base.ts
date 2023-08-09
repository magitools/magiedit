import type { Article } from "$lib/storage/db";

export abstract class BasePlatform {

    public abstract publish(article: Article)
}