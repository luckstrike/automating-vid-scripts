<script lang="ts">
	import { createScript } from '$lib/scriptFunctions/scriptFunctions';
	import { authStore } from '$lib/stores/authStore';

	let brainstorm_text: string = '';
	let isGenerating: boolean = false;
	let errorMessage: string | null = null;


  const baseURL: string = import.meta.env.VITE_PUBLIC_BASE_URL || import.meta.env.PUBLIC_BASE_URL || '';
	const API_URL: string = `${baseURL}/api`;

	async function handleGenerate(userPrompt?: string): Promise<void> {
		isGenerating = true;
		errorMessage = null;

		let userContent: string | null = null;
		let userTitle: string | null = null;

		const endpoint = '/brainstorm'; // Simplified endpoint, always using POST
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: userPrompt || '' })
		};

		// Fetching the result + error handling
		try {
			const res = await fetch(API_URL + endpoint, options);
			if (res.ok) {
				const gptResult = await res.json();
				userContent = gptResult.scriptContent;
				userTitle = gptResult.scriptTitle;
			} else {
				errorMessage = `Server error: ${res.status}`;
			}
		} catch (err) {
			errorMessage = `Network error: ${(err as Error).message}`;
		} finally {
			isGenerating = false;
			if (userContent && userTitle) {
				createScript($authStore.currentUser?.uid, userContent, userTitle);
			}
		}
	}
</script>

<div class="flex flex-col flex-grow items-center justify-center h-screen text-white">
	<!--Creating a textbox with placeholder text for brainstorming ideas-->
	<div class="text-4xl font-bold py-4">Kickstart your writing process!</div>
	<div class="text-lg">
		Do you have a topic that you want to make a video about? Provide it here:
	</div>
	<input
		class="w-1/2 h-10 rounded-lg px-2 text-black"
		type="text"
		placeholder="or try generating a random idea..."
		bind:value={brainstorm_text}
	/>

	<div class="flex flex-row p-2 space-x-2">
		<button
			class="h-10 px-2 rounded-lg bg-blue-600"
			on:click={() => handleGenerate(brainstorm_text)}
			disabled={brainstorm_text == '' || isGenerating}
		>
			{#if isGenerating && brainstorm_text != ''}
				Generating Idea...
			{:else}
				Generate Idea
			{/if}
		</button>
		<button
			class="h-10 px-2 rounded-lg bg-blue-600"
			on:click={() => handleGenerate()}
			disabled={brainstorm_text !== ''}
		>
			{#if isGenerating && brainstorm_text == ''}
				Generating Random Idea...
			{:else}
				Generate Random Idea
			{/if}
		</button>
	</div>
</div>

<style>
	button[disabled] {
		background-color: grey;
		color: #d9d9d9;
		cursor: not-allowed;
	}

	button:not([disabled]):hover {
		background-color: #005fa3;
	}
</style>
