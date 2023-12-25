<script lang="ts">
    let summarize_url:string | null = null;
    let selectedOption:string | null = null;

    function handleSummarize(selectedOption: string | null, summarize_url: string | null) {
        // Change this to actual logic later
        if (selectedOption == "detailed-summary") {
            console.log("Summarizing with detailed summary...")
        } else if ("bullet-points") {
            console.log("Summarizing with bullet points...")
        } else {
            console.log("Something went wrong...")
        }
    }

</script>

<div class="container">
    <p>Please provide the URL of the website you would like to summarize:</p>
    <input id="summarize-url-input"
        type="text" 
        placeholder="Enter URL here..."
        bind:value={summarize_url}
    />
    <p>How would you like the summary to be provided?</p>
    <div class="radio-buttons">
        <div class="radio-option">
            <input type="radio" id="detailed-summary" name="options" value="detailed-summary" checked bind:group={selectedOption}>
            <label for="detailed-summary">Detailed Summary</label>
        </div>

        <div class="radio-option">
            <input type="radio" id="bullet-points" name="options" value="bullet-points" bind:group={selectedOption}>
            <label for="bullet-points">Bullet Points</label>
        </div>

        <button 
            id="start-summary" 
            disabled={!(selectedOption && summarize_url)}
            on:click={() => handleSummarize(selectedOption, summarize_url)}
            >
            Summarize
        </button>
    </div>

</div>

<style>
    #start-summary[disabled] {
        background-color: grey;
        color: #d9d9d9;
        cursor: not-allowed;
    }

    #start-summary {
        height: 40px;
        font-size: 18px;
        border-radius: 10px;
        border: none;
        background-color: #005fa3;
        color: #ffffff;
        cursor: pointer;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
        flex: 0 0 85%;
    }

    .radio-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-weight: 100;
        font-size: 16px;
        border: none;
    }

    .radio-option {
        display: flex;
        align-items: center;  /* To align items vertically centered */
        gap: 8px;             /* Gap between radio and label */
    }

    #summarize-url-input {
        width: 50%;
        height: 40px;
        font-size: 18px;
        box-sizing: border-box;
        border-radius: 10px;
        border: none;
        padding: 0px 10px 0px 10px
    }

</style>