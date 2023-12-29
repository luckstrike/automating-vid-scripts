<script lang='ts'>
    import { auth, db } from '$lib/firebase/firebase.client';
    
    import { authHandlers, authStore } from "$lib/stores/authStore";
	import type { User } from 'firebase/auth';
    import { collection, getDocs, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let currentUser: User | null;

    // TODO: Get the user's scripts from the database
    // and display them in the script-boxes div (only show three max)
    // one of the script-boxes should be a button to make a new script
    // Then also list them in the script-list div

    async function loadUserScripts() {
        if (!currentUser) {
            console.log("No user authenticated");
            // Optionally, handle the case when there's no user (e.g., redirect to login)
            return;
        }

        try {
            const q = query(collection(db, "documents"), where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);


            // This actually gets the documents
            // The querySnapshot is an array of documents

            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().doc_name}`);
            });
        } catch (error) {
            console.error("Error loading scripts:", error);
            // Handle the error appropriately
        }
    }


    onMount(() => {
        // This needs to be used to pull up the current user's scripts
        const unsubscribe = auth.onAuthStateChanged((user) => {
            currentUser = user;
            if (currentUser) {
                // This is only called once the user has been resolved

                // This is being called every time the dashboard is rendered though
                // TODO: Figure out if there's a way to minimize this?
                loadUserScripts();
            }
        });

        return unsubscribe;
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