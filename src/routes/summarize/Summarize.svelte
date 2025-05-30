<script lang="ts">
  import Modal from "$lib/Modal.svelte";
  import { enhance } from "$app/forms";
  import debounce from "lodash/debounce";

  let summarize_url: string | null = null;
  let summarizable: string = "No URL provided";
  let summarizableBool: boolean = false;
  let summaryOption: string | null = null;

  let isGenerating: boolean = false;
  let errorMessage: string | null = null;

  const baseURL: string =
    import.meta.env.VITE_PUBLIC_BASE_URL ||
    import.meta.env.PUBLIC_BASE_URL ||
    "";
  const API_URL: string = `${baseURL}/api`;

  let showModal: boolean = false;
  let modalTitle: string = "Here's a Summary:";
  let modalContent: string = "";

  type BulletPointResponse = {
    summary: {
      bullet_points: Array<{
        point: string;
        order: number;
      }>;
      metadata: {
        total_points: number;
        source_text_length: number;
      };
    };
  };

  // Set's showModal (the global variable) to false
  const closeModal = () => {
    showModal = false;
    modalContent = ""; // reset the content as well
  };

  function parseBulletPoints(bulletPoints: BulletPointResponse) {
    const points = bulletPoints
      .sort((a, b) => a.order - b.order)
      .map((point) => `• ${point.point}`)
      .join("\n");

    return points;
  }

  const handleSubmit = async ({ action, cancel }) => {
    if (!summarize_url || !summaryOption) {
      cancel();
      return;
    }

    isGenerating = true;
    return async ({ result }) => {
      if (result.type === "success") {
        showModal = true;

        if (result.data.summary.bullet_points) {
          const bulletPoints: BulletPointResponse =
            result.data.summary.bullet_points;
          const bulletPointsString = parseBulletPoints(bulletPoints);

          modalContent = bulletPointsString;
        } else if (result.data.summary) {
          modalContent = result.data.summary;
        }
      } else if (result.type === "failure") {
        errorMessage = "Failed to generate a summary";
        modalContent = "An error occurred while generating the summary";
      }
      isGenerating = false;
    };
  };

  const validateURL = debounce(async (value: string | null) => {
    if (!value) {
      summarizable = "No URL provided";
      return false;
    }

    try {
      new URL(value);

      const response = await fetch("/api/check-robots", {
        method: "POST",
        body: JSON.stringify({ url: value }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success === true && data.isAllowed) {
        summarizable = "Yes";
        summarizableBool = true;
        return true;
      } else if (data.success === false) {
        summarizable = "Invalid URL";
        summarizableBool = false;
      } else {
        summarizable = "No";
        summarizableBool = false;
      }
    } catch {
      summarizable = "Invalid URL";
      summarizableBool = false;
      return false;
    }
  }, 300);
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
      class="w-2/3 flex flex-col items-center space-y-3"
    >
      <input
        name="url"
        class="text-black w-full rounded-xl p-2 box-border border-none font-xl"
        type="text"
        placeholder="Enter URL here..."
        bind:value={summarize_url}
        on:input={() => validateURL(summarize_url)}
      />
      <div class="font-bold text-lg">
        Can this URL be summarized? <span
          class={`
          ${summarizable === "Yes" ? "text-green-500" : ""}
          ${summarizable === "No" ? "text-red-500" : ""}
          ${summarizable === "Invalid URL" ? "text-yellow-500" : ""}
          ${summarizable === "No URL provided" ? "text-gray-400" : ""}
        `}
        >
          {summarizable}
        </span>
      </div>
      <div class="flex flex-col">
        <div>
          <label class="cursor-pointer">
            <input
              type="radio"
              id="detailed"
              name="summary"
              value="detailed"
              bind:group={summaryOption}
            />
            Detailed Summary
          </label>
        </div>
        <div>
          <label class="cursor-pointer">
            <input
              type="radio"
              id="bullet"
              name="summary"
              value="bullet"
              bind:group={summaryOption}
            />
            Bullet Points
          </label>
        </div>
      </div>
      <button
        type="submit"
        class="p-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 rounded-lg text-white"
        disabled={!summarize_url || isGenerating || !summarizableBool}
      >
        {isGenerating ? "Summarizing..." : "Summarize"}
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
