<script lang="ts">
	import { onMount } from 'svelte';
	import { DocumentReference, doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase.client';

	import Script from '../Script.svelte';
</script>

<div class="w-full h-full">
	<Script />
</div>
