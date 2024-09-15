<script lang="ts">
  import Modal from "$lib/Modal.svelte";

  let summarize_url: string | null = null;

  let isGenerating: boolean = false;
  let errorMessage: string | null = null;

  const baseURL: string = import.meta.env.VITE_PUBLIC_BASE_URL || import.meta.env.PUBLIC_BASE_URL || '';
  const API_URL: string = `${baseURL}/api`;

  let showModal: boolean = false;
  let modalContent: string = "";

  // Set's showModal (the global variable) to false
  const closeModal = () => {
    showModal = false;
    modalContent = ""; // reset the content as well
  };

  async function handleGenerate(
    userProvidedURL?: string | null,
  ): Promise<void> {
    isGenerating = true;
    errorMessage = null;

    let summary: string | null = null;

    const endpoint = "/summarize"; // Simplified endpoint, always using POST
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: userProvidedURL || "" }),
    };

    // Fetching the result + error handling
    try {
      const res = await fetch(API_URL + endpoint, options);

      // Create a cool pop up window
      showModal = true;

      if (res.ok) {
        const gptResult = await res.json();
        summary = gptResult.summary;

        if (summary != null) {
          modalContent = summary;
        } else {
          modalContent = `Uh oh, seems like there was an issue with getting a summary.
                                    It seems like the website either doesn't allow scraping
                                    or was unable to scrape the website. Please try another link
                                    or try again.`;
        }
      } else {
        errorMessage = `Server error: ${res.status}`;

        modalContent = `Uh oh, seems like there was an issue with getting a summary.`;
      }
    } catch (err) {
      errorMessage = `Network error: ${(err as Error).message}`;

      modalContent = `Uh oh, seems like there was an issue with getting a summary.
                                Either the website does not allow for scraping or something
                                went wrong. Try again later or try a different link.`;
    }

    isGenerating = false;
  }
</script>

<div class="flex flex-col w-full h-screen">
  <div
    class="flex flex-col flex-grow space-y-3 items-center align-middle justify-center"
  >
    <p class="text-lg text-white">
      Please provide the URL of the website you would like to summarize:
    </p>
    <input
      id="summarize-url-input"
      type="text"
      placeholder="Enter URL here..."
      bind:value={summarize_url}
    />
    <!-- Why the -mt-3? Since I'm using space-y-3 this causes that to also be applied to the 
        overlay, so adding this in fixes the issue some-->

    <button
      class="p-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 rounded-lg text-white"
      disabled={!summarize_url || isGenerating}
      on:click={() => handleGenerate(summarize_url)}
    >
      Summarize
    </button>
  </div>

  <Modal show={showModal} onClose={closeModal} content={modalContent}>
    <h1>Here's what we got back:</h1>
  </Modal>
</div>

<style>
  #summarize-url-input {
    width: 50%;
    height: 40px;
    font-size: 18px;
    box-sizing: border-box;
    border-radius: 10px;
    border: none;
    padding: 0px 10px 0px 10px;
  }
</style>
