<script lang="ts">
  export let show: boolean = false;
  export let onClose: () => void = () => {};

  export let title: string = "";
  export let content: string = "";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {})
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
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
        {content}
      </p>
      <hr class="border-gray-500 border-1" />
      <div class="flex flex-row justify-center space-x-4">
        <button
          class="p-2 font-bold rounded-lg bg-blue-500"
          on:click={copyToClipboard}
        >
          Copy
        </button>
        <button class="p-2 font-bold rounded-lg bg-blue-500" on:click={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
</style>
