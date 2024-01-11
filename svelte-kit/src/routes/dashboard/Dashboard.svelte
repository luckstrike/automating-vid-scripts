<script lang='ts'>
    import { auth, db } from '$lib/firebase/firebase.client';
    
    import { authHandlers, authStore } from "$lib/stores/authStore";
	import type { User } from 'firebase/auth';
    import { collection, getDocs, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';

    // Icon Imports
    import Fa from 'svelte-fa'
    import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons'

    let currentUser: User | null;

    // TODO: Get the document titles and display them in the script-boxes div,
    // organize them the most recent updated date
    
    // TODO: In Firestore, maybe move the content to a subcollection so it isn't all loaded at once?
    // Right now Firestore is loading all of the document at once so in cases where the document
    // is closer to 1MB, it's going to take a while to load

    async function loadUserScripts() {
        if (!currentUser) {
            console.log("No user authenticated");
            // Optionally, handle the case when there's no user (e.g., redirect to login)
            return;
        }

        try {
            // Only get the documents that belong to the current user
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

    function setActiveButton(button: string) {
        if (button === "name") {
            sortByName();
        } else if (button === "last-updated") {
            sortByDate();
        }

        sortModeActive = button;
    }

    function handleKeydown(event, action) {
        if (event.key === "Enter") {
            action();
        }
    }

    // Function to sort by date
    function sortByDate() {
        filteredData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Function to sort alphabetically by name
    function sortByName() {
        filteredData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    }

    let data = [
        {name: "Corn on a Cob", lastUpdated: "2023-01-01"},
        {name: "Berry Bicycles", lastUpdated: "2023-01-02"},
        {name: "Artic Aardvarks", lastUpdated: "2023-01-03"},
    ];

    let filteredData = data;

    let sortModeActive: string | null = 'last-updated';

</script>

<div class="container">
    <h1 class="title">Howdy {currentUser?.email}! Ready to start script writing?</h1>
    <p class="title">or create a new script with Brainstorm or Summarize a URL!</p>

    <div class="script-boxes">
        <div class="rectangle-container">
            <div class="script-rectangle" id="new-script">
                <Fa icon={faPlus} />
            </div>
            <div class="script-title">Create a New Script</div>
        </div>

        <!-- Use a loop here to create scripts, depending on how many scripts exist-->
        <div class="rectangle-container">
            <div class="script-rectangle"></div>
            <div class="script-title">Title 1</div>
        </div>
        <div class="rectangle-container">
            <div class="script-rectangle"></div>
            <div class="script-title">Title 2</div>
        </div>
        <div class="rectangle-container">
            <div class="script-rectangle"></div>
            <div class="script-title">Title 3</div>
        </div>
    </div>

    <div class="script-list">
        <table class="script-table">
            <thead>
            <tr class="table-row">
                <th class="table-name">
                    <div 
                        class="clickable-icon" 
                        on:click={() => setActiveButton("name")}
                        role="button"
                        tabindex="0"
                        on:keydown={(event) => handleKeydown(event, () => setActiveButton("name"))}
                    >
                        Name
                        <Fa
                            icon={faCaretDown} 
                            style="color: {sortModeActive == 'name' ? '#1f1f1f' : 'lightgray'}"
                        />
                    </div>
                </th>
                <th class="table-date">
                    <div 
                        class="clickable-icon" 
                        on:click={() => setActiveButton("last-updated")}
                        role="button"
                        tabindex="0"
                        on:keydown={(event) => handleKeydown(event, () => setActiveButton("last-updated"))}
                    >
                        Last Updated
                        <Fa
                            icon={faCaretDown}
                            style="color: {sortModeActive == 'last-updated' ? '#1f1f1f' : 'lightgray'}"
                        />
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            {#each filteredData as item}
                <tr class="table-row">
                <td class="table-name">{item.name}</td>
                <td class="table-date">{item.lastUpdated}</td>
                </tr>
            {/each}
            </tbody>
        </table>
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

    .clickable-icon {
        cursor: pointer;
    }

    .title {
        color: #fff;
        margin-top: 10px;
    }
    
    .script-boxes {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
    }

    .script-rectangle {
        width: 18.7vh; /* Trying to make this follow the 8.5 */
        height: 24.2vh; /* Trying to make this follow the 11 */
        background-color: #fff;
        border-radius: 5px; /* Might remove the rounded corners */
        margin-left: 25px;
        margin-right: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .script-title {
        color: #fff;
        margin-top: 10px;
        text-align: center;
    }

    #new-script {
        font-size: 36px;
        color: #2f2f2f;
    }

    .script-list {
        display: flex;
        margin-top: 5vh;
    }

    .script-table {
        border-collapse: collapse;
        width: 100vh;
        text-align: left;
        background-color: white;
        border-radius: 10px;
    }

    /* Makes the Name column only take up 70% of the table width*/
    .table-name {
        width: 70%;
        padding: 10px;
    }

    /* Makes the Last Updated dates only take up 30% of the table width*/
    .table-date {
        width: 30%;
        padding: 10 px;
    }
    
    .table-row {
        border-bottom: 1px solid #2f2f2f;
    }

</style>