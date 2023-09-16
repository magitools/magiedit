import type { UserPreferences } from '$lib/server/drizzle';
import type { Article } from '$lib/storage/db';

export const supportedPlatforms: (new () => IBasePlatform<any>)[] = [];
export function RegisterPlatform(constructor: new () => IBasePlatform<any>) {
	supportedPlatforms.push(constructor);
}

export interface IBasePlatform<T> {
	settings: Record<string, string>;
	publish(article: Article): void;
	setSettings(settings: UserPreferences[]): T;
	getRequiredSettings(): string[];
	getPlatformName(): string;
}
