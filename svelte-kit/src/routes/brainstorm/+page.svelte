<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
    import Brainstorm from "./Brainstorm.svelte";
</script>

<div class="container">
    <Sidebar />
    <Brainstorm />
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>