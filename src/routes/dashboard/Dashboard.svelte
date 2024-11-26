<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Script } from "$lib";

  // Icon Imports
  import Fa from "svelte-fa";
  import { faCaretDown, faPlus } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { scriptIdStore } from "$lib/stores/scriptStore";

  // Using Supabase now
  export let data;
  let { scripts, session, user } = data;

  let maxPreviewLimit: number = 3;

  // Move the preview data calculation into a function so we can reuse it
  function updatePreviewData(scriptsArray: Script[]) {
    return scriptsArray
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, maxPreviewLimit);
  }

  // Initialize preview data
  let previewData = updatePreviewData(scripts); // Used to hold whether data is sorted by ascending or descending manner
  // (ex. A-Z or Z-A, most recent to least recent, etc...)
  let isNameAscending = true;
  let isDateAscending = true;

  const handleDelete = (scriptId: string) => {
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      // Update the main scripts array
      scripts = scripts.filter((script: Script) => script.id !== scriptId);

      // Resetting the scriptIdStore (the script no longer exists)
      scriptIdStore.set(null);

      // Recalculate the preview data based on the updated scripts array
      previewData = updatePreviewData(scripts);
    };
  };

  const handleNewScript = () => {
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === "success" && result.data?.script_id) {
        handleScriptRedirect(result.data.script_id);
      }
    };
  };

  function handleScriptRedirect(scriptId: string) {
    goto(`/script/${scriptId}`);
  }

  function timestampFormatter(timestamp: string) {
    if (timestamp) {
      let date = new Date(timestamp);

      let intlTime = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(date);

      return intlTime;
    }
  }

  // Function to toggle and sort by name
  function toggleSortByName() {
    scripts.sort((a: Script, b: Script) =>
      isNameAscending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    );
    scripts = [...scripts];
    isNameAscending = !isNameAscending;
  }

  // Function to toggle and sort by date
  function toggleSortByDate() {
    scripts.sort((a: Script, b: Script) =>
      isDateAscending
        ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    scripts = [...scripts];
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

  function handleKeydown(event: KeyboardEvent, action: () => void) {
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

  let sortModeActive: string | null = "last-updated";
</script>

<div
  class={scripts?.length === 0
    ? "flex flex-col min-h-screen justify-center items-center"
    : "flex flex-col min-h-screen pb-20 lg:pb-10 p-2"}
>
  <div class="flex flex-col space-y-2">
    <div class="text-center">
      <div class="text-center text-xl font-bold text-white lg:mt-2">
        Howdy {user.email}! Ready to start script writing?
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
            <form
              method="POST"
              action="?/createScript"
              use:enhance={() => handleNewScript()}
            >
              <button
                class="w-48 h-64 bg-white rounded-lg flex items-center justify-center transition-transform gover:scale-105 flex-shrink-0"
              >
                <Fa class="text-2xl" icon={faPlus} />
              </button>
            </form>
            <div class="text-sm text-white mt-2">Create a New Script</div>
          </div>

          {#each previewData as item}
            <div class="flex flex-col items-center w-48">
              <button
                class="w-48 h-64 bg-white rounded-lg flex items-center justify-center transition-transform gover:scale-105 flex-shrink-0"
                on:click={() => handleScriptRedirect(item.id)}
              >
              </button>
              <div class="text-sm text-white mt-2">
                {truncateText(item.title)}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Table section -->
    {#if scripts.length != 0}
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
              {#each scripts as item}
                <tr
                  class="hover:bg-gray-100 cursor-pointer"
                  on:click={() => handleScriptRedirect(item.id)}
                >
                  <td class="p-4 text-sm border-b">{item.title}</td>
                  <td class="p-4 text-sm border-b">
                    {timestampFormatter(item.updated_at)}
                  </td>
                  <td class="p-4 text-sm border-b" on:click|stopPropagation>
                    <form
                      method="POST"
                      action="?/deleteScript"
                      use:enhance={() => handleDelete(item.id)}
                    >
                      <input type="hidden" name="script_id" value={item.id} />
                      <button
                        class="w-full bg-red-500 hover:bg-red-700 border-black rounded-md px-2 py-1 text-center text-white text-sm"
                        >Delete</button
                      >
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
</style>
