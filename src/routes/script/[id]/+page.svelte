<script lang="ts">
  import TextEditor from "../TextEditor.svelte";

  export let data;
</script>

<div class="w-full h-full">
  <TextEditor {data} />
</div>
