export interface IArticle {
	id: number;
	title: string;
	content: string;
	frontmatter: Record<string, any>;
}
