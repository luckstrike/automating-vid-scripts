<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase.client";

  import { authStore } from "$lib/stores/authStore";
  import { scriptIdStore, scriptMetaIdStore } from "$lib/stores/scriptStore";

  import { onMount } from "svelte";

  // Icon Imports
  import Fa from "svelte-fa";
  import { faCaretDown, faPlus } from "@fortawesome/free-solid-svg-icons";

  // Script Type Import
  import type { Script, TextContent, ScriptMetaData } from "$lib/index.ts";

  // Redirecting to another route
  import { goto } from "$app/navigation";

  // Using Supabase now
  export let data;
  const { scripts, session } = data;

  // TODO: Not a fan of how this just updates the global variables, fix this later

  let isLoading: boolean = true;

  // Used to hold all of a user's scripts
  let filteredData: Script[] = [];
  let previewData: Script[] = []; // the data shown next to the add a new script

  // Used to hold whether data is sorted by ascending or descending manner
  // (ex. A-Z or Z-A, most recent to least recent, etc...)
  let isNameAscending = true;
  let isDateAscending = true;

  // TODO: Get the document titles and display them in the script-boxes div,
  // organize them the most recent updated date

  // TODO: In Firestore, maybe move the content to a subcollection so it isn't all loaded at once?
  // Right now Firestore is loading all of the document at once so in cases where the document
  // is closer to 1MB, it's going to take a while to load

  async function loadUserScripts() {
    let scriptData: Script[] = [];

    if (!session) {
      console.log("No user authenticated");
      // Optionally, handle the case when there's no user (e.g., redirect to login)
      return;
    }

    try {
      // Loading is now complete, render eveything!
      isLoading = false;
    } catch (error) {
      console.error("Error loading scripts:", error);
    }

    return scriptData;
  }

  onMount(() => {
    if (session) {
      loadUserScripts();
    }

    return;
  });

  // TODO: Make these functions not die when no data is loaded or available
  // Function to toggle and sort by name
  function toggleSortByName() {
    filteredData.sort((a, b) =>
      isNameAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
    filteredData = [...filteredData];
    isNameAscending = !isNameAscending;
  }

  // Function to toggle and sort by date
  function toggleSortByDate() {
    filteredData.sort((a, b) =>
      isDateAscending
        ? new Date(a.lastUpdatedString) - new Date(b.lastUpdatedString)
        : new Date(b.lastUpdatedString) - new Date(a.lastUpdatedString),
    );
    filteredData = [...filteredData];
    isDateAscending = !isDateAscending;
  }

  function setActiveButton(button: string) {
    if (button === "name") {
      toggleSortByName();
    } else if (button === "last-updated") {
      toggleSortByDate();
    }

    sortModeActive = button;
  }

  function handleKeydown(event, action) {
    if (event.key === "Enter") {
      action();
    }
  }

  function truncateText(text: string) {
    let maxLength: number = 20;

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const contentCollection: string = "textcontent";
  const scriptMetaInfoCollection: string = "documents";

  let sortModeActive: string | null = "last-updated";
</script>

<div class="flex flex-col min-h-screen pb-20 p-2 lg:pb-0">
  {#if !isLoading}
    <div class="flex flex-col space-y-2">
      <div class="text-center">
        <div class="text-center text-xl font-bold text-white lg:mt-2">
          Howdy {session.user.email}! Ready to start script writing?
        </div>
        <p class="text-center text-sm text-white">
          or create a new script with Brainstorm or Summarize a URL!
        </p>
      </div>

      <!-- Scrollable cards section -->
      <div class="w-full px-4 overflow-x-auto">
        <div class="flex space-x-4 py-4">
          <div
            class="flex flex-row md:justify-center gap-4 min-w-max md:min-w-0 mx-auto"
          >
            <div class="flex flex-col items-center w-48">
              <button
                class="w-48 h-64 bg-white rounded-lg flex items-center justify-center transition-transform gover:scale-105 flex-shrink-0"
              >
                <Fa class="text-2xl" icon={faPlus} />
              </button>
              <div class="text-sm text-white mt-2">Create a New Script</div>
            </div>

            {#each previewData as item}
              <div class="flex flex-col items-center w-48">
                <button
                  class="w-48 h-64 bg-white rounded-lg flex items-center justify-center transition-transform gover:scale-105 flex-shrink-0"
                >
                </button>
                <div class="text-sm text-white mt-2">
                  {truncateText(item.name)}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Table section -->
      <div class="flex justify-center">
        <div class="w-full max-w-5xl overflow-x-auto rounded-lg bg-white">
          <table class="w-full">
            <thead>
              <tr>
                <th
                  class="p-4 text-left border-b border-black text-sm font-medium w-[65%]"
                >
                  <div
                    class="cursor-pointer flex flex-row items-center space-x-2"
                    on:click={() => setActiveButton("name")}
                    role="button"
                    tabindex="0"
                    on:keydown={(event) =>
                      handleKeydown(event, () => setActiveButton("name"))}
                  >
                    <div>Name</div>
                    <Fa
                      icon={faCaretDown}
                      style="color: {sortModeActive == 'name'
                        ? '#2f2f2f'
                        : 'lightgray'}"
                    />
                  </div>
                </th>
                <th
                  class="p-4 text-left border-b border-black text-sm font-medium w-[25%]"
                >
                  <div
                    class="cursor-pointer flex flex-row items-center space-x-2"
                    on:click={() => setActiveButton("last-updated")}
                    role="button"
                    tabindex="0"
                    on:keydown={(event) =>
                      handleKeydown(event, () =>
                        setActiveButton("last-updated"),
                      )}
                  >
                    <div>Last Updated</div>
                    <Fa
                      icon={faCaretDown}
                      style="color: {sortModeActive == 'last-updated'
                        ? '#2f2f2f'
                        : 'lightgray'}"
                    />
                  </div>
                </th>
                <th
                  class="p-4 text-center border-b border-black text-sm font-medium w-[10%]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {#each filteredData as item}
                <tr
                  class="hover:bg-gray-100 cursor-pointer"
                  on:click={() => getScript(item)}
                >
                  <td class="p-4 text-sm border-b">{item.name}</td>
                  <td class="p-4 text-sm border-b">{item.lastUpdatedString}</td>
                  <td class="p-4 text-sm border-b">
                    <button
                      class="w-full bg-red-500 hover:bg-red-700 border-black rounded-md px-2 py-1 text-center text-white text-sm"
                      on:click|stopPropagation={() => deleteScript(item)}
                      >Delete</button
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {:else}
    <!-- TODO: Make this either a loading screen or just keep it empty-->
  {/if}
</div>

<style>
</style>
