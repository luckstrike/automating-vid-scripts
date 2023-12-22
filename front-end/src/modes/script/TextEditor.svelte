<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // Text Editor Imports
    import { Editor } from '@tiptap/core';  
    import StarterKit from '@tiptap/starter-kit';
    import Underline from '@tiptap/extension-underline';

    // Icon Imports
    import Fa from 'svelte-fa'
    import { faBold, faItalic, faUnderline, faUndo, faRedo, faList, faListOl } from '@fortawesome/free-solid-svg-icons'

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

<!-- TODO: Add in a way to change font size (so you have titles) -->

<!-- Potential Future Buttons -->
<!-- Code Block, Quote Block, Horizontal Rule (just like a horizontal line) -->

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

        <!-- Bullet List Button -->
        <button
            on:click={() => editor.chain().focus().toggleBulletList().run()}
            class={editor.isActive("bulletList") ? "is-active" : ""}
        >
            <Fa icon={faList} />
        </button>
        
        <!-- Ordered List Button -->
        <button
            on:click={() => editor.chain().focus().toggleOrderedList().run()}
            class={editor.isActive("orderedList") ? "is-active" : ""}
        >
            <Fa icon={faListOl} />
        </button>   


    </div>

{/if}

<div bind:this={element}/>

<style>
  button {
    border: none;
    background: none;
    margin: 0.3em;
  }

  .toolbar {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5em;
  }

  /* This feels so wrong but it works */
  /* background-color here changes the text box's background color */
  /* While color changes the text color */

  :global(.tiptap) {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.5em;
    padding-top: 0em;
    min-height: 85vh;
    overflow: hidden;
    scroll-behavior: smooth; /* This is so that the text box can scroll */
  }

  /* Changes color when a button is active */
  .is-active {
    background-color: lightblue;
    font-weight: bolder;
  }

</style>
