export interface IArticle {
	iv: string;
	id: number;
	title?: string;
	content: string;
	frontmatter?: Record<string, any>;
}
