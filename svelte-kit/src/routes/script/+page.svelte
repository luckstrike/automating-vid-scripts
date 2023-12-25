<script lang="ts">
	import Sidebar from "$lib/Sidebar.svelte";
    import Script from "./Script.svelte";
</script>

<div class="container">
    <Sidebar />
    <div class="text-editor">
        <Script />
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }

    .text-editor {
        flex: 1 1 auto;
    }

</style>