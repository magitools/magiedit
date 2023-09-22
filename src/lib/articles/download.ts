export const generateArticleBlob = async (id: number): Promise<Blob> => {
	/* 	const article = await db.articles.get(id);
	
		const text = `${article?.content}`;
	 */
	const blob = new Blob([''], { type: 'text/plain' });

	return blob;
};
