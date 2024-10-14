import { basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { languages } from '@codemirror/language-data';
import { dracula } from "thememirror"
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import addClasses from 'rehype-add-classes';
import rehypeShiki from '@shikijs/rehype';
import { parse } from 'yaml';

const parser = unified()
	.use(remarkParse)
	.use(remarkFrontmatter)
	.use(remarkExtractFrontmatter, { yaml: parse, name: 'frontmatter' })
	.use(remarkGfm)
	.use(remarkRehype)
	.use(addClasses, {
		//table: 'table',
		'p,h1,h2,h3,h4,h5,h6,th, strong, a, blockquote, :not(pre) > code': 'dark:text-white text-black'
		//'ul': 'list'
	})
	.use(rehypeShiki, {
	    theme: 'catppuccin-mocha'
	})
	.use(rehypeStringify);

/**
    * content {string}
**/
function parsePreview(content) {
    return parser.process(content).then((data) => {
        return {
            frontmatter: data.data.frontmatter,
            data: data.toString()
        }
    })
}


document.addEventListener('livewire:initialized', async() => {
    const wire = Livewire.first()
    const editorContainer = document.querySelector("#editor")
    const previewContainer = document.querySelector("#preview")
    const saveButton = document.querySelector("#saveButton")
    const setPreview = (content) => {
        preview.innerHTML = content.data
    }

    if (wire.initialLoad) {
        parsePreview(wire.content).then((content) => {
            setPreview(content)
            wire.initialLoad = false
        })
    }

    const updateListener = EditorView.updateListener.of(async (update) => {
        if (update.docChanged) {
            const content = await parsePreview(update.view.state.doc.toString())
            setPreview(content)
        }
    })



    const baseCodeMirrorConfig = [basicSetup, updateListener, keymap.of(defaultKeymap), EditorView.lineWrapping, markdown({codeLanguages: languages})]
    let startState = EditorState.create({
        doc: wire.content,
        extensions: [baseCodeMirrorConfig, dracula]
    })
    let view = new EditorView({state: startState})
    editorContainer.appendChild(view.dom)
    saveButton.addEventListener('click', () => {
        wire.save(view.state.doc.toString())
    })
})

