<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
    import Summarize from "./Summarize.svelte";
</script>

<div class="container">
    <Summarize />
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        flex: 0 0 100%;
    }
</style>