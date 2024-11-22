<script lang="ts">
  import TextEditor from "../TextEditor.svelte";

  export let data;

  console.log(data);
</script>

<div class="w-full h-full">
  <TextEditor {data} />
</div>
