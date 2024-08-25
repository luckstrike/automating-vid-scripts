<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authHandlers } from './stores/authStore';
	import { scriptMetaIdStore, scriptSaveStatus } from './stores/scriptStore';
	import { get } from 'svelte/store';

	function activateLink(index: number, event: MouseEvent) {
		const status = get(scriptSaveStatus);

		if (
			!status ||
			confirm(
				'You have unsaved script changes that will be lost upon leaving this page. Are you sure you want to exit this tab?'
			)
		) {
			const path = links[index].anchor;

			goto(path);
		} else {
			// Prevent's the default event of going to a link from happening
			event.preventDefault();

			// Stops the event from propagating further
			event.stopPropagation();
		}

		links = links.map((link, i) => ({
			...link,
			isActive: i === index
		}));
	}

	// Creating the elements for the sidebar
	let links = [
		{ name: 'Dashboard', color: '#FFD700', anchor: '/dashboard', isActive: false },
		{ name: 'Brainstorm', color: '#990000', anchor: '/brainstorm', isActive: false },
		{ name: 'Script', color: '#107500', anchor: '/script', isActive: false },
		{ name: 'Summarize', color: '#003d75', anchor: '/summarize', isActive: false },
		{ name: 'Log Out', color: '#ffffff', anchor: '/', isActive: false }
	];

	// Activating the link that was clicked
	$: {
		const currentAnchor = $page.url.pathname;
		links = links.map((link) => ({
			...link,
			isActive: currentAnchor === link.anchor
		}));
	}
</script>

<div class="h-screen bg-gray-900 overflow-x-hidden flex-none w-1/6 font-sans">
	<!-- Creating the sidebar elements with Svelte -->
	<!-- Use link.anchors here -->
	{#each links as link, index}
		{#if link.name === 'Log Out'}
			<!-- If the link is the logging out block -->
			<a
				href={link.anchor}
				data-index={index}
				class="block py-5 px-2 text-xl text-gray-100 text-center transition-all duration-300 ease-in-out hover:font-bold hover:bg-gray-800 relative group {link.isActive
					? 'bg-gray-800'
					: ''}"
				on:click={() => authHandlers.logout()}
			>
				{link.name}
				<div
					class="absolute top-0 right-0 w-2.5 h-full {link.color} opacity-0 group-hover:opacity-100 {link.isActive
						? 'opacity-100'
						: ''} transition-opacity duration-300"
				></div>
			</a>
		{:else if link.name == 'Script' && (!$scriptMetaIdStore || !$scriptMetaIdStore)}
			<!-- Don't render anything, as there is no active script here to load -->
		{:else}
			<a
				href={link.anchor}
				data-index={index}
				class="block py-5 px-2 text-xl text-gray-100 text-center transition-all duration-300 ease-in-out hover:font-bold hover:bg-gray-800 relative group {link.isActive
					? 'bg-gray-800'
					: ''}"
				on:click|preventDefault={(event) => activateLink(index, event)}
			>
				{link.name}
				<div
					class="absolute top-0 right-0 w-2.5 h-full {link.color} opacity-0 group-hover:opacity-100 {link.isActive
						? 'opacity-100'
						: ''} transition-opacity duration-300"
				></div>
			</a>
		{/if}
	{/each}
</div>

