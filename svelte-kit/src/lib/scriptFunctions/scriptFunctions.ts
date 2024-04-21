import { getFirestore, collection, addDoc, DocumentReference, Timestamp } from 'firebase/firestore';
import { type TextContent, type ScriptMetaData, textContentConverter, scriptMetaDataConverter } from '$lib/index.ts'
import { scriptIdStore, scriptMetaIdStore } from '$lib/stores/scriptStore';
import { goto } from '$app/navigation';
import { auth, db } from '$lib/firebase/firebase.client';

// TODO: Move all common script related database functions here
export async function createScript(currentUserUid?: string, userContent: string = "", userTitle: string = "Untitled Document"): Promise<void> {
    if (!currentUserUid) {
        console.error("No user UID found");
        return;
    }

    console.log(currentUserUid)

    let contentCollection: string = "textcontent";
    let scriptMetaInfoCollection: string = "documents";

    try {
        // Create the textContent document to hold the script's text content
        const contentDocRef: DocumentReference<TextContent> = await addDoc(collection(db, contentCollection).withConverter(textContentConverter), {
            content: userContent,
            uid: currentUserUid
        });

        // Create the document that holds the script's meta data info and a reference to the script's content data
        const metaDataDocRef: DocumentReference<ScriptMetaData> = await addDoc(collection(db, scriptMetaInfoCollection).withConverter(scriptMetaDataConverter), {
            content: contentDocRef, // Reference to the previously made textContent document
            created: Timestamp.now(),
            doc_name: userTitle,
            uid: currentUserUid,
            updated: Timestamp.now()
        });

        console.log("Document written with ID: ", metaDataDocRef.id);

        // Update the store to reference the newly created script
        scriptIdStore.set(contentDocRef.id);
        scriptMetaIdStore.set(metaDataDocRef.id);

        goto(`/script/${contentDocRef.id}`);
    } catch (e) {
        console.error("Error creating documents:", e);
    }
}