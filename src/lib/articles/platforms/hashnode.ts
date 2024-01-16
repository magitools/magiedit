import { RegisterPlatform, type IBasePlatform, type IPlatformSetting } from './base';

@RegisterPlatform
export class HashnodePlatform implements IBasePlatform<HashnodePlatform> {
	settings: Record<string, string> = {};
	frontmatter: Record<string, any> = {};

	getRequiredSettings(): IPlatformSetting[] {
		return [
			{
				label: { htmlFor: 'hash_token', value: 'Hashnode Token' },
				name: 'hash_token',
				type: 'input',
				settings: {
					required: true,
					type: 'text'
				}
			},
			{
				label: { htmlFor: 'hash_publication', value: 'Hashnode Publication ID' },
				name: 'hash_publication',
				type: 'input',
				settings: {
					required: true,
					type: 'text'
				}
			}
		];
	}
	// 'hash_token', 'hash_publication'
	getPlatformName(): string {
		return 'hashnode';
	}

	setSettings(settings: Record<string, any>) {
		this.settings = { ...settings };
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
