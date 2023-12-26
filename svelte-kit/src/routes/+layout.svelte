<script lang="ts">
    import Sidebar from "$lib/Sidebar.svelte";
    import '../global.css';

    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase/firebase.client';
    import { authStore } from "$lib/stores/authStore";
    import { browser } from '$app/environment';
    import { type User } from 'firebase/auth'

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Current User: ", user);
            // Updates the current user in the authStore
            // TODO: Change any to User (I need to find out how to use the User type from firebase)

            authStore.update((curr: any) => {
                return {
                    ...curr,
                    isLoading: false,
                    currentUser: user
                }
            });

            // Takes the user back to the root (login) page if they are not logged in
            if (browser && !$authStore.currentUser && !$authStore.isLoading && window.location.pathname != '/') {
                window.location.href = '/';
            }
        });

        return unsubscribe;
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