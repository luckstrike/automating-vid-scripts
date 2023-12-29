<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
	import Login from "$lib/Login.svelte";
	import { authStore } from "$lib/stores/authStore";
</script>

<div class="container">
    {#if !$authStore.isLoading && !$authStore.currentUser}
	    <Login />
    {/if}
</div>

<style>
	.container {
        display: flex;
        height: 100vh;
        flex: 0 0 100%;
    }
</style>