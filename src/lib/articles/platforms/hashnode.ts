import type { UserPreferences } from '$lib/server/drizzle';
import { RegisterPlatform, type IBasePlatform } from './base';

//@RegisterPlatform
export class HashnodePlatform implements IBasePlatform<HashnodePlatform> {
	settings: Record<string, string> = {};
	frontmatter: Record<string, any> = {};
	getRequiredSettings(): string[] {
		return ['hash_token', 'hash_publication'];
	}

	getPlatformName(): string {
		return 'hashnode';
	}

	setSettings(settings: UserPreferences[]) {
		settings.forEach((e) => {
			if (this.getRequiredSettings().includes(e.key.split(':')[1])) {
				this.settings[e.key.split(':')[1]] = e.value;
			}
		});
		return this;
	}

	setFrontmatter(data: Record<string, any>): HashnodePlatform {
		this.frontmatter = data;
		return this;
	}

	public async publish(content: string) {
		const token = this.settings['hash_token'];
		const publication = this.settings['hash_publication'];
		if (!token || !publication) throw new Error('could not find required settings');
		const res = await fetch('https://api.hashnode.com', {
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
						title: this.frontmatter.title,
						contentMarkdown: content,
						tags: [],
						isPartOfPublication: {
							publicationId: publication
						}
					}
				}
			})
		});
		if (!res.ok) {
			throw new Error('Something went wrong');
		}
	}
}
