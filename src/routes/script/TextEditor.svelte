<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // Firebase Firestore Stuff
  import type { User } from "firebase/auth";
  import { auth, db } from "$lib/firebase/firebase.client";
  import {
    DocumentReference,
    DocumentSnapshot,
    Firestore,
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";

  import {
    scriptIdStore,
    scriptMetaIdStore,
    scriptSaveStatus,
  } from "$lib/stores/scriptStore";

  // Text Editor Imports
  import StarterKit from "@tiptap/starter-kit";
  import Underline from "@tiptap/extension-underline";
  import {
    BubbleMenu,
    createEditor,
    Editor,
    EditorContent,
    FloatingMenu,
  } from "svelte-tiptap";

  // Icon Imports
  import Fa from "svelte-fa";
  import {
    faBold,
    faItalic,
    faUnderline,
    faUndo,
    faRedo,
    faList,
    faListOl,
    faSave,
  } from "@fortawesome/free-solid-svg-icons";

  import IonRocketSharp from "~icons/ion/rocket-sharp";
  import MaterialSymbolsSearch from "~icons/material-symbols/search";
  import PhPencilFill from "~icons/ph/pencil-fill";

  // Script Type Import
  import type { Script } from "$lib/index.ts";

  // To change the size of the toolbar icons
  let faIconSize = "1.5x";

  let element: any; // figure out this type later
  let editor: any;
  let editorContainer: HTMLElement;

  let isGenerating: boolean = false;

  let scriptTitle: string = ""; // the script's title

  let scriptLoaded = false; // updates whenever the script is done loading
  let timeoutId: number | undefined; // used for debouncing the title updates (saves on API calls)

  let currentUser: User | null;

  // TODO: You might be able to take advantage of floating menus for GPT features!
  // Use the floating menu to possibly suggest GPT features to the user on any new lines

  // NOTE: Extensions for TipTap can be added here
  // TODO: Add in highlight, strikethrough, font size, font color, font family,
  //       and bullet points and then stylize the buttons with the proper icons

  // TODO: Make the default text disappear as soon as the user starts typing

  async function getScriptContent(
    db: Firestore,
    collectionName: string,
    docId: string,
  ) {
    const docRef: DocumentReference = await doc(db, collectionName, docId);

    BubbleMenu;
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

  // Get's the HTML content that is currently in the script text editor
  async function extractScriptContent(editor: Editor) {
    let scriptContent: string = editor.getHTML();

    return scriptContent;
  }

  // Returns either true or false
  async function saveHTMLtoDatabase(
    scriptContent: string,
    collectionName: string,
    documentId: string,
  ) {
    if (documentId == null) {
      console.error(
        "saveHTMLtoDatabase Error: There is no valid script ID to save this too",
      );
      return false;
    }

    // Getting a reference to the document in the firestore database
    const docRef = doc(db, collectionName, documentId);

    // Holds the wheter or not a database update was successful or not
    let saveResult: boolean = false;

    // Updating the document with the new script content
    await updateDoc(docRef, {
      content: scriptContent,
    })
      .then(() => {
        console.log(
          "saveHTMLtoDatabase() Success: Document sucessfully updated",
        );
        saveResult = true;
      })
      .catch((error) => {
        // TODO: Show some kind of pop up here if an error occurs
        console.error(
          "saveHTMLtoDatabase() Error: Error updating document: ",
          error,
        );
        saveResult = false;
      });

    return saveResult;
  }

  async function saveScript(
    editor: Editor,
    collectionName: string,
    documentId: string | null,
  ) {
    // Get's the script content
    if (documentId == null) {
      // TODO: Make this show a pop up error message in the UI
      console.error(
        "saveScript() Error: There is no valid script ID to save this too",
      );
      return false;
    }

    // Pull out the typed script data into a string
    const scriptContent: string = await extractScriptContent(editor);

    // Store the script string data to the database
    let result: boolean = await saveHTMLtoDatabase(
      scriptContent,
      "textcontent",
      documentId,
    );

    // Getting a reference to the document in the firestore database
    let metaDocRef: DocumentReference;
    let titleResult: boolean = false;

    // Handling updating the document's last updated time
    collectionName = "documents";

    if ($scriptMetaIdStore) {
      metaDocRef = doc(db, collectionName, $scriptMetaIdStore);
    } else {
      // scriptMetaIdStore is null
      titleResult = false;
      return titleResult;
    }

    console.log("metaDocRef: ", metaDocRef);

    await updateDoc(metaDocRef, {
      updated: Timestamp.now(),
    })
      .then(() => {
        console.log(
          "saveScript() Success: Document last updated time sucessfully updated",
        );
        titleResult = true;
      })
      .catch((error) => {
        // TODO: Show some kind of pop up here if an error occurs
        console.error(
          "saveScript() Error: Error updating last updated time: ",
          error,
        );
        titleResult = false;
      });

    // Error-checking
    if (result && titleResult) {
      // Everything went well!
      console.log("saveScript() Success: Everything went well!");
    } else {
      // Something broke
      console.error("saveScript() Error: Something went wrong... :(");
      console.log(result);
    }

    // Resets the save status and saves a script to the database
    $scriptSaveStatus = false;
  }

  // Used to change the title of the script everytime the value of it is changed
  async function updateScriptTitle(collectionName: string, value: string) {
    // Holds the wheter or not a database update was successful or not
    let saveResult: boolean = false;

    // Getting a reference to the document in the firestore database
    let docRef: DocumentReference;
    if ($scriptMetaIdStore) {
      docRef = doc(db, collectionName, $scriptMetaIdStore);
    } else {
      // scriptMetaIdStore is null
      saveResult = false;
      return saveResult;
    }

    await updateDoc(docRef, {
      doc_name: value,
      updated: Timestamp.now(),
    })
      .then(() => {
        console.log("updateTitle() Success: Document sucessfully updated");
        saveResult = true;
      })
      .catch((error) => {
        // TODO: Show some kind of pop up here if an error occurs
        console.error("updateTitle() Error: Error updating document: ", error);
        saveResult = false;
      });

    return saveResult;
  }

  async function handleScriptTitleInput(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    const target = event.target as HTMLInputElement; // safely casting the event target

    // Clear the previous timeout, if there's one
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    // Setting a new timeout to update the script title in the database
    timeoutId = setTimeout(() => {
      let collectionName: string = "documents";
      updateScriptTitle(collectionName, target.value);
    }, 500) as unknown as number; // delay in milliseconds (plus assertions for TypeScript to stop yelling at me)
  }

  // Gets the selected text from the script
  const getSelectedText = () => {
    const { from, to } = $editor.state.selection;
    const selectedText = $editor.state.doc.textBetween(from, to);

    return selectedText;
  };

  const insertTextAfterSelection = (textToInsert: string): void => {
    const { to } = $editor.state.selection;
    $editor.commands.insertContentAt(to, textToInsert);
  };

  const replaceSelectedText = (textToInsert: string): void => {
    $editor.commands.insertContent(textToInsert);
  };

  async function generateTextWithGPT(actionType: string) {
    const text: string = getSelectedText();
    let textFromAI: string = "";

    const baseURL: string =
      import.meta.env.VITE_PUBLIC_BASE_URL ||
      import.meta.env.PUBLIC_BASE_URL ||
      "";
    const API_URL: string = `${baseURL}/api`;

    const endpoint = "/script"; // Simplified endpoint, always using POST
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userSelection: text || "",
        actionType: actionType,
      }),
    };

    // Query GPT and get a result back only if we have some selected text
    if (text) {
      // Fetching the result + error handling
      try {
        isGenerating = true;
        const res = await fetch(API_URL + endpoint, options);

        if (res.ok) {
          const gptResult = await res.json();
          textFromAI = gptResult.gptContent;
        } else {
          isGenerating = false;
          console.error(`Server error: ${res.status}`);
        }
      } catch (err) {
        isGenerating = false;
        console.error(`Network error: ${(err as Error).message}`);
      }
    }

    if (textFromAI) {
      if (actionType == "expand") {
        insertTextAfterSelection(textFromAI);
      } else if (actionType == "rephrase") {
        replaceSelectedText(textFromAI);
      }
    }

    isGenerating = false;
  }

  onMount(async () => {
    let contentResult: string = "";
    if ($scriptIdStore) {
      await getScriptContent(db, "textcontent", $scriptIdStore).then(
        (result) => {
          if (result) {
            contentResult = result.content;
          }
        },
      );
    }

    editor = createEditor({
      extensions: [StarterKit, Underline],
      content: contentResult,
      editorProps: {
        attributes: {
          class:
            "border-2 border-black rounded-lg p-2 bg-[#d9d9d9] min-h-[88vh] max-h-[88vh] overflow-y-auto outline-none",
        },
      },
      onCreate({ editor }) {
        if ($scriptMetaIdStore) {
          getScriptContent(db, "documents", $scriptMetaIdStore).then(
            (result) => {
              if (result) {
                scriptTitle = result.doc_name;
              }
            },
          );
        }
      },
      onUpdate({ editor }) {
        $scriptSaveStatus = true;
      },
    });

    const unsubscribe = auth.onAuthStateChanged((user) => {});
  });
