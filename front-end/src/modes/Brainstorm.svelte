<script lang="ts">
    let brainstorm_text: string = "";
    let isLoading: boolean = false;

    const API_URL: string = ""; // should be the API URL for the GPT back-end

    async function handleGenerate(userPrompt: string): Promise<void> {
        // TODO: Call on the GPT back-end to generate the provided idea

        let response: string = "";
        let error: string | null = null;

        isLoading = true;

        // Handles the fetch request
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: userPrompt })
            });

            // Everything went well
            if (res.ok) {
                const data = await res.json();
                response = data.response;

                // TODO: Create a new script with the video idea

            } else {
                // TODO: Show an error message to the user
                // Handle HTTP errors
                error = `Server responded with status: ${res.status}`;
            }
        } catch (err) {
            // TODO: Show an error message to the user
            // Handle network errors
            error = `Fetch failed: ${(err as Error).message}`;
        } finally {
            isLoading = false;
        }
    }

    function handleGenerateRandomIdea() {
        // TODO: Call on the GPT back-end to generate a random idea
        console.log("Generating random idea...");
    }
</script>

<div class="idea-generation-section">
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
            disabled={brainstorm_text == "" || isLoading}
        >
        {#if isLoading}
            Generating Idea...
        {:else}
            Generate Idea
        {/if}
    </button>
        <button 
            class="idea-buttons"
            on:click={() => handleGenerateRandomIdea()}
            disabled={brainstorm_text !== ""}
        >
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
        color: white;
        font-size: 18px;
        font-weight: bold;
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