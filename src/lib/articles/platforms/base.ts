export const supportedPlatforms = new Set<new () => IBasePlatform<any>>();
export function RegisterPlatform(constructor: new () => IBasePlatform<any>) {
	if (supportedPlatforms.has(constructor)) supportedPlatforms.delete(constructor);
	supportedPlatforms.add(constructor);
}

export interface IBasePlatform<T> {
	settings: Record<string, string>;
	frontmatter: Record<string, any>;
	publish(content: string): void;
	setSettings(settings: Record<string, any>): T;
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
