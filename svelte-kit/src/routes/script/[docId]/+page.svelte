<script lang="ts">
	import { onMount } from "svelte";
    import { DocumentReference, doc, getDoc} from 'firebase/firestore';
    import { db } from '$lib/firebase/firebase.client';

    import Script from "../Script.svelte";

    // Holds the document id for the script
    export let data;

    // Will hold the Script's text content
    export let textContent: string;

    // Holds the collection name in which text document data is stored in
    let collectionName: string = 'textcontent';

    onMount(() => {
        const docRef = doc(db, collectionName, data.docId)

        getDocumentData(docRef).catch(error => {
            let errorMessage = "Failed to fetch document."; // Set user-facing error message
            console.log(errorMessage)
        });
    });

    // TODO: Potentially make this use a store instead in the future
    // Maybe that way it can always load the previously used script
    // after it was launched once
    // although I would probably need to update it many times every
    // time the use updates stuff (which seems excessive tbh)
    async function getDocumentData(docRef: DocumentReference) {
        try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            textContent = docSnap.data().content;
            // documentData.set(docSnap.data()) // or something like that?
        } else {
            console.log("No such document!");
            // documentData.set(null) // or something like that?
        }
        } catch (error) {
            console.error("Error fetching document: ", error);
            // documentData.set(null) // or something like that?
        }
    }

</script>

<div class="container">
    <Script content={textContent}/>
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        flex: 0 0 100%;
        margin-left: 2.5%;
        margin-right: 2.5%;
    }
</style>