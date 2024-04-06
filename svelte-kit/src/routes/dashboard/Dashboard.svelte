<script lang='ts'>
    import { auth, db } from '$lib/firebase/firebase.client';
    
    import { authHandlers, authStore  } from "$lib/stores/authStore";
    import { scriptIdStore, scriptMetaIdStore } from "$lib/stores/scriptStore"

	import type { User } from 'firebase/auth';
    import { DocumentReference, DocumentSnapshot, Timestamp, addDoc, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';

    // Icon Imports
    import Fa from 'svelte-fa'
    import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons'

    // Script Type Import
    import type { Script } from '$lib/index.ts'

    // Redirecting to another route
    import { goto } from '$app/navigation'

    // TODO: Not a fan of how this just updates the global variables, fix this later

    let isLoading: boolean = true;

    let currentUser: User | null;

    // Used to hold all of a user's scripts
    let filteredData: Script[] = [];
    let previewData: Script[] = []; // the data shown next to the add a new script

    // Used to hold whether data is sorted by ascending or descending manner
    // (ex. A-Z or Z-A, most recent to least recent, etc...)
    let isNameAscending = true;
    let isDateAscending = true;

    // TODO: Get the document titles and display them in the script-boxes div,
    // organize them the most recent updated date
    
    // TODO: In Firestore, maybe move the content to a subcollection so it isn't all loaded at once?
    // Right now Firestore is loading all of the document at once so in cases where the document
    // is closer to 1MB, it's going to take a while to load

    async function loadUserScripts() {
        let scriptData: Script[] = [];

        if (!currentUser) {
            console.log("No user authenticated");
            // Optionally, handle the case when there's no user (e.g., redirect to login)
            return;
        }

        try {
            const q = query(collection(db, "documents"), where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);

            filteredData = []; // Clear existing data

            // Getting the Script data from Firestore
            querySnapshot.forEach((doc) => {
                const timestamp = doc.data().updated;

                const formattedDate = timestamp.toDate().toLocaleDateString("en-US");
                const formattedTime = timestamp.toDate().toLocaleTimeString("en-US");

                const dateTime = `${formattedDate} ${formattedTime}`;

                filteredData = [...filteredData, {
                    name: doc.data().doc_name,
                    lastUpdatedString: dateTime,
                    lastUpdatedDate: timestamp,
                    content: doc.data().content,
                    metaDocId: doc.id
                }].sort((a, b) => new Date(b.lastUpdatedString) - new Date(a.lastUpdatedString));
            });

            // Determines how many preview script rectangles are shown
            let maxPreview: number = 3;

            previewData = [...filteredData].sort((a, b) => new Date(b.lastUpdatedDate) - new Date(a.lastUpdatedDate)).slice(0, maxPreview);

            // Loading is now complete, render eveything!
            isLoading = false;

        } catch (error) {
            console.error("Error loading scripts:", error);
        }

        return scriptData;
    }

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            currentUser = user;
            if (currentUser) {
                loadUserScripts(); // No need to assign, as loadUserScripts will update filteredData directly
            }
        });

        return unsubscribe;
    });

    // Used to get the script from the database and then show it to the user
    async function getScript(item: Script) {
        // This should ideally get the script's document ID
        // Type assertion: Explicitly tell TypeScript that `item.content` is a DocumentReference
        const documentReference = item.content as DocumentReference;

        // Proceed with the assumption that `item.content` is now a DocumentReference
        const docSnap = await getDoc(documentReference);
        
        // Checking if docSnap actually exists
        if (docSnap.exists()) {
            scriptIdStore.set(docSnap.id); // Update the store with the script id that was clicked on
            scriptMetaIdStore.set(item.metaDocId); // Update the store with the id of the script's meta data
            goto(`/script/${docSnap.id}`); // Go to the script with the id provided by docSnap.id
        } else {
            console.log("No such document!");
        }
    }


    // TODO: Make these functions not die when no data is loaded or available
    // Function to toggle and sort by name
    function toggleSortByName() {
        filteredData.sort((a, b) => isNameAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        filteredData = [...filteredData];
        isNameAscending = !isNameAscending;
    }

    // Function to toggle and sort by date
    function toggleSortByDate() {
        filteredData.sort((a, b) => isDateAscending ? new Date(a.lastUpdatedString) - new Date(b.lastUpdatedString) : new Date(b.lastUpdatedString) - new Date(a.lastUpdatedString));
        filteredData = [...filteredData];
        isDateAscending = !isDateAscending;
    }

    function setActiveButton(button: string) {
        if (button === "name") {
            toggleSortByName();
        } else if (button === "last-updated") {
            toggleSortByDate();
        }

        sortModeActive = button;
    }

    function handleKeydown(event, action) {
        if (event.key === "Enter") {
            action();
        }
    }

    interface TextContent {
        content: string,
        uid: string
    }

    interface ScriptMetaData {
        content: DocumentReference<TextContent>,
        created: Timestamp,
        doc_name: string,
        uid: string,
        updated: Timestamp
    }

    const contentCollection: string = "textcontent";
    const scriptMetaInfoCollection: string = "documents";

    async function createScript() {
        let currentUserUid = $authStore.currentUser?.uid; // get's the uid

        if (!currentUserUid) {
            console.error("No user UID found");
            return;
        }

        try {
            // Creating the textContent document to hold the script's text content
            const contentDocRef: DocumentReference<TextContent> = await addDoc(collection(db, contentCollection), {
                content: "",
                uid: currentUserUid
            });

            console.log("Document written with ID: ", contentDocRef.id);

            // Creating the documents document that holds the script's meta data info and a 
            // reference to the script's content data

            const metaDataDocRef: DocumentReference<ScriptMetaData> = await addDoc(collection(db, scriptMetaInfoCollection), {
                content: contentDocRef, // reference to the previously made textContent document
                created: Timestamp.now(),
                doc_name: "Untitled Document",
                uid: currentUserUid,
                updated: Timestamp.now()
            });

            console.log("Document written with ID: ", metaDataDocRef.id);
        } catch (e) {
            console.error("Error creating documents:", e)
        }
    }

    let sortModeActive: string | null = 'last-updated';

</script>

<div class="container">
    {#if !isLoading}
        <h1 class="title">Howdy {currentUser?.email}! Ready to start script writing?</h1>
        <p class="title">or create a new script with Brainstorm or Summarize a URL!</p>

        <div class="script-boxes">
            <div class="rectangle-container">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="script-rectangle" id="new-script" on:click={() => createScript()}>
                    <Fa icon={faPlus} />
                </div>
                <div class="script-title">Create a New Script</div>
            </div>

            <!-- Shows only the first 3 items in the query-->
            <!-- Not sure if this sorts them by last updated though -->
            {#each previewData as item}
                <div class="rectangle-container">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="script-rectangle" on:click={() => getScript(item)}></div>
                    <div class="script-title">{item.name}</div>
                </div>
            {/each}

        </div>

        <div class="script-list">
            <table class="script-table">
                <thead>
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
                                style="color: {sortModeActive == 'name' ? '#2f2f2f' : 'lightgray'}"
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
                                style="color: {sortModeActive == 'last-updated' ? '#2f2f2f' : 'lightgray'}"
                            />
                        </div>
                    </th>
                </thead>
                <tbody>
                {#each filteredData as item}
                    <tr class="table-row" on:click={() => getScript(item)}>
                    <td class="table-name">{item.name}</td>
                    <td class="table-date">{item.lastUpdatedString}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <!-- TODO: Make this either a loading screen or just keep it empty-->
    {/if}

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
        margin-bottom: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .script-rectangle:hover {
        background-color: lightgray;
        transform: scale(110%)
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
        border-bottom: 1px solid #2f2f2f;
    }

    /* Makes the Last Updated dates only take up 30% of the table width*/
    .table-date {
        width: 30%;
        padding: 10 px;
        border-bottom: 1px solid #2f2f2f;
    }
    
    .table-row {
        border-bottom: 1px solid #2f2f2f;
        transition: background-color 0.3s ease;
    }

    tr.table-row:hover {
        background-color: lightgray;
    }

</style>