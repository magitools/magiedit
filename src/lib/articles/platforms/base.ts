export const supportedPlatforms = new Map<string, new () => BasePlatform>();
export function RegisterPlatform(constructor: new () => BasePlatform) {
	supportedPlatforms.set(constructor.name, constructor);
}

export abstract class BasePlatform {
	settings: Record<string, unknown> = {};
	frontmatter: Record<string, unknown> = {};
	tags: string[] = [];
	abstract publish(content: string): void;
	abstract setSettings(settings: Record<string, unknown>): BasePlatform;
	abstract getRequiredSettings(): IPlatformSetting[];
	abstract setFrontmatter(data: Record<string, unknown>): BasePlatform;
	abstract setTags(data: string[]): BasePlatform;
	abstract validate(): boolean;
	abstract getPlatformName(): string;
}

export interface IPlatformSetting {
	type: string;
	name: string;
	label: { htmlFor: string; value: string };
	settings: Record<string, unknown>;
}
