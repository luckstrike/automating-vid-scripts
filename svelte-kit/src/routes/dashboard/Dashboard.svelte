<script lang='ts'>
    import { auth } from '$lib/firebase/firebase.client';
    
    import { authHandlers, authStore } from "$lib/stores/authStore";
	import type { User } from 'firebase/auth';
    import { onMount } from 'svelte';

    let currentUser: User | null;

    // TODO: Get the user's scripts from the database
    // and display them in the script-boxes div (only show three max)
    // one of the script-boxes should be a button to make a new script
    // Then also list them in the script-list div

    onMount(() => {
        // This needs to be used to pull up the current user's scripts
        const unsubscribe = auth.onAuthStateChanged((user) => {
            currentUser = user;
            console.log("Current User: ", currentUser);
            // Updates the current user in the authStore
        });
    });

</script>

<div class="container">
    <h1 class="title">Howdy {currentUser?.email}! Ready to start script writing?</h1>
    <p class="title">or create a new script with Brainstorm or Summarize a URL!</p>

    <div class="script-boxes">

    </div>

    <div class="script-list">

    </div>

</div>

<style>
    /* Empty for now */
    .container {
        display: flex; /* Activate Flexbox */
        flex-direction: column; /* Stack children vertically */
        align-items: center; /* Center children horizontally */
        height: 100vh; /* Full viewport height */
        flex: 0 0 85%;
    }

    .title {
        color: #fff;
        margin: 0;
        margin-top: 15px;
    }

</style>