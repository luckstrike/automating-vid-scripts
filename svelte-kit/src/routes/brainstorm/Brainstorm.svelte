<script lang="ts">
	import { createScript } from "$lib/scriptFunctions/scriptFunctions";
	import { authStore } from "$lib/stores/authStore";

    let brainstorm_text: string = "";
    let isGenerating: boolean = false;
    let errorMessage: string | null = null;

    const tempAddr: string = "localhost:5173"
    const API_URL: string = `http://${tempAddr}/api`;

    async function handleGenerate(userPrompt?: string): Promise<void> {
        isGenerating = true;
        errorMessage = null;

        let userContent: string | null = null;
        let userTitle: string | null = null;

        const endpoint = "/gpt";  // Simplified endpoint, always using POST
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt || "" })
        };

        // Fetching the result + error handling
        try {
            const res = await fetch(API_URL + endpoint, options);
            if (res.ok) {
                const gptResult = await res.json();
                userContent = gptResult.scriptContent;
                userTitle = gptResult.scriptTitle;
            } else {
                errorMessage = `Server error: ${res.status}`;
            }
        } catch (err) {
            errorMessage = `Network error: ${(err as Error).message}`;
        } finally {
            isGenerating = false;
            if (userContent && userTitle) {
                createScript($authStore.currentUser?.uid, userContent, userTitle)
            }
        }
    }


</script>


<div class="container">
    <!--Creating a textbox with placeholder text for brainstorming ideas-->
    <p>Do you have a topic that you want to make a video about? Provide it here:</p>
    <input id="idea-generation-input"
        type="text"
        placeholder="or try generating a random idea..."
        bind:value={brainstorm_text}
    />

    <!--Creates a space between the input textbox and the buttons-->
    <br/>
    
    <div class="button-container">
        <button 
            class="idea-buttons" 
            on:click={() => handleGenerate(brainstorm_text)}
            disabled={brainstorm_text == "" || isGenerating}
        >
            {#if isGenerating && brainstorm_text != ""}
                Generating Idea...
            {:else}
                Generate Idea
            {/if}
    </button>
        <button 
            class="idea-buttons"
            on:click={() =>  handleGenerate()}
            disabled={brainstorm_text !== ""}
        >
            {#if isGenerating && brainstorm_text == ""}
                Generating Random Idea...
            {:else}
                Generate Random Idea
            {/if}
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

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: white;
        font-size: 18px;
        font-weight: bold;
        flex: 0 0 85%;
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