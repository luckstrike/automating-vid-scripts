<script lang="ts">
    import Script from "./Script.svelte";

    export let data;
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