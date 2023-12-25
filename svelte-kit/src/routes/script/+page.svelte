<script lang="ts">
    import Script from "./Script.svelte";

    // TODO: Fix Sidebar not being pinned to the side when the text editor gets too long!

</script>

<div class="container">
    <Script />
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        flex: 0 0 100%;
        margin-left: 2.5%;
        margin-right: 2.5%;
    }
</style>