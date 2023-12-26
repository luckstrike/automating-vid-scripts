<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
	import Login from "$lib/Login.svelte";
</script>

<div class="container">
	<Login />
</div>

<style>
	.container {
        display: flex;
        height: 100vh;
        flex: 0 0 100%;
    }
</style>