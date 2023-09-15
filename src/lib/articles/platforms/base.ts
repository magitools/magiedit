import type { Article } from '$lib/storage/db';

export interface IBasePlatform<T> {
	settings: Record<string, string>;
	publish(article: Article): void;
	setSettings(settings: Record<string, string>): T;
	getRequiredSettings(): string[];
}
