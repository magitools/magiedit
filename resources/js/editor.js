import { Editor, Extension, mergeAttributes } from '@tiptap/core'
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
import { codeToHtml } from "shiki";
import BubbleMenu from '@tiptap/extension-bubble-menu'

const saveButton = document.querySelector("#saveButton")
const editorContainer = document.querySelector("#editor")
const bubbleMenu = document.querySelector("#bubble-menu")

saveButton.onclick = async () => {
    const content = editor.getHTML()
    editorContainer.setAttribute('data-content', content)
    window.dispatchEvent(new Event('content-save'))
}

function setupBubbleMenu() {
    const boldBtn = bubbleMenu.querySelector("#bm-bold")
    boldBtn.onclick = () => {
        editor.chain().focus().toggleBold().run()
    }
    const itBtn = bubbleMenu.querySelector("#bm-italic")
    itBtn.onclick = () => {
        editor.chain().focus().toggleItalic().run()
    }
    const strikeBtn = bubbleMenu.querySelector("#bm-strike")
    strikeBtn.onclick = () => {
        editor.chain().focus().toggleStrike().run()
    }
}


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
        Gapcursor,
        BubbleMenu.configure({
            element: bubbleMenu
        })
    ],
    content: editorContainer.getAttribute('data-content') ?? '<p>Hello World!</p>',
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none text-black dark:text-white',
        },
    },
})


setupBubbleMenu()
