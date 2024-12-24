<script lang="ts">
  export let show: boolean = false;
  export let onClose: () => void = () => {};

  export let title: string = "";
  export let content: string = "";

  // Used by the copy button
  let showCopied: boolean = false;

  const copyToClipboard = () => {
    // Remove bullet points and clean up the text
    const cleanContent = content
      .split("•")
      .filter(Boolean)
      .map((line) => line.trim())
      .join("\n");

    navigator.clipboard
      .writeText(cleanContent)
      .then(() => {})
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    showCopied = true;
    setTimeout(() => {
      showCopied = false;
    }, 2000);
  };
</script>

{#if show}
  <div
    class="flex inset-0 fixed bg-black/50 items-center justify-center z-50"
    on:click={onClose}
  >
    <div
      class="flex flex-col p-4 space-y-2 max-h-[80%] w-1/2 max-w-[80%] rounded-lg text-white bg-[#1f1f1f]"
      on:click|stopPropagation
    >
      <div class="text-xl font-bold text-center">{title}</div>
      <hr class="border-gray-500 border-1" />
      <p class="p-2 overflow-y-scroll items-center justify-center">
        {#each content.replace(/•/g, "\n•").split("\n").filter(Boolean) as line}
          <span class="block py-1">{line.trim()}</span>
        {/each}
      </p>
      <hr class="border-gray-500 border-1" />
      <div class="flex flex-row justify-center space-x-4">
        <button
          class="p-2 font-bold rounded-lg bg-blue-500"
          on:click={copyToClipboard}
        >
          {#if showCopied}
            Copied!
          {:else}
            Copy
          {/if}
        </button>
        <button class="p-2 font-bold rounded-lg bg-blue-500" on:click={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
