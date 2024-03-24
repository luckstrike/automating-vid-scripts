<script lang="ts">
  import TextEditor from "./TextEditor.svelte";

  export let content: string;
</script>

<div class="script">
    <TextEditor content={content}/>
</div>

<style>
    .script {
        display: flex;
        flex-direction: column;
        flex: 0 0 80%;
    }
</style>