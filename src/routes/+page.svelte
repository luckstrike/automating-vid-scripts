<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import Login from '$lib/Login.svelte';
	import { authStore } from '$lib/stores/authStore';
</script>

<div class="flex h-screen w-screen">
	{#if !$authStore.isLoading && !$authStore.currentUser}
		<Login />
	{/if}
</div>
