<script lang="ts">
	import { onMount } from "svelte";
    import { DocumentReference, doc, getDoc} from 'firebase/firestore';
    import { db } from '$lib/firebase/firebase.client';

    import Script from "../Script.svelte";
</script>

<div class="container">
    <Script/>
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