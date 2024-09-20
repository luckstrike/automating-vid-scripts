<script lang="ts">
  import Login from "$lib/Login.svelte";
  import { authStore } from "$lib/stores/authStore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  function handleAuthState(user) {
    if (user) {
      goto("/dashboard");
    }
  }

  $: if (!authStore.isLoading) {
    handleAuthState($authStore.currentUser);
  }
</script>

<div class="flex h-screen w-screen">
  {#if !$authStore.isLoading && !$authStore.currentUser}
    <Login />
  {/if}
</div>
