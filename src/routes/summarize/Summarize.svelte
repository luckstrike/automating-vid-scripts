<script lang="ts">
  import Modal from "$lib/Modal.svelte";
  import { enhance } from "$app/forms";

  let summarize_url: string | null = null;

  let isGenerating: boolean = false;
  let errorMessage: string | null = null;

  const baseURL: string =
    import.meta.env.VITE_PUBLIC_BASE_URL ||
    import.meta.env.PUBLIC_BASE_URL ||
    "";
  const API_URL: string = `${baseURL}/api`;

  let showModal: boolean = true;
  let modalTitle: string = "Here's a Summary:";
  let modalContent: string = "";

  // Set's showModal (the global variable) to false
  const closeModal = () => {
    showModal = false;
    modalContent = ""; // reset the content as well
  };

  const handleSubmit = async ({ action, cancel }) => {
    if (!summarize_url) {
      cancel();
      return;
    }

    isGenerating = true;
    return async ({ result }) => {
      if (result.type === "success") {
        showModal = true;
        modalContent = result.data.summary;
      } else {
        errorMessage = "Failed to generate summary";
        modalContent = "An error occurred while generating the summary";
      }
      isGenerating = false;
    };
  };
</script>

<div class="flex flex-col text-white w-full h-screen">
  <div
    class="flex flex-col flex-grow space-y-3 items-center align-middle justify-center"
  >
    <div class="text-center text-2xl font-bold">Ready to summarize a page?</div>
    <p class="text-center text-lg">
      Please provide the URL of the website you would like to summarize:
    </p>
    <form
      method="POST"
      action="?/generateSummary"
      use:enhance={handleSubmit}
      class="w-3/4 flex flex-col items-center space-y-3"
    >
      <input
        name="url"
        class="text-black w-full rounded-xl p-2 box-border border-none font-xl"
        type="text"
        placeholder="Enter URL here..."
        bind:value={summarize_url}
      />
      <!-- Why the -mt-3? Since I'm using space-y-3 this causes that to also be applied to the 
        overlay, so adding this in fixes the issue some-->
      <button
        type="submit"
        class="p-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 rounded-lg text-white"
        disabled={!summarize_url || isGenerating}
      >
        Summarize
      </button>
    </form>
  </div>

  <Modal
    show={showModal}
    onClose={closeModal}
    title={modalTitle}
    content={modalContent}
  />
</div>
