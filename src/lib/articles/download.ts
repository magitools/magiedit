import fm from 'front-matter';

export const generateArticleBlob = async (content: string): Promise<Blob> => {
	/* 	const article = await db.articles.get(id);
	
		const text = `${article?.content}`;
	 */
	const blob = new Blob([content], { type: 'text/plain' });

	return blob;
};

export const handleDownload = async (content: string) => {
	const data = await generateArticleBlob(content);
	const frontmatter = fm(content).attributes as Record<string, any>;
	const link = window.URL.createObjectURL(data);
	const a = document.createElement('a');
	a.setAttribute('download', `${frontmatter.title || 'untitled'}.md`);
	a.setAttribute('href', link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
