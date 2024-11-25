<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { scriptIdStore } from "./stores/scriptStore";

  // Sidebar Icons
  import MaterialSymbolsLightSpaceDashboardOutline from "~icons/material-symbols-light/space-dashboard-outline";
  import OcticonLightBulb16 from "~icons/octicon/light-bulb-16";
  import FluentScript16Regular from "~icons/fluent/script-16-regular";
  import FluentDocumentOnePageSparkle24Regular from "~icons/fluent/document-one-page-sparkle-24-regular";
  import MaterialSymbolsLogout from "~icons/material-symbols/logout";
  import PajamasCollapseLeft from "~icons/pajamas/collapse-left";

  let isCollapsed = false;

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }

  $: currPath = $page.url.pathname;

  $: isActive = (path: string) => {
    const isMatch = currPath.startsWith(path);
    return isMatch;
  };
</script>

<div
  class="flex flex-col h-full {isCollapsed
    ? 'w-16'
    : 'w-64'} text-xl text-white bg-[#1f1f1f] transition-all duration-300"
>
  <div class="flex flex-col">
    <button
      class="flex flex-row items-center h-16 {isCollapsed
        ? 'justify-center'
        : 'pl-4 space-x-8'} justify-left hover:bg-gray-600 {isActive(
        '/dashboard',
      )
        ? 'bg-gray-700'
        : ''}"
      on:click={() => goto("/dashboard")}
    >
      <MaterialSymbolsLightSpaceDashboardOutline />
      <span
        class="overflow-hidden transition-all duration-300 {isCollapsed
          ? 'w-0 opacity-0'
          : 'w-auto opacity-100'}"
      >
        Dashboard</span
      >
    </button>
    <button
      class="flex flex-row items-center h-16 {isCollapsed
        ? 'justify-center'
        : 'pl-4 space-x-8'} justify-left hover:bg-gray-600 {isActive(
        '/brainstorm',
      )
        ? 'bg-gray-700'
        : ''}"
      on:click={() => goto("/brainstorm")}
    >
      <OcticonLightBulb16 />
      <span
        class="overflow-hidden transition-all duration-300 {isCollapsed
          ? 'w-0 opacity-0'
          : 'w-auto opacity-100'}"
      >
        Brainstorm
      </span>
    </button>
    {#if $scriptIdStore}
      <!-- Only show this tab if a script has been opened -->

      <button
        class="flex flex-row items-center h-16 {isCollapsed
          ? 'justify-center'
          : 'pl-4 space-x-8'} justify-left hover:bg-gray-600 {isActive(
          '/script',
        )
          ? 'bg-gray-700'
          : ''}"
        on:click={() => goto(`/script/${$scriptIdStore}`)}
      >
        <FluentScript16Regular />
        <span
          class="overflow-hidden transition-all duration-300 {isCollapsed
            ? 'w-0 opacity-0'
            : 'w-auto opacity-100'}"
        >
          Script
        </span>
      </button>
    {/if}
    <button
      class="flex flex-row items-center h-16 {isCollapsed
        ? 'justify-center'
        : 'pl-4 space-x-8'} justify-left hover:bg-gray-600 {isActive(
        '/summarize',
      )
        ? 'bg-gray-700'
        : ''}"
      on:click={() => goto("/summarize")}
    >
      <FluentDocumentOnePageSparkle24Regular />
      <span
        class="overflow-hidden transition-all duration-300 {isCollapsed
          ? 'w-0 opacity-0'
          : 'w-auto opacity-100'}"
      >
        Summarize
      </span>
    </button>
  </div>
  <div class="mt-auto w-full">
    <button
      class="w-full flex flex-row items-center h-16 {isCollapsed
        ? 'justify-center'
        : 'pl-4 space-x-8'} justify-left hover:bg-gray-600"
      on:click={() => goto("/auth/logout")}
    >
      <MaterialSymbolsLogout />
      <span
        class="overflow-hidden transition-all duration-300 {isCollapsed
          ? 'w-0 opacity-0'
          : 'w-auto opacity-100'}"
      >
        Log Out
      </span>
    </button>
    <button
      class="w-full flex flex-row items-center h-16 {isCollapsed
        ? 'justify-center'
        : 'pl-4 space-x-8'} hover:bg-gray-600"
      on:click={toggleSidebar}
    >
      <PajamasCollapseLeft
        class="transition-transform duration-300 {isCollapsed
          ? 'rotate-180'
          : ''}"
      />
      <span
        class="overflow-hidden transition-all duration-300 {isCollapsed
          ? 'w-0 opacity-0'
          : 'w-auto opacity-100'}"
      >
        Collapse
      </span>
    </button>
  </div>
</div>
