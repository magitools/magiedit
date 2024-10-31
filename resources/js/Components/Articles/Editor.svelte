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
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {
        Bold as BoldIcon,
        Italic as ItalicIcon,
        Strikethrough,
        CodeXml,
        CaseSensitive,
        Heading1,
        Heading2,
        Heading3,
        PencilOff,
        List,
        ListOrdered,
    } from "lucide-svelte";
    export let content;
    export let onChange;

    let editorElement;
    /** @type {Editor | null} */
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
            onTransaction() {
                editor = editor;
            },
            content: content ?? "<p>hello world</p>",
            editorProps: {
                attributes: {
                    class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[12rem] bg-slate-50 rounded-xl p-4 shadow-md focus:outline-none",
                },
            },
        });
    });
</script>

<div>
    {#if editor}
        <div class="w-full flex items-center space-x-6 px-6">
            <div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        ><CaseSensitive /></DropdownMenu.Trigger
                    >
                    <DropdownMenu.Content>
                        <DropdownMenu.Group>
                            <DropdownMenu.Item
                                on:click={() =>
                                    editor.chain().focus().setParagraph().run()}
                                >Normal Text</DropdownMenu.Item
                            >
                            <DropdownMenu.Item
                                on:click={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run()}
                            >
                                <Heading1 /> Heading 1
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                on:click={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()}
                            >
                                <Heading2 />Heading 2
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                on:click={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()}
                            >
                                <Heading3 />Heading 3
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
            <div>
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() => editor.chain().focus().toggleBold().run()}
                    ><BoldIcon /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() => editor.chain().focus().toggleItalic().run()}
                    ><ItalicIcon /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() => editor.chain().focus().toggleStrike().run()}
                    ><Strikethrough /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() => editor.chain().focus().toggleCode().run()}
                    ><CodeXml /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() =>
                        editor.chain().focus().unsetAllMarks().run()}
                    ><PencilOff /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() =>
                        editor.chain().focus().toggleBulletList().run()}
                    ><List /></Button
                >
                <Button
                    variant="outline"
                    size="icon"
                    on:click={() =>
                        editor.chain().focus().toggleOrderedList().run()}
                    ><ListOrdered /></Button
                >
            </div>
        </div>
    {/if}
    <div bind:this={editorElement}></div>
</div>
