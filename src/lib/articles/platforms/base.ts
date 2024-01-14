import type { UserPreferences } from '$lib/server/drizzle';

export const supportedPlatforms: (new () => IBasePlatform<any>)[] = [];
export function RegisterPlatform(constructor: new () => IBasePlatform<any>) {
	if (supportedPlatforms.find((e) => e == constructor)) return;
	supportedPlatforms.push(constructor);
}

export interface IBasePlatform<T> {
	settings: Record<string, string>;
	frontmatter: Record<string, any>;
	publish(content: string): void;
	setSettings(settings: UserPreferences[]): T;
	getRequiredSettings(): IPlatformSetting[];
	setFrontmatter(data: Record<string, any>): T;
	getPlatformName(): string;
}

export interface IPlatformSetting {
	type: string;
	name: string;
	label: { htmlFor: string; value: string };
	settings: Record<string, unknown>;
}
