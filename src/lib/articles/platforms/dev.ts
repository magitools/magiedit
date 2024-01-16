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
		const res = await fetch('https://dev.to/api/articles', {
			method: 'post',
			body: JSON.stringify({
				article: {
					title: this.frontmatter.title,
					body_markdown: content,
					published: this.frontmatter.published || false
				}
			}),
			headers: {
				accept: 'application/vnd.forem.api-v1+json',
				'content-type': 'application/json',
				'api-key': setting
			}
		});
		if (!res.ok) {
			throw new Error('something went wrong');
		}
	}
}
