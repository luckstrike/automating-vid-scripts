<script lang='ts'>
    import { auth } from '$lib/firebase/firebase.client';
    import { authHandlers, authStore } from "$lib/stores/authStore";
    import LoginReset from "$lib/LoginReset.svelte";

    let userEmail: string | null;

    authStore.subscribe((curr) => {
        console.log("Current User: ", curr?.currentUser);
        userEmail = curr?.currentUser?.email; // TODO: idk how to fix this ts error?
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