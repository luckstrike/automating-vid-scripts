<script lang="ts">
	import { onMount } from "svelte";
    import { DocumentReference, doc, getDoc} from 'firebase/firestore';
    import { db } from '$lib/firebase/firebase.client';

    import Script from "../Script.svelte";

    // Holds the document id for the script
    export let data;

    console.log("data!:", data)

    // Holds the collection name in which text document data is stored in
    let collectionName: any = 'textcontent';

    onMount(() => {
        const docRef = doc(db, collectionName, data.docId)

        getDocumentData(docRef).catch(error => {
            let errorMessage = "Failed to fetch document."; // Set user-facing error message
            console.log(errorMessage)
        });
    });


    async function getDocumentData(docRef: DocumentReference) {
        try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data().content)
        } else {
            console.log("No such document!");
        }
        } catch (error) {
            console.error("Error fetching document: ", error);
        }
    }

</script>

<div class="container">
    <Script docId={data}/>
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