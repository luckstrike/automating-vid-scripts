<script lang="ts">
  export let value: string = "";
  export let placeholder: string = "Type something";
  export let maxLength = 1000;
  export let showCount = true;
  export let maxHeight = "500px";

  $: charCount = value?.length ?? 0;
  $: isNearLimit = charCount > maxLength * 0.9;
</script>

<div class="relative">
  <div
    class="grow-wrap"
    data-replicated-value={value}
    style="max-height: {maxHeight};"
  >
    <textarea
      bind:value
      {placeholder}
      maxlength={maxLength}
      class="w-full resize-none rounded-lg border border-gray-300 p-4
             hover:border-gray-400 focus:border-blue-500 focus:outline-none
             focus:ring-2 focus:ring-blue-500 transition-colors duration-200
             break-words font-sans text-base leading-normal pb-8 text-black"
    />
  </div>

  {#if showCount}
    <div
      class="absolute bottom-2 right-2 text-sm transition-colors"
      class:text-red-500={isNearLimit}
      class:text-gray-400={!isNearLimit}
    >
      {charCount}/{maxLength}
    </div>
  {/if}
</div>

<style>
  .grow-wrap {
    display: grid;
    width: 100%; /* Force the wrapper to match parent width */
  }

  .grow-wrap::after {
    content: attr(data-replicated-value) " ";
    white-space: pre-wrap;
    visibility: hidden;
    word-break: break-word; /* Force text to wrap */
  }

  .grow-wrap > textarea,
  .grow-wrap::after {
    grid-area: 1 / 1 / 2 / 2;
    padding: 1rem;
    padding-bottom: 2rem;
    font: inherit;
    word-break: break-word; /* Force text wrapping in textarea too */
  }
</style>
