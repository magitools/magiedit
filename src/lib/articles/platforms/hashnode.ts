import type { UserPreferences } from '$lib/server/drizzle';
import type { Article } from '$lib/storage/db';
import { RegisterPlatform, type IBasePlatform } from './base';

@RegisterPlatform
export class HashnodePlatform implements IBasePlatform<HashnodePlatform> {
	settings: Record<string, string> = {};

	getRequiredSettings(): string[] {
		return ['hashnode_token', 'hashnode_publication_id'];
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
		const token = this.settings['hasnode_token'];
		const publication = this.settings['hashnode_publication_id'];
		if (!token || !publication) return;
		await fetch('https://api.hashnode.com', {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				query:
					'mutation createStory($input: CreateStoryInput!){ createStory(input: $input){ code success message } }',
				variables: {
					input: {
						title: article.title,
						contentMarkdown: article.content,
						tags: [],
						isPartOfPublication: {
							publicationId: publication
						}
					}
				}
			})
		});
	}
}
