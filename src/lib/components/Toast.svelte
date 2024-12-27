<!-- src/lib/components/Toast.svelte -->
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { toastStore } from "$lib/stores/toast";
</script>

<div
  class="fixed z-50 flex flex-col gap-2 p-4 pointer-events-none
            sm:top-4 sm:right-4
            bottom-0 left-0 sm:left-auto w-full sm:w-auto"
>
  {#each $toastStore as toast (toast.id)}
    <div
      class="rounded-lg shadow-lg p-4 pointer-events-auto
             w-full sm:min-w-[300px] sm:max-w-[380px]
             flex items-center justify-between
             {toast.type === 'success' ? 'bg-green-100' : ''}
             {toast.type === 'error' ? 'bg-red-100' : ''}
             {toast.type === 'warning' ? 'bg-yellow-100' : ''}
             {toast.type === 'info' ? 'bg-blue-100' : ''}"
      in:fly={{ y: 50, duration: 200 }}
      out:fade={{ duration: 150 }}
      on:click={() => toastStore.remove(toast.id)}
    >
      <span class="text-sm sm:text-base flex-grow mr-2">
        {toast.message}
      </span>

      <button
        class="p-1 hover:bg-black/5 rounded-full"
        aria-label="Dismiss notification"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>
