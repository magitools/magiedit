<script>
    import { Editor, Extension, mergeAttributes } from "@tiptap/core";
    import Blockquote from "@tiptap/extension-blockquote";
    import Document from "@tiptap/extension-document";
    import Paragraph from "@tiptap/extension-paragraph";
    import BulletList from "@tiptap/extension-bullet-list";
    import CodeBlock from "@tiptap/extension-code-block";
    import HardBreak from "@tiptap/extension-hard-break";
    import Heading from "@tiptap/extension-heading";
    import HorizontalRule from "@tiptap/extension-horizontal-rule";
    import ListItem from "@tiptap/extension-list-item";
    import OrderedList from "@tiptap/extension-ordered-list";
    import Text from "@tiptap/extension-text";
    import Bold from "@tiptap/extension-bold";
    import Code from "@tiptap/extension-code";
    import Italic from "@tiptap/extension-italic";
    import Strike from "@tiptap/extension-strike";
    import Dropcursor from "@tiptap/extension-dropcursor";
    import Gapcursor from "@tiptap/extension-gapcursor";
    import { codeToHtml } from "shiki";
    import BubbleMenu from "@tiptap/extension-bubble-menu";
    import { onMount } from "svelte";
    export let content;
    export let onChange;

    let editorElement;
    let editor;
    onMount(() => {
        editor = new Editor({
            element: editorElement,
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
            ],
            onUpdate({ editor }) {
                onChange(editor.getHTML());
            },
            content: content ?? "<p>hello world</p>",
            editorProps: {
                attributes: {
                    class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:text-white",
                },
            },
        });
    });
</script>

<div>
    <div bind:this={editorElement}></div>
</div>
