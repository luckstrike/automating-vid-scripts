<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // Text Editor Imports
    import { Editor } from '@tiptap/core';  
    import StarterKit from '@tiptap/starter-kit';
    import Underline from '@tiptap/extension-underline';

    // Icon Imports
    import Fa from 'svelte-fa'
    import { faBold, faItalic, faUnderline, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons'

    let element: any; // figure out this type later
    let editor: any; // figure out this type later

    // TODO: You might be able to take advantage of floating menus for GPT features!
    // Use the floating menu to possibly suggest GPT features to the user on any new lines

    // NOTE: Extensions for TipTap can be added here
    // TODO: Add in highlight, strikethrough, font size, font color, font family,
    //       and bullet points and then stylize the buttons with the proper icons

    // TODO: Make the default text disappear as soon as the user starts typing

    onMount(() => {
        editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
            Underline
        ],
        content: '<p>Start typing here...</p>',
        onTransaction: () => {
            // force re-render so `editor.isActive` works as expected
            editor = editor
        },
        })
        console.log("editor: ", editor)
        console.log("element: ", element)
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
    <div class="toolbar">
        <!-- Bold Button -->
        <button
            on:click={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            class={editor.isActive("bold") ? "is-active" : ""}
        >
            <Fa icon={faBold} />
        </button>

        <!-- Italic Button -->
        <button
            on:click={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            class={editor.isActive("italic") ? "is-active" : ""}
        >
            <Fa icon={faItalic} />
        </button>

        <!-- Underline Button -->
        <button
            on:click={() => editor.chain().focus().toggleUnderline().run()}
            class={editor.isActive('underline') ? 'is-active' : ''}
        >
            <Fa icon={faUnderline} />
        </button>

        <!-- Undo Button -->
        <button
            on:click={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
        >
            <Fa icon={faUndo} />
        </button>

        <!-- Redo Button -->
        <button
            on:click={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
        >
            <Fa icon={faRedo} />
        </button>
    </div>

{/if}

<div bind:this={element}/>

<style>
  button.active {
    background: black;
    color: white;
  }

  button {
    border: none;
    margin: 0.3em;
    background: none;
  }

  .toolbar {
    display: flex;
    justify-content: center;
  }

  /* This feels so wrong but it works */
  /* background-color here changes the text box's background color */
  /* While color changes the text color */

  :global(.tiptap) {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.5em;
  }

</style>
