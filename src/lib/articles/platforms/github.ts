import { RegisterPlatform, type IPlatformSetting, BasePlatform } from './base';

@RegisterPlatform
export class GithubPlatform extends BasePlatform {
	settings: Record<string, string> = {};
	frontmatter: Record<string, any> = {};

	async publish(content: string) {
		const { github_token, github_repo, github_user, github_folder } = this.settings;
		if (!github_repo || !github_token || !github_user) {
			throw new Error('Required Settings not found');
		}
		try {
			const title = this.frontmatter['title'].replaceAll(' ', '-').toLowerCase();
			const commitMessage = this.settings['github_commit'].replace(/%([^%]+)%/g, (match, key) => {
				return key in this.frontmatter ? this.frontmatter[key] : match;
			});
			const res = await fetch(
				`https://api.github.com/repos/${github_user}/${github_repo}/contents/${
					github_folder ? github_folder + '/' : ''
				}${title}.md`,
				{
					method: 'put',
					body: JSON.stringify({
						content: btoa(content),
						message: commitMessage || 'published with magiedit'
					}),
					headers: {
						Authorization: `Bearer ${github_token}`,
						Accept: 'application/vnd.github+json',
						'Content-Type': 'application/json',
						'X-GitHub-Api-Version': '2022-11-28'
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
	setTags(data: string[]): GithubPlatform {
		return this;
	}
	validate(): boolean {
		return true;
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
			},
			{
				label: {
					htmlFor: 'github_commit',
					value:
						'Commit Message for file creation: you can use your frontmatter variables by writing %variable_name% (i.e. %title%)'
				},
				type: 'input',
				name: 'github_commit',
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