</script>

<!-- TODO: Add in a way to change font size (so you have titles) -->

<!-- Potential Future Buttons -->
<!-- Code Block, Quote Block, Horizontal Rule (just like a horizontal line) -->

<div class="flex flex-col justify-center items-center h-screen w-full p-4">
  {#if editor}
    <!-- Bubble Menu Stuff -->
    <BubbleMenu editor={$editor}>
      <div
        class="flex flex-row rounded-md items-center bg-[#2f2f2f] text-[#d9d9d9]"
      >
        <button
          class="flex flex-row p-2 space-x-1 hover:bg-[#1f1f1f] hover:rounded-md"
          class:text-red-400={isGenerating}
          disabled={isGenerating}
          on:click={() => generateTextWithGPT("expand")}
        >
          <div>Expand</div>
          <IonRocketSharp />
        </button>
        <div class="inline-block h-8 items-center w-0.5 bg-[#a2a2a2]"></div>
        <button
          class="flex flex-row p-2 space-x-1 hover:bg-[#1f1f1f] hover:rounded-md"
          class:text-red-400={isGenerating}
          disabled={isGenerating}
          on:click={() => generateTextWithGPT("rephrase")}
        >
          <div>Rephrase</div>
          <PhPencilFill />
        </button>
        <!-- Commented out until I figure out how to do search
        <button
          class="flex flex-row p-2 space-x-1 hover:bg-[#1f1f1f] hover:rounded-md"
        >
          <div>Search</div>
          <MaterialSymbolsSearch />
        </button>
        -->
      </div>
    </BubbleMenu>

    <FloatingMenu editor={$editor}>
      <button
        class="pl-1 pr-1 rounded-sm bg-[#2f2f2f] text-[#d9d9d9] hover:bg-[#1f1f1f]"
      >
        Generate Script
      </button>
    </FloatingMenu>

    <div class="w-full pt-2 text-center">
      <input
        class="bg-transparent w-3/4 text-center text-[#d9d9d9] font-bold text-lg border-solid border-2 border-[#d9d9d9] rounded-lg"
        type="text"
        bind:value={scriptTitle}
        on:input={handleScriptTitleInput}
      />
    </div>

    <div class="flex flex-row justify-center space-x-4 p-3 text-white">
      <!-- Save Button -->
      <button
        on:click={() => saveScript($editor, "textcontent", $scriptIdStore)}
        class:text-black={$scriptSaveStatus}
      >
        <Fa class="toolbar-icons" icon={faSave} />
      </button>

      <!-- Bold Button -->
      <button
        on:click={() => $editor.chain().focus().toggleBold().run()}
        class:text-black={$editor.isActive("bold")}
      >
        <Fa class="toolbar-icons" icon={faBold} />
      </button>

      <!-- Italic Button -->
      <button
        on:click={() => $editor.chain().focus().toggleItalic().run()}
        class:text-black={$editor.isActive("italic")}
      >
        <Fa class="toolbar-icons" icon={faItalic} />
      </button>

      <!-- Underline Button -->
      <button
        on:click={() => $editor.chain().focus().toggleUnderline().run()}
        class:text-black={$editor.isActive("underline")}
      >
        <Fa class="toolbar-icons" icon={faUnderline} />
      </button>

      <!-- Undo Button -->
      <button
        on:click={() => $editor.chain().focus().undo().run()}
        class:text-gray-400={!$editor.can().chain().focus().undo().run()}
        disabled={!$editor.can().chain().focus().undo().run()}
      >
        <Fa class="toolbar-icons" icon={faUndo} />
      </button>

      <!-- Redo Button -->
      <button
        on:click={() => $editor.chain().focus().redo().run()}
        class:text-gray-400={!$editor.can().chain().focus().redo().run()}
        disabled={!$editor.can().chain().focus().redo().run()}
      >
        <Fa class="toolbar-icons" icon={faRedo} />
      </button>

      <!-- Bullet List Button -->
      <button
        on:click={() => $editor.chain().focus().toggleBulletList().run()}
        class:text-black={$editor.isActive("bulletList")}
      >
        <Fa class="toolbar-icons" icon={faList} />
      </button>

      <!-- Ordered List Button -->
      <button
        on:click={() => $editor.chain().focus().toggleOrderedList().run()}
        class:text-black={$editor.isActive("orderedList")}
      >
        <Fa class="toolbar-icons" icon={faListOl} />
      </button>
    </div>
  {/if}

  <div bind:this={editorContainer} class="w-[95%] prose">
    <EditorContent editor={$editor} />
  </div>
</div>

<style>
  :global(.tiptap ul) {
    list-style-type: disc;
    padding-left: 1.5em;
  }

  :global(.tiptap ol) {
    list-style-type: decimal;
    padding-left: 1.5em;
  }
</style>
