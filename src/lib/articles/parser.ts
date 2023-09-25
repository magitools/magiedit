import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import addClasses from 'rehype-add-classes';
import rehypeHighlight from 'rehype-highlight';
import { parse } from 'yaml';

const parser = unified()
	.use(remarkParse)
	.use(remarkFrontmatter)
	.use(remarkExtractFrontmatter, { yaml: parse, name: 'frontmatter' })
	.use(remarkGfm)
	.use(remarkRehype)
	.use(addClasses, {
		table: 'table',
		'p,h1,h2,h3,h4,h5,h6,th, strong, a, blockquote, :not(pre) > code': 'text-current'
		//'ul': 'list'
	})
	.use(rehypeHighlight)
	.use(rehypeStringify);

export { parser };
