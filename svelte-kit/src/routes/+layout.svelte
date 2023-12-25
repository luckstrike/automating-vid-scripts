<script lang="ts">
    import Sidebar from "$lib/Sidebar.svelte";
    import '../global.css';
</script>

<div class="container">
    <Sidebar />
    <slot />
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>