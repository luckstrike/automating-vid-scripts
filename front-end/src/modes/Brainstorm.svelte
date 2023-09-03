<script lang="ts">
    let brainstorm_text = "";

    function handleGenerate() {
        // TODO: Call on the GPT back-end to generate a random idea
        console.log("Generating user provided idea...")
    }

    function handleGenerateRandomIdea() {
        console.log("Generating random idea...");
    }
</script>

<div class="idea-generation-section">
    <!--Creating a textbox with placeholder text for brainstorming ideas-->
    <input
        type="text"
        placeholder="or try generating a random idea..."
        bind:value={brainstorm_text}
    />

    <!--Creates a space between the input textbox and the buttons-->
    <br/>
    
    <button on:click={() => handleGenerate()}>Generate</button>
    <button on:click={() => handleGenerateRandomIdea()}>Generate Random Idea</button>
</div>