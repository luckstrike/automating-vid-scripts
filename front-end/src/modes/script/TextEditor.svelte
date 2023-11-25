<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';

    let element: any; // figure out this type later
    let editor: any; // figure out this type later

    // TODO: You might be able to take advantage of floating menus for GPT features!
    // Use the floating menu to possibly suggest GPT features to the user on any new lines

    // NOTE: Extensions for TipTap can be added here

    onMount(() => {
        editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
        ],
        content: '<p>Start typing here...</p>',
        onTransaction: () => {
            // force re-render so `editor.isActive` works as expected
            editor = editor
        },
        })
    })

    onDestroy(() => {
        if (editor) {
        editor.destroy()
        }
    })
</script>

<!-- Let's get the following working: Bold, Italic, Underlined, Font Size -->
<!-- Next Up: Bullet List -->

{#if editor}
    <!-- Bold Button -->
    <button
        on:click={() => console.log && editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        class={editor.isActive("bold") ? "is-active" : ""}
    >
        bold
    </button>

    <!-- Italic Button -->
    <button
        on:click={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        class={editor.isActive("italic") ? "is-active" : ""}
    >
        italic
    </button>

    <!-- Paragraph Button -->
    <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
        P
    </button>

    <!-- Undo Button -->
    <button
        on:click={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
    >
        undo
    </button>

    <!-- Redo Button -->
    <button
        on:click={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
    >
        redo
    </button>
{/if}

<div bind:this={element} />

<style>
  button.active {
    background: black;
    color: white;
  }

  .tiptap {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }

</style>
