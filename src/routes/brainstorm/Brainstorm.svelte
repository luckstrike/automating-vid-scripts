<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { ActionData } from "./$types";

  export let form: ActionData;

  let brainstorm_text = "";
  let isGenerating = false;

  const handleEnhance = () => {
    isGenerating = true;
    return async ({ result }) => {
      isGenerating = false;
      if (result.type === "success" && result.data?.script_id) {
        await goto(`/script/${result.data.script_id}`);
      }
    };
  };
</script>

<div
  class="flex flex-col flex-grow items-center justify-center h-full w-full text-white p-4"
>
  <h1 class="text-2xl font-bold">Kickstart your writing process!</h1>

  <p class="text-lg p-2">
    Do you have a topic that you want to make a video about? Provide it here:
  </p>

  <form
    method="POST"
    action="?/generateScript"
    class="w-full flex flex-col items-center gap-4"
    use:enhance={handleEnhance}
  >
    <input
      class="w-3/4 h-10 rounded-lg px-2 text-black"
      type="text"
      name="prompt"
      placeholder="or try generating a random idea..."
      bind:value={brainstorm_text}
    />

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

    {#if form?.error}
      <p class="text-red-500">{form.error}</p>
    {/if}
  </form>
</div>

<style>
  .btn-primary {
    @apply h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 
           disabled:bg-gray-500 disabled:text-gray-300 
           transition-colors;
  }
</style>
