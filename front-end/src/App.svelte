<script lang="ts">
    import Sidebar from './Sidebar.svelte';

    // NOTE: A potential future change?
    // Maybe I should keep all text boxes with data in memory?
    // Instead of thewm just being erased when the user switches modes
</script>

<div class="background">
    <Sidebar />
</div>

<style>
    .background {
        background-color: #2f2f2f;
        height: 100vh;
        margin: 0;
        padding: 0;
    }
</style>