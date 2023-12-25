<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
    import Summarize from "./Summarize.svelte";
</script>

<div class="container">
    <Sidebar />
    <Summarize />
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>