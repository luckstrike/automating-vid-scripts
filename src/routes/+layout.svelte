<script lang="ts">
  import Sidebar from "$lib/Sidebar.svelte";
  import "../global.css";
  import "../app.css";

  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/firebase.client";
  import { authStore } from "$lib/stores/authStore";
  import { scriptSaveStatus } from "$lib/stores/scriptStore";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Landing from "$lib/Landing.svelte";

  // This sets the scriptSaveStatus store to false whenever it
  // isn't the route being accessed (basically resetting it)
  // TODO: If I ever want to keep the text editors states
  //       while changing states I will need to remove this
  $: {
    if (!$page.url.pathname.startsWith("/script")) {
      scriptSaveStatus.set(false);
    }
  }

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Updates the current user in the authStore
      // TODO: Change any to User (I need to find out how to use the User type from firebase)

      authStore.update((curr: any) => {
        return {
          ...curr,
          isLoading: false,
          currentUser: user,
        };
      });
    });

    return unsubscribe;
  });
</script>

<div class="flex flex-row h-screen">
  {#if $page.url.pathname === "/"}
    <Landing />
  {:else if $page.url.pathname === "/login"}
    <slot />
  {:else}
    <Sidebar />
    <slot />
  {/if}
</div>

<style>
</style>
