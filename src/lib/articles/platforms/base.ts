import type { Article } from '$lib/storage/db';

export interface IBasePlatform {
	publish(article: Article): void;
	getRequiredSettings(): string[];
}
