<script lang="ts">
    let brainstorm_text = "";

    function handleGenerate() {
        // TODO: Call on the GPT back-end to generate the provided idea
        console.log("Generating user provided idea...")
    }

    function handleGenerateRandomIdea() {
        // TODO: Call on the GPT back-end to generate a random idea
        console.log("Generating random idea...");
    }
</script>

<div class="idea-generation-section">
    <!--Creating a textbox with placeholder text for brainstorming ideas-->
    <input id="idea-generation-input"
        type="text"
        placeholder="or try generating a random idea..."
        bind:value={brainstorm_text}
    />

    <!--Creates a space between the input textbox and the buttons-->
    <br/>
    
    <div class="button-container">
        <button class="idea-buttons" on:click={() => handleGenerate()}>Generate Idea</button>
        <button 
            class="idea-buttons"
            on:click={() => handleGenerateRandomIdea()}
            disabled={brainstorm_text !== ""}>
            Generate Random Idea
        </button>
    </div>
</div>

<style>
    button[disabled] {
        background-color: grey;
        color: #d9d9d9;
        cursor: not-allowed;
    }

    button:not([disabled]):hover {
        background-color: #005fa3;
    }

    .idea-generation-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    #idea-generation-input {
        width: 50%;
        height: 40px;
        font-size: 18px;
        box-sizing: border-box;
        border-radius: 10px;
        border: none;
        padding: 0px 10px 0px 10px
    }

    .idea-buttons {
        height: 40px;
        padding: 10px;
        font-size: 18px;
        border-radius: 10px;
        border: none;
        margin: 0px 10px 0px 10px;
        padding: 0px 10px 0px 10px;
        background-color: #0076cb;
        color: #ffffff;
        font-weight: 550;
    }

</style>