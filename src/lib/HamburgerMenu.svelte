<script lang="ts">
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { authHandlers } from "./stores/authStore";
  import IcRoundClose from "~icons/ic/round-close";
  import SolarHamburgerMenuLinear from "~icons/solar/hamburger-menu-linear";
  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };

  function changeTabs(subdirectory: string) {
    isOpen = !isOpen;
    goto(subdirectory);
  }

  function logOut() {
    isOpen = !isOpen;
    authHandlers.logout();
  }
</script>

<div class="flex flex-col">
  <div class="text-right">
    <button
      on:click={toggleMenu}
      class="rounded-lg w-12 h-12 text-white focus:outline-none inline-flex items-center justify-center"
    >
      <span class="text-2xl leading-none relative top-[-1px] right-[-2px]">
        <SolarHamburgerMenuLinear />
      </span>
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
          <button on:click={toggleMenu} class="absolute top-2 right-2 text-2xl">
            <IcRoundClose />
          </button>
          <button on:click={() => changeTabs("/dashboard")}>Dashboard</button>
          <button on:click={() => changeTabs("/brainstorm")}>Brainstorm</button>
          <button on:click={() => changeTabs("/script")}>Script</button>
          <button on:click={() => changeTabs("/summarize")}>Summarize</button>
          <button on:click={() => logOut()}>Log Out</button>
        </div>
      </div>
    </div>
  {/if}
</div>
