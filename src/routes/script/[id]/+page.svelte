<script lang="ts">
  import TextEditor from "../TextEditor.svelte";
  import { scriptIdStore } from "$lib/stores/scriptStore";

  export let data;

  $: if (data.script) {
    $scriptIdStore = data.script.id;
  }
</script>

<div class="w-full h-full">
  <TextEditor {data} />
</div>
