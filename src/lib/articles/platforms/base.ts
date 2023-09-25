import type { UserPreferences } from '$lib/server/drizzle';

export const supportedPlatforms: (new () => IBasePlatform<any>)[] = [];
export function RegisterPlatform(constructor: new () => IBasePlatform<any>) {
	supportedPlatforms.push(constructor);
}

export interface IBasePlatform<T> {
	settings: Record<string, string>;
	frontmatter: Record<string, any>;
	publish(content: string): void;
	setSettings(settings: UserPreferences[]): T;
	getRequiredSettings(): string[];
	setFrontmatter(data: Record<string, any>): T;
	getPlatformName(): string;
}
