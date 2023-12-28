<script lang='ts'>
    import { auth } from '$lib/firebase/firebase.client';
    
    import { authHandlers, authStore } from "$lib/stores/authStore";
    import { onMount } from 'svelte';

    onMount(() => {
        // This needs to be used to pull up the current user's scripts
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Current User: ", user);
            // Updates the current user in the authStore
        });
    });
</script>