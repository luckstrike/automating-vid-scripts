<script lang="ts">
	import { auth } from '$lib/firebase/firebase.client';
	import { authHandlers, authStore } from '$lib/stores/authStore';
	import LoginReset from '$lib/LoginReset.svelte';
	import Dashboard from './Dashboard.svelte';

	// TODO: This should show up once you're logged in
	// and show all of your existing scripts!

	let userEmail: string | null;

	authStore.subscribe((curr: any) => {
		userEmail = curr?.currentUser?.email;
	});
</script>

<div>
	{#if $authStore.currentUser}
		<Dashboard />
	{:else if $authStore.isLoading}
		<!--TODO: Turn this into a loading screen, properly centered too... -->
		<h1>Loading...</h1>
	{:else}
		<h1>???</h1>
	{/if}
</div>
