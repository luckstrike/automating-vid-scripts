<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { scriptMetaIdStore } from "./stores/scriptStore";

  let tabs = ["dashboard", "brainstorm", "script", "summarize"];

  $: currPath = $page.url.pathname;

  $: isActive = (path: string) => {
    const isMatch = currPath.startsWith(path);
    return isMatch;
  };
</script>

<div class="flex flex-col h-full w-64 text-xl text-white bg-[#1f1f1f]">
  <button
    class="h-16 hover:bg-gray-600 {isActive('/dashboard') ? 'bg-gray-700' : ''}"
    on:click={() => goto("/dashboard")}>Dashboard</button
  >
  <button
    class="h-16 hover:bg-gray-600 {isActive('/brainstorm')
      ? 'bg-gray-700'
      : ''}"
    on:click={() => goto("/brainstorm")}>Brainstorm</button
  >
  {#if $scriptMetaIdStore}
    <!-- Only show this tab if a script has been opened -->
    <button
      class="h-16 hover:bg-gray-600 {isActive('/script') ? 'bg-gray-700' : ''}"
      on:click={() => goto("/script")}>Script</button
    >
  {/if}
  <button
    class="h-16 hover:bg-gray-600 {isActive('/summarize') ? 'bg-gray-700' : ''}"
    on:click={() => goto("/summarize")}>Summarize</button
  >
  <button class="h-16 hover:bg-gray-600" on:click={() => goto("/auth/logout")}
    >Log Out</button
  >
</div>
