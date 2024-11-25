<script lang="ts">
  import Dashboard from "./Dashboard.svelte";
  import EosIconsLoading from "~icons/eos-icons/loading";

  export let data;
  $: session = data.session;
</script>

<div class="w-full h-full">
  {#if session}
    <Dashboard {data} />
  {:else}
    <h1>No user session found</h1>
  {/if}
</div>
