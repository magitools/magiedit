import ForemClient from '@magitools/forem-wrapper';
import { RegisterPlatform, type IBasePlatform, type IPlatformSetting } from './base';

@RegisterPlatform
export class DevPlatform implements IBasePlatform<DevPlatform> {
	settings: Record<string, string> = {};
	frontmatter: Record<string, any> = {};
	public getRequiredSettings(): IPlatformSetting[] {
		return [
			{
				type: 'input',
				name: 'api_token',
				label: { htmlFor: 'api_key', value: 'API Key' },
				settings: { type: 'text', required: true }
			}
		];
	}

	getPlatformName(): string {
		return 'dev.to';
	}

	setSettings(settings: Record<string, any>) {
		this.settings = { ...settings };
		return this;
	}

	setFrontmatter(data: Record<string, any>): DevPlatform {
		this.frontmatter = data;
		return this;
	}

	public async publish(content: string) {
		const setting = this.settings['api_token'];
		if (!setting) throw new Error('could not find required settings');
		try {
			await new ForemClient().setApiKey(setting).article.publishArticle({
				title: this.frontmatter.title,
				body_markdown: content,
				published: this.frontmatter.published || false
			});
		} catch (error) {
			throw new Error('something went wrong');
		}
	}
}
