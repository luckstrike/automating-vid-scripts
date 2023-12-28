<script lang='ts'>
    import { auth } from '$lib/firebase/firebase.client';
    import { authHandlers, authStore } from "$lib/stores/authStore";
    import LoginReset from "$lib/LoginReset.svelte";

    // TODO: This should show up once you're logged in
    // and show all of your existing scripts!        

    let userEmail: string | null;

    authStore.subscribe((curr: any) => {
        console.log("Current User: ", curr?.currentUser);
        userEmail = curr?.currentUser?.email;
    });
</script>

<div class="container">
    {#if $authStore.currentUser}
        <h1>Hello, {$authStore.currentUser.email}</h1>
        <LoginReset />
    {:else}
        <h1>Not logged in</h1>
    {/if}
</div>

<style>

</style>