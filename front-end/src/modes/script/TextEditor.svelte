<script lang = "ts">
    import Quill from "quill";

    // This currently shows a split second of some loading triangle thingy
    // TODO: Fix this
    function quill(node) {
        new Quill(node, {
				modules: {
					toolbar: [
						[{ header: [1, 2, 3, false] }],
						["bold", "italic", "underline", "strike"],
						["link", "code-block"]
					]
				},
				placeholder: "Type something...",
				theme: "snow" // or 'bubble'
			});
    }

    /// asdjkasdj
</script>

<svelte:head>
    <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
</svelte:head>

<div class="text-editor">
    <div class="editor" use:quill />
</div>

<style>
    .text-editor {
        margin-top: 5vh;
    }

    .editor {
        height: 85vh;
        overflow-y: hidden;
    }
</style>