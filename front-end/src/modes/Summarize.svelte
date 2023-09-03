<script lang="ts">
    let summarize_url = "";
    let selectedOption: string;
</script>

<div class="summarize-section">
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
    </div>

</div>

<style>
    .summarize-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
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