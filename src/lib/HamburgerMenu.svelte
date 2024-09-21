<script lang="ts">
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };

  function changeTabs(subdirectory: string) {
    goto(subdirectory);
    isOpen = !isOpen;
  }
</script>

<div class="flex flex-col">
  <div class="text-right">
    <button
      on:click={toggleMenu}
      class="bg-gray-700 rounded-lg text-4xl p-1 text-center text-white focus:outline-none"
    >
      ☰
    </button>
  </div>
  {#if isOpen}
    <div class="">
      <div
        transition:fade={{ duration: 100 }}
        class="fixed inset-0 bg-gray-800 bg-opacity-90 z-50"
      >
        <div
          class="flex flex-col space-y-4 font-bold items-center justify-center h-full text-white"
        >
          <button on:click={toggleMenu} class="absolute top-4 right-4 text-2xl">
            X
          </button>
          <button on:click={() => changeTabs("/dashboard")}>Dashboard</button>
          <button on:click={() => changeTabs("/brainstorm")}>Brainstorm</button>
          <button on:click={() => changeTabs("/script")}>Script</button>
          <button on:click={() => changeTabs("/summarize")}>Summarize</button>
          <button on:click={() => changeTabs("/")}>Log Out</button>
        </div>
      </div>
    </div>
  {/if}
</div>
