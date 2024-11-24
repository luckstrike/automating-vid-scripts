<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { scriptIdStore } from "./stores/scriptStore";
  import MaterialSymbolsLightSpaceDashboardOutline from "~icons/material-symbols-light/space-dashboard-outline";
  import OcticonLightBulb16 from "~icons/octicon/light-bulb-16";
  import FluentScript16Regular from "~icons/fluent/script-16-regular";
  import FluentDocumentOnePageSparkle24Regular from "~icons/fluent/document-one-page-sparkle-24-regular";
  import MaterialSymbolsLogout from "~icons/material-symbols/logout";
  let tabs = ["dashboard", "brainstorm", "script", "summarize"];

  $: currPath = $page.url.pathname;

  $: isActive = (path: string) => {
    const isMatch = currPath.startsWith(path);
    return isMatch;
  };
</script>

<div class="flex flex-col h-full w-64 text-xl text-white bg-[#1f1f1f]">
  <button
    class="flex flex-row items-center h-16 space-x-8 pl-8 justify-left hover:bg-gray-600 {isActive(
      '/dashboard',
    )
      ? 'bg-gray-700'
      : ''}"
    on:click={() => goto("/dashboard")}
  >
    <MaterialSymbolsLightSpaceDashboardOutline />
    <span>Dashboard</span>
  </button>
  <button
    class="flex flex-row items-center h-16 space-x-8 pl-8 justify-left hover:bg-gray-600 {isActive(
      '/brainstorm',
    )
      ? 'bg-gray-700'
      : ''}"
    on:click={() => goto("/brainstorm")}
  >
    <OcticonLightBulb16 />
    <span>Brainstorm</span>
  </button>
  {#if $scriptIdStore}
    <!-- Only show this tab if a script has been opened -->

    <button
      class="flex flex-row items-center h-16 space-x-8 pl-8 justify-left hover:bg-gray-600 {isActive(
        '/script',
      )
        ? 'bg-gray-700'
        : ''}"
      on:click={() => goto(`/script/${$scriptIdStore}`)}
    >
      <FluentScript16Regular />
      <span>Script</span>
    </button>
  {/if}
  <button
    class="flex flex-row items-center h-16 space-x-8 pl-8 justify-left hover:bg-gray-600 {isActive(
      '/summarize',
    )
      ? 'bg-gray-700'
      : ''}"
    on:click={() => goto("/summarize")}
  >
    <FluentDocumentOnePageSparkle24Regular />
    <span>Summarize</span>
  </button>
  <button
    class="flex flex-row items-center h-16 space-x-8 pl-9 justify-left hover:bg-gray-600"
    on:click={() => goto("/auth/logout")}
  >
    <MaterialSymbolsLogout />
    <span>Log Out</span>
  </button>
</div>
