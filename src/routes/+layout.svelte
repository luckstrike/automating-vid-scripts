<script lang="ts">
  import Sidebar from "$lib/Sidebar.svelte";
  import "../global.css";
  import "../app.css";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Landing from "$lib/Landing.svelte";
  import HamburgerMenu from "$lib/HamburgerMenu.svelte";

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    // Redirect the user to the /dashboard tab if they are logged in
    if (session && $page.url.pathname === "/") {
      goto("/dashboard");
    }

    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<div class="flex flex-row h-screen">
  {#if $page.url.pathname === "/" && !session}
    <Landing />
  {:else if $page.url.pathname === "/auth/login"}
    <slot />
  {:else if session}
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
