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
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';

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
	let editor: Editor;

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
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Underline],
			content: '',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onCreate({ editor }) {
				// Updating the content to the correct script
				// TODO: Add saving your doc (and a warning before leaving the script tab to save a document)
				//       Auto-saving would be cool but not sure how to do that
				if ($scriptIdStore) {
					getScriptContent(db, 'textcontent', $scriptIdStore).then((result) => {
						if (result) {
							editor.commands.setContent(result.content);
						}
					});
				}

				if ($scriptMetaIdStore) {
					getScriptContent(db, 'documents', $scriptMetaIdStore).then((result) => {
						if (result) {
							scriptTitle = result.doc_name;
						}
					});
				}
			},
			onUpdate({ editor }) {
				// Everytime something new is typed/updated, the save button becomes active
				$scriptSaveStatus = true;
			}
		});

		const unsubscribe = auth.onAuthStateChanged((user) => {});

		return unsubscribe;
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<!-- TODO: Add in a way to change font size (so you have titles) -->

<!-- Potential Future Buttons -->
<!-- Code Block, Quote Block, Horizontal Rule (just like a horizontal line) -->
<div class="flex flex-col h-screen w-full items-center">
	{#if editor}
		<div class="pt-2">
			<input
				class="bg-transparent text-center text-white font-bold text-xl border-solid border-2 border-white rounded-lg"
				type="text"
				bind:value={scriptTitle}
				on:input={handleScriptTitleInput}
			/>
		</div>
		<!-- Toolbar Section -->
		<div class="flex flex-row justify-center space-x-4 p-3">
			<!-- Save Button -->
			<button
				on:click={() => saveScript(editor, 'textcontent', $scriptIdStore)}
				class={$scriptSaveStatus ? 'updates' : 'no-updates'}
			>
				<Fa class="toolbar-icons" icon={faSave} />
			</button>
			<!-- Bold Button -->
			<button
				on:click={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class={editor.isActive('bold') ? 'is-active' : ''}
			>
				<Fa class="toolbar-icons" icon={faBold} />
			</button>

			<!-- Italic Button -->
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class={editor.isActive('italic') ? 'is-active' : ''}
			>
				<Fa class="toolbar-icons" icon={faItalic} />
			</button>

			<!-- Underline Button -->
			<button
				on:click={() => editor.chain().focus().toggleUnderline().run()}
				class={editor.isActive('underline') ? 'is-active' : ''}
			>
				<Fa class="toolbar-icons" icon={faUnderline} />
			</button>

			<!-- Undo Button -->
			<button
				on:click={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				<Fa class="toolbar-icons" icon={faUndo} />
			</button>

			<!-- Redo Button -->
			<button
				on:click={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
			>
				<Fa class="toolbar-icons" icon={faRedo} />
			</button>

			<!-- Bullet List Button -->
			<button
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				<Fa class="toolbar-icons" icon={faList} />
			</button>

			<!-- Ordered List Button -->
			<button
				on:click={() => editor.chain().focus().toggleOrderedList().run()}
				class={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				<Fa class="toolbar-icons" icon={faListOl} />
			</button>
		</div>
	{/if}
	<div class="flex-grow overflow-auto w-full">
		<div class="h-full w-full" bind:this={element} />
	</div>
</div>

<style>
	:global(.tiptap) {
		border: 1px solid black;
		border-radius: 10px;
		margin: auto;
		max-width: 80%;
		height: 98%;
		padding: 0.5em;
		color: white;
		overflow-y: auto;
	}

	:global(.tiptap:focus) {
		outline: none;
	}
</style>
