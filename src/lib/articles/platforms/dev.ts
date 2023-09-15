import type { Article } from '$lib/storage/db';
import type { IBasePlatform } from './base';

export class DevPlatform implements IBasePlatform<DevPlatform> {
	settings: Record<string, string> = {};
	public getRequiredSettings(): string[] {
		return ['dev'];
	}

	public setSettings(settings: Record<string, string>) {
		this.settings = settings;
		return this;
	}

	public async publish(article: Article) {
		const setting = this.settings['dev'];
		console.log(this.settings);
		if (!setting) return;
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
			console.log(res.statusText);
		}
	}
}
