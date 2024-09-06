<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Firebase Firestore Stuff
	import type { User } from 'firebase/auth';
	import { auth, db } from '$lib/firebase/firebase.client';
	import {
		DocumentReference,
		DocumentSnapshot,
		Firestore,
		Timestamp,
		collection,
		doc,
		getDoc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';

	import { scriptIdStore, scriptMetaIdStore, scriptSaveStatus } from '$lib/stores/scriptStore';

	// Text Editor Imports
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
  import { BubbleMenu, createEditor, Editor, EditorContent } from 'svelte-tiptap';

	// Icon Imports
	import Fa from 'svelte-fa';
	import {
		faBold,
		faItalic,
		faUnderline,
		faUndo,
		faRedo,
		faList,
		faListOl,
		faSave
	} from '@fortawesome/free-solid-svg-icons';

	// Script Type Import
	import type { Script } from '$lib/index.ts';

	// To change the size of the toolbar icons
	let faIconSize = '1.5x';

	let element: any; // figure out this type later
	let editor: Readable<Editor>;
  let editorContainer: HTMLElement;

	let scriptTitle: string = ''; // the script's title

	let scriptLoaded = false; // updates whenever the script is done loading
	let timeoutId: number | undefined; // used for debouncing the title updates (saves on API calls)

	let currentUser: User | null;

	// TODO: You might be able to take advantage of floating menus for GPT features!
	// Use the floating menu to possibly suggest GPT features to the user on any new lines

	// NOTE: Extensions for TipTap can be added here
	// TODO: Add in highlight, strikethrough, font size, font color, font family,
	//       and bullet points and then stylize the buttons with the proper icons

	// TODO: Make the default text disappear as soon as the user starts typing

	async function getScriptContent(db: Firestore, collectionName: string, docId: string) {
		const docRef: DocumentReference = await doc(db, collectionName, docId);

        BubbleMenu
		try {
			const docSnap: DocumentSnapshot | null = await getDoc(docRef);
			if (docSnap.exists()) {
				return docSnap.data();
			} else {
				console.log('No such document!');
				return null;
			}
		} catch (error) {
			console.error('Error fetching document: ', error);
			return null;
		}
	}

	// Get's the HTML content that is currently in the script text editor
	async function extractScriptContent(editor: Editor) {
		let scriptContent: string = editor.getHTML();

		return scriptContent;
	}

	// Returns either true or false
	async function saveHTMLtoDatabase(
		scriptContent: string,
		collectionName: string,
		documentId: string
	) {
		if (documentId == null) {
			console.error('saveHTMLtoDatabase Error: There is no valid script ID to save this too');
			return false;
		}

		// Getting a reference to the document in the firestore database
		const docRef = doc(db, collectionName, documentId);

		// Holds the wheter or not a database update was successful or not
		let saveResult: boolean = false;

		// Updating the document with the new script content
		await updateDoc(docRef, {
			content: scriptContent
		})
			.then(() => {
				console.log('saveHTMLtoDatabase() Success: Document sucessfully updated');
				saveResult = true;
			})
			.catch((error) => {
				// TODO: Show some kind of pop up here if an error occurs
				console.error('saveHTMLtoDatabase() Error: Error updating document: ', error);
				saveResult = false;
			});

		return saveResult;
	}

	async function saveScript(editor: Editor, collectionName: string, documentId: string | null) {
		// Get's the script content
		if (documentId == null) {
			// TODO: Make this show a pop up error message in the UI
			console.error('saveScript() Error: There is no valid script ID to save this too');
			return false;
		}

		// Pull out the typed script data into a string
		const scriptContent: string = await extractScriptContent(editor);

		// Store the script string data to the database
		let result: boolean = await saveHTMLtoDatabase(scriptContent, 'textcontent', documentId);

		// Getting a reference to the document in the firestore database
		let metaDocRef: DocumentReference;
		let titleResult: boolean = false;

		// Handling updating the document's last updated time
		collectionName = 'documents';

		if ($scriptMetaIdStore) {
			metaDocRef = doc(db, collectionName, $scriptMetaIdStore);
		} else {
			// scriptMetaIdStore is null
			titleResult = false;
			return titleResult;
		}

		console.log('metaDocRef: ', metaDocRef);

		await updateDoc(metaDocRef, {
			updated: Timestamp.now()
		})
			.then(() => {
				console.log('saveScript() Success: Document last updated time sucessfully updated');
				titleResult = true;
			})
			.catch((error) => {
				// TODO: Show some kind of pop up here if an error occurs
				console.error('saveScript() Error: Error updating last updated time: ', error);
				titleResult = false;
			});

		// Error-checking
		if (result && titleResult) {
			// Everything went well!
			console.log('saveScript() Success: Everything went well!');
		} else {
			// Something broke
			console.error('saveScript() Error: Something went wrong... :(');
			console.log(result);
		}

		// Resets the save status and saves a script to the database
		$scriptSaveStatus = false;
	}

	// Used to change the title of the script everytime the value of it is changed
	async function updateScriptTitle(collectionName: string, value: string) {
		// Holds the wheter or not a database update was successful or not
		let saveResult: boolean = false;

		// Getting a reference to the document in the firestore database
		let docRef: DocumentReference;
		if ($scriptMetaIdStore) {
			docRef = doc(db, collectionName, $scriptMetaIdStore);
		} else {
			// scriptMetaIdStore is null
			saveResult = false;
			return saveResult;
		}

		await updateDoc(docRef, {
			doc_name: value,
			updated: Timestamp.now()
		})
			.then(() => {
				console.log('updateTitle() Success: Document sucessfully updated');
				saveResult = true;
			})
			.catch((error) => {
				// TODO: Show some kind of pop up here if an error occurs
				console.error('updateTitle() Error: Error updating document: ', error);
				saveResult = false;
			});

		return saveResult;
	}

	async function handleScriptTitleInput(event: Event & { currentTarget: HTMLInputElement }) {
		const target = event.target as HTMLInputElement; // safely casting the event target

		// Clear the previous timeout, if there's one
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}

		// Setting a new timeout to update the script title in the database
		timeoutId = setTimeout(() => {
			let collectionName: string = 'documents';
			updateScriptTitle(collectionName, target.value);
		}, 500) as unknown as number; // delay in milliseconds (plus assertions for TypeScript to stop yelling at me)
	}

  onMount(() => {
    editor = createEditor({
      extensions: [
        StarterKit,
        Underline,
      ],
      content: '',
      editorProps: {
        attributes: {
          class: 'border-2 border-black rounded-lg p-2 bg-[#d9d9d9] min-h-[85vh] max-h-[85vh] overflow-y-auto outline-none',
        },
      },
    });
  });
</script>

<!-- TODO: Add in a way to change font size (so you have titles) -->

<!-- Potential Future Buttons -->
<!-- Code Block, Quote Block, Horizontal Rule (just like a horizontal line) -->

<div class="flex flex-col justify-center items-center h-screen w-full p-4">
  <!-- Bubble Menu Stuff -->
  {#if editor}
    <BubbleMenu editor={$editor}>
      <div class="flex flex-row bg-red-500 text-[#d9d9d9]">
        <button>
          Test
        </button>
      </div>
    </BubbleMenu>
  {/if}

  <div class="flex flex-row p-2 text-white">
    <p>Toolbar Here!</p>
  </div>
  <div bind:this={editorContainer} class="w-[90%]">
    <EditorContent editor={$editor}/>
  </div>
</div>

<style>
</style>
