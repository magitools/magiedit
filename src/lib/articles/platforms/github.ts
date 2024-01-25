import { RegisterPlatform, type IBasePlatform, type IPlatformSetting } from './base';

@RegisterPlatform
export class GithubPlatform implements IBasePlatform<GithubPlatform> {
	settings: Record<string, string> = {};
	frontmatter: Record<string, any> = {};

	async publish(content: string) {
		const { github_token, github_repo, github_user, github_folder } = this.settings;
		if (!github_repo || !github_token || !github_user) {
			throw new Error('Required Settings not found');
		}
		try {
			const res = await fetch(
				`https://api.github.com/repos/${github_user}/${github_repo}/${
					github_folder ? github_folder + '/' : ''
				}${this.frontmatter['title']}`,
				{
					method: 'put',
					body: JSON.stringify({ content, message: 'published with magiedit' }),
					headers: {
						Authorization: `Bearer ${github_token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			if (!res.ok) {
				throw new Error('request failed');
			}
		} catch (error) {
			throw new Error(`${error}`);
		}
	}
	setSettings(settings: Record<string, any>): GithubPlatform {
		this.settings = settings;
		return this;
	}
	getRequiredSettings(): IPlatformSetting[] {
		return [
			{
				label: { htmlFor: 'github_token', value: 'Github Token' },
				type: 'input',
				name: 'github_token',
				settings: {
					type: 'text',
					required: true
				}
			},
			{
				label: { htmlFor: 'github_user', value: 'Github User or Organization' },
				type: 'input',
				name: 'github_user',
				settings: {
					type: 'text',
					required: true
				}
			},
			{
				label: { htmlFor: 'github_repo', value: 'Github Repository' },
				type: 'input',
				name: 'github_repo',
				settings: {
					type: 'text',
					required: true
				}
			},
			{
				label: {
					htmlFor: 'github_folder',
					value: 'Github Folder Path (relative to the root of the repository)'
				},
				type: 'input',
				name: 'github_folder',
				settings: {
					type: 'text'
				}
			}
		];
	}
	setFrontmatter(data: Record<string, any>): GithubPlatform {
		this.frontmatter = data;
		return this;
	}
	getPlatformName(): string {
		return 'Github';
	}
}
