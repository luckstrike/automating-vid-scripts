<script lang="ts">
  import { auth } from "$lib/firebase/firebase.client";
  import { authHandlers, authStore } from "$lib/stores/authStore";
  import LoginReset from "$lib/LoginReset.svelte";
  import Dashboard from "./Dashboard.svelte";
  import EosIconsLoading from "~icons/eos-icons/loading";

  export let data;
  $: session = data.session;
</script>

<div class="w-full h-full">
  {#if session}
    <Dashboard {data} />
  {:else if $authStore.isLoading}
    <div
      class="flex flex-col min-h-[100%] items-center justify-center text-white space-y-1"
    >
      <EosIconsLoading class="text-4xl text-white" />
      <div>Loading...</div>
    </div>
  {:else}
    <h1>???</h1>
  {/if}
</div>
