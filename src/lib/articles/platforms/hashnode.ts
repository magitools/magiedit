import { db, type Article } from '$lib/storage/db';
import type { IBasePlatform } from './base';

export class HashnodePlatform implements IBasePlatform<HashnodePlatform> {
	settings: Record<string, string> = {};

	getRequiredSettings(): string[] {
		return ['hashnode_token', 'hashnode_publication_id'];
	}

	setSettings(settings: Record<string, string>) {
		this.settings = settings;
		return this;
	}

	public async publish(article: Article) {
		const token = await db.settings.get({ name: 'hashnode_token' });
		const publication = await db.settings.get({ name: 'hashnode_publication_id' });
		if (!token || !publication) return;
		await fetch('https://api.hashnode.com', {
			headers: {
				Authorization: token.value,
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
							publicationId: publication.value
						}
					}
				}
			})
		});
	}
}
