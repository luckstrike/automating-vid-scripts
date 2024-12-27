<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { ActionData } from "./$types";
  import AutoGrowInput from "$lib/AutoGrowInput.svelte";
  import { toastStore } from "$lib/stores/toast";

  export let form: ActionData;

  let brainstorm_text = "";
  let isGenerating = false;

  const handleEnhance = () => {
    isGenerating = true;
    return async ({ result }) => {
      isGenerating = false;
      if (result.type === "success" && result.data?.script_id) {
        toastStore.show("Script created successfully", "success");
        await goto(`/script/${result.data.script_id}`);
      } else if (result.type === "failure") {
        toastStore.show(
          result.data?.error || "An error occurred",
          "error",
          5000,
        );
      }
    };
  };
</script>

<div
  class="flex flex-col flex-grow items-center justify-center h-full w-full text-white p-4"
>
  <h1 class="text-2xl text-center font-bold p-2 w-2/3">
    Have a topic you want to make a video on? Brainstorm away!
  </h1>

  <form
    method="POST"
    action="?/generateScript"
    class="w-full flex flex-col items-center gap-4"
    use:enhance={handleEnhance}
  >
    <div class="w-2/3">
      <AutoGrowInput
        name="prompt"
        bind:value={brainstorm_text}
        placeholder="...or try typing a topic"
        maxLength={2000}
      />
    </div>
    <div class="flex gap-2">
      <!-- Custom prompt button -->
      <button
        type="submit"
        name="type"
        value="custom"
        class="btn-primary"
        disabled={!brainstorm_text || isGenerating}
      >
        {isGenerating && brainstorm_text ? "Generating..." : "Generate Idea"}
      </button>

      <!-- Random prompt button -->
      <button
        type="submit"
        name="type"
        value="random"
        class="btn-primary"
        disabled={brainstorm_text || isGenerating}
      >
        {isGenerating && !brainstorm_text ? "Generating..." : "Random Idea"}
      </button>
    </div>
  </form>
</div>

<style>
  .btn-primary {
    @apply h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 
           disabled:bg-gray-500 disabled:text-gray-300 
           transition-colors;
  }
</style>
