<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // Firebase Firestore Stuff
    import type { User } from 'firebase/auth';
    import { auth, db } from '$lib/firebase/firebase.client';
    import { DocumentReference, DocumentSnapshot, Firestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

    import { scriptIdStore } from '$lib/stores/scriptStore';

    // Text Editor Imports
    import { Editor } from '@tiptap/core';  
    import StarterKit from '@tiptap/starter-kit';
    import Underline from '@tiptap/extension-underline';

    // Icon Imports
    import Fa from 'svelte-fa'
    import { faBold, faItalic, faUnderline, faUndo, faRedo, faList, faListOl } from '@fortawesome/free-solid-svg-icons'

    // Script Type Import
    import type { Script } from '$lib/index.ts'

    let element: any; // figure out this type later
    let editor: any; // figure out this type later

    let currentUser: User | null;

    // TODO: You might be able to take advantage of floating menus for GPT features!
    // Use the floating menu to possibly suggest GPT features to the user on any new lines

    // NOTE: Extensions for TipTap can be added here
    // TODO: Add in highlight, strikethrough, font size, font color, font family,
    //       and bullet points and then stylize the buttons with the proper icons

    // TODO: Make the default text disappear as soon as the user starts typing

    async function getScriptContent(db: Firestore, collectionName: string, docId: string) {
        const docRef: DocumentReference = await doc(db, collectionName, docId);

        try {
            const docSnap: DocumentSnapshot | null = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
            return null;
        }
    }


    onMount(() => {
        editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
            Underline
        ],
        content: "",
        onTransaction: () => {
            // force re-render so `editor.isActive` works as expected
            editor = editor
        },
        })

        // Updating the content to the correct script
        // TODO: Add saving your doc (and a warning before leaving the script tab to save a document)
        //       Auto-saving would be cool but not sure how to do that
        if ($scriptIdStore) {
            getScriptContent(db, 'textcontent', $scriptIdStore).then(result => {
                if (result) {
                    editor.commands.setContent(result.content);
                }
            })
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
        });

        return unsubscribe;
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
    <div class="title">
        <input type="text" placeholder="Test Document Title" class="document-title">
    </div>
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

        <!-- TODO: Add a save button? -->
    </div>
{/if}

<div class="text-editor" bind:this={element}/>

<style>
  button {
    border: none;
    background: none;
    margin: 0.3em;
  }

  .text-editor {
    flex: 1 1 auto;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  .title {
    margin-left: 0.5em;
    margin-top: 1.0em;
  }

  .document-title {
    min-height: 3vh;
    min-width: 40vh;
    background-color: transparent;
    border-radius: 10px;
    border: 3px;
    font-size: 16px;
    font-weight: 500;
  }

  .toolbar {
    display: flex;
    justify-content: center;
    margin: 0.5em;
    margin-top: 0em;
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
