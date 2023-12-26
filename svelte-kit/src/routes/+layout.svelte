<script lang="ts">
    import Sidebar from "$lib/Sidebar.svelte";
    import '../global.css';

    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase/firebase.client';
    import { authStore } from "$lib/stores/authStore";

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user);
            // Updates the current user in the authStore
            authStore.update((curr) => {
                return {
                    ...curr,
                    isLoading: false,
                    currUser: user
                }
            });
        });
    })
</script>

<div class="container">
    <Sidebar />
    <slot />
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>