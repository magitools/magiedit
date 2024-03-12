import ForemClient from '@magitools/forem-wrapper';
import { type IPlatformSetting, RegisterPlatform, BasePlatform } from './base';

@RegisterPlatform
export class DevPlatform extends BasePlatform {
	setFrontmatter(data: Record<string, unknown>): BasePlatform {
		this.frontmatter = data;
		return this;
	}

	setSettings(settings: Record<string, unknown>): BasePlatform {
		this.settings = { ...settings };
		return this;
	}

	validate(): boolean {
		if (this.tags.length > 4) {
			throw new Error('maximum allowed tags are 4');
		}
		if (!/^[a-zA-Z0-9,]+$/.test(this.tags.join(','))) {
			throw new Error('non-alphanumeric character detected');
		}
		return true;
	}

	setTags(data: string[]): BasePlatform {
		this.tags = data.map((e) => e.replace(/[-_]/g, ''));
		return this;
	}

	async publish(content: string) {
		const setting = this.settings['api_token'];
		if (!setting) throw new Error('could not find required settings');
		this.validate();
		try {
			await new ForemClient().setApiKey(setting as string).article.publishArticle({
				title: this.frontmatter.title as string,
				body_markdown: content,
				published: (this.frontmatter.published as boolean) || false,
				tags: this.tags.join(',')
			});
		} catch (error) {
			console.log(error);
			throw new Error(error.message);
		}
	}

	getPlatformName(): string {
		return 'dev.to';
	}
	getRequiredSettings(): IPlatformSetting[] {
		return [
			{
				type: 'input',
				name: 'api_token',
				label: { htmlFor: 'api_key', value: 'API Key' },
				settings: { type: 'text', required: true }
			}
		];
	}
}
