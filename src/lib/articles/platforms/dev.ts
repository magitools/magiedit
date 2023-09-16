import type { UserPreferences } from '$lib/server/drizzle';
import type { Article } from '$lib/storage/db';
import { RegisterPlatform, type IBasePlatform } from './base';

@RegisterPlatform
export class DevPlatform implements IBasePlatform<DevPlatform> {
	settings: Record<string, string> = {};
	public getRequiredSettings(): string[] {
		return ['dev'];
	}

	getPlatformName(): string {
		return 'dev.to';
	}

	setSettings(settings: UserPreferences[]) {
		settings.forEach((e) => {
			if (this.getRequiredSettings().includes(e.key.split(':')[1])) {
				this.settings[e.key.split(':')[1]] = e.value;
			}
		});
		return this;
	}

	public async publish(article: Article) {
		const setting = this.settings['dev'];
		if (!setting) throw new Error('could not find required settings');
		const res = await fetch('https://dev.to/api/articles', {
			method: 'post',
			body: JSON.stringify({
				article: {
					title: article.title,
					body_markdown: article.content,
					published: article.published
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
