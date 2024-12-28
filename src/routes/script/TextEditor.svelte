<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import debounce from "lodash/debounce";
  import { enhance } from "$app/forms";

  import { saveStatus } from "$lib/stores/scriptStore";

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
    faStrikethrough,
    faUndo,
    faRedo,
    faList,
    faListOl,
    faSave,
  } from "@fortawesome/free-solid-svg-icons";

  import IonRocketSharp from "~icons/ion/rocket-sharp";
  import MaterialSymbolsSearch from "~icons/material-symbols/search";
  import PhPencilFill from "~icons/ph/pencil-fill";
  import { toastStore } from "$lib/stores/toast";

  // Getting the Script data from the server side
  export let data;
  let { script, session } = data;
  let scriptTitle: string = script.title; // Setting the initial script title

  let lastSavedContent = script.content;
  let lastSavedTitle = scriptTitle;

  let pendingSave = false;

  let editor: any;
  let editorContainer: HTMLElement;

  let isGenerating: boolean = false;

  // TODO: You might be able to take advantage of floating menus for GPT features!
  // Use the floating menu to possibly suggest GPT features to the user on any new lines

  // NOTE: Extensions for TipTap can be added here
  // TODO: Add in highlight, strikethrough, font size, font color, font family,
  //       and bullet points and then stylize the buttons with the proper icons

  // TODO: Make the default text disappear as soon as the user starts typing

  // Get's the HTML content that is currently in the script text editor
  async function extractScriptContent(editor: Editor) {
    let scriptContent: string = editor.getHTML();

    return scriptContent;
  }

  // Updating the script title
  const updateScriptTitle = debounce(async (title: string, id: string) => {
    try {
      pendingSave = true;
      saveStatus.set("saving");

      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);

      await fetch("?/updateTitle", {
        method: "POST",
        body: formData,
      });

      lastSavedTitle = title;
      saveStatus.set("saved");
    } catch (error) {
      saveStatus.set("error");
    } finally {
      pendingSave = false;
    }
  }, 500);

  const updateScriptContent = debounce(async (content: string, id: string) => {
    try {
      pendingSave = true;
      saveStatus.set("saving");

      const formData = new FormData();
      formData.append("id", id);
      formData.append("content", content);

      await fetch("?/updateScript", {
        method: "POST",
        body: formData,
      });
      // Set save status to false only after successful save
      lastSavedContent = content;
      saveStatus.set("saved");
    } catch (error) {
      // Keep scriptSaveStatus true if save failed
      saveStatus.set("error");
    } finally {
      pendingSave = false;
    }
  }, 500);

  async function handleScriptInput(editor: Editor) {
    const content = await extractScriptContent(editor);
    const id = script.id;

    updateScriptContent(content, id);
  }

  async function handleScriptTitleInput(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    const title = (event.target as HTMLInputElement).value; // safely casting the event currentTarget
    const id = script.id;

    updateScriptTitle(title, id);
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

  const handleEditSelection = (formData: FormData) => {
    // Grabbing the currently selected text
    const selectedText = getSelectedText();
    formData.append("user_selection", selectedText);
    isGenerating = true;

    // Do all of this once we get the AI model results
    return async ({ result, update }) => {
      isGenerating = false;

      if (result.type === "success") {
        if (formData.get("action") == "expand") {
          insertTextAfterSelection(result.data.resultText);
        } else if (formData.get("action") == "rephrase") {
          replaceSelectedText(result.data.resultText);
        } else {
          // Invalid result type
          toastStore.show(
            result.data?.error || "An error occurred",
            "error",
            5000,
          );
          return false;
        }
      } else if (result.type === "failure") {
        toastStore.show(
          result.data?.error || "An error occurred",
          "error",
          5000,
        );
        return false;
      }

      await update();
    };
  };

  onMount(async () => {
    editor = createEditor({
      extensions: [StarterKit, Underline],
      content: script.content,
      editorProps: {
        attributes: {
          class:
            "border-2 border-black rounded-lg p-2 bg-[#d9d9d9] min-h-[88vh] max-h-[88vh] overflow-y-auto outline-none",
        },
      },
      onUpdate({ editor }) {
        const currentContent = editor.getHTML();
        if (currentContent !== lastSavedContent) {
          // Check if content has changed
          handleScriptInput($editor);
        }
      },
    });

    if (browser) {
      const checkUnsavedChanges = () => {
        // More defensive check for editor content
        const currentContent = editor ? editor.getHTML() : "";
        const currentTitle = scriptTitle;

        return (
          pendingSave || // Check if we have a pending save
          $saveStatus === "saving" ||
          $saveStatus === "error" ||
          currentContent !== lastSavedContent ||
          currentTitle !== lastSavedTitle
        );
      };

      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (checkUnsavedChanges()) {
          // Cancel any pending debounced saves
          updateScriptContent.cancel();
          updateScriptTitle.cancel();

          event.preventDefault();
          return (event.returnValue = "Changes you made may not be saved.");
        }
      };

      const handleNavigation = (event: any) => {
        if (checkUnsavedChanges()) {
          if (
            !window.confirm(
              "Changes you made may not be saved. Are you sure you want to leave?",
            )
          ) {
            event.preventDefault();
          } else {
            // User confirmed they want to leave, cancel pending saves
            updateScriptContent.cancel();
            updateScriptTitle.cancel();
          }
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("sveltekit:navigation-start", handleNavigation);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener(
          "sveltekit:navigation-start",
          handleNavigation,
        );
      };
    }
  });

  onDestroy(() => {
    // Cancel any pending debounced operations
    updateScriptContent.cancel();
    updateScriptTitle.cancel();
  });
</script>

<!-- TODO: Add in a way to change font size (so you have titles) -->

<!-- Potential Future Buttons -->
<!-- Code Block, Quote Block, Horizontal Rule (just like a horizontal line) -->

<div class="flex flex-col justify-center items-center h-screen w-full p-4">
  {#if editor}
    <!-- Bubble Menu Stuff -->
    <BubbleMenu editor={$editor}>
      <div>
        <form
          class="flex flex-row rounded-md items-center bg-[#2f2f2f] text-[#d9d9d9]"
          method="POST"
          action="?/editSelection"
          use:enhance={({ formData }) => handleEditSelection(formData)}
        >
          <button
            name="action"
            value="expand"
            class="flex flex-row p-2 space-x-1 hover:bg-[#1f1f1f] hover:rounded-md"
            class:text-red-400={isGenerating}
            disabled={isGenerating}
            type="submit"
          >
            <div>Expand</div>
            <IonRocketSharp />
          </button>
          <div class="inline-block h-8 items-center w-0.5 bg-[#a2a2a2]"></div>
          <button
            name="action"
            value="rephrase"
            class="flex flex-row p-2 space-x-1 hover:bg-[#1f1f1f] hover:rounded-md"
            class:text-red-400={isGenerating}
            disabled={isGenerating}
            type="submit"
          >
            <div>Rephrase</div>
            <PhPencilFill />
          </button>
        </form>
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

    <!-- Not really using this right now
    <FloatingMenu editor={$editor}>
      <button
        class="pl-1 pr-1 rounded-sm bg-[#2f2f2f] text-[#d9d9d9] hover:bg-[#1f1f1f]"
      >
        Generate Script
      </button>
    </FloatingMenu>
    -->

    <div class="w-full pt-2 text-center">
      <input
        class="bg-transparent w-3/4 text-center text-[#d9d9d9] font-bold text-lg border-solid border-2 border-[#d9d9d9] rounded-lg"
        type="text"
        bind:value={scriptTitle}
        on:input={handleScriptTitleInput}
      />
    </div>

    <div class="flex flex-row justify-center space-x-4 p-2 text-white">
      <!-- Save status indicator -->
      <div class="flex items-center w-36">
        <!-- Container for save icon + status -->
        <Fa class="opacity-50" icon={faSave} />
        <div class="flex-1 text-center">
          <!-- Center the text in the remaining space -->
          <span class="text-sm">
            {#if $saveStatus === "saving"}
              <span class="text-gray-400">Saving...</span>
            {:else if $saveStatus === "saved"}
              <span class="text-gray-400">All changes saved</span>
            {:else if $saveStatus === "error"}
              <span class="text-red-400">Failed to save</span>
            {/if}
          </span>
        </div>
      </div>

      <div class="h-6 w-px bg-gray-400 opacity-50"></div>
      <!-- Vertical divider -->

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

      <!-- Strikethrough Button -->
      <button
        on:click={() => $editor.chain().focus().toggleStrike().run()}
        class:text-black={$editor.isActive("strike")}
      >
        <Fa class="toolbar-icons" icon={faStrikethrough} />
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
