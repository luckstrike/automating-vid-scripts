<script lang="ts">
  import { goto } from "$app/navigation";
  import { authHandlers } from "./stores/authStore";
</script>

<div class="flex flex-col h-full w-64 text-xl text-white bg-[#1f1f1f]">
  <button class="h-16 hover:bg-gray-600" on:click={() => goto("/dashboard")}
    >Dashboard</button
  >
  <button class="h-16 hover:bg-gray-600" on:click={() => goto("/brainstorm")}
    >Brainstorm</button
  >
  <button class="h-16 hover:bg-gray-600" on:click={() => goto("/script")}
    >Script</button
  >
  <button class="h-16 hover:bg-gray-600" on:click={() => goto("/summarize")}
    >Summarize</button
  >
  <button class="h-16 hover:bg-gray-600" on:click={() => authHandlers.logout()}
    >Log Out</button
  >
</div>
