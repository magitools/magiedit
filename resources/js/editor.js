/*
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

/!**
    * content {string}
**!/
function parsePreview(content) {
    return parser.process(content).then((data) => {
        return {
            frontmatter: data.data.frontmatter,
            data: data.toString()
        }
    })
}


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
            window.dispatchEvent(new CustomEvent('initial-done'))
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

*/

import {Editor, Extension, mergeAttributes} from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import {codeToHtml} from "shiki";

const CustomCodeBlock = CodeBlock.extend({
    async renderHTML({ node, HTMLAttributes }) {
        const language = node.attrs.language || this.options.defaultLanguage;
        const codeContent = node.textContent;
        let highlightedCode = codeContent;

        // Use Shiki to highlight the code if the highlighter is available
        highlightedCode = await codeToHtml(codeContent, { lang: language, theme: "nord" });
        console.log(highlightedCode)
        // Return the highlighted code inside a pre and code tag
        return (
            {
                html: highlightedCode
            }
        )
    },
})

const saveButton = document.querySelector("#saveButton")
const editorContainer = document.querySelector("#editor")

import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

saveButton.onclick = async() => {
    const content = editor.getHTML()
    console.log(content)
    editorContainer.setAttribute('data-content', content)
    window.dispatchEvent(new Event('content-save'))
}
console.log("got content ", editorContainer.getAttribute('data-content'))


const editor = new Editor({
    element: document.querySelector('#editor'),
    extensions: [
        Document,
        Text,
        Paragraph,
        Blockquote,
        BulletList,
        CodeBlock,
        HardBreak,
        Heading,
        HorizontalRule,
        ListItem,
        OrderedList,
        Bold,
        Code,
        Italic,
        Strike,
        Dropcursor,
        Gapcursor

    ],
    content: editorContainer.getAttribute('data-content') ?? '<p>Hello World!</p>',
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none text-black dark:text-white',
        },
    },
})
