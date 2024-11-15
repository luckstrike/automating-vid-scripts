<script lang="ts">
  import Sidebar from "$lib/Sidebar.svelte";
  import "../global.css";
  import "../app.css";
  import { goto, invalidate } from "$app/navigation";
  import { redirect } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import { authStore } from "$lib/stores/authStore";
  import { scriptIdStore, scriptSaveStatus } from "$lib/stores/scriptStore";
  import { page } from "$app/stores";
  import Landing from "$lib/Landing.svelte";
  import HamburgerMenu from "$lib/HamburgerMenu.svelte";

  export let data;
  $: ({ session, supabase } = data);

  // This sets the scriptSaveStatus store to false whenever it
  // isn't the route being accessed (basically resetting it)
  $: {
    if (!$page.url.pathname.startsWith("/script")) {
      scriptSaveStatus.set(false);
    }

    // If a user somehow accesses the script path with no script
    // selected, we should redirect them to the dashboard
    if (!$scriptIdStore && $page.url.pathname.startsWith("/script")) {
      redirect(307, "/dashboard");
    }
  }

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<div class="flex flex-row h-screen">
  {#if $page.url.pathname === "/"}
    <Landing />
  {:else if $page.url.pathname === "/login"}
    <slot />
  {:else}
    <div class="flex flex-col lg:flex-row w-screen h-screen">
      <div class="hidden lg:block overflow-y-auto min-h-screen">
        <Sidebar />
      </div>
      <div class="lg:hidden">
        <HamburgerMenu />
      </div>
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  {/if}
</div>

<style>
</style>
