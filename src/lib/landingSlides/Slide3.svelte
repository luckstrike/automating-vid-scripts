<script lang="ts">
</script>

<div
  class="flex flex-col flex-grow overflow-y-auto lg:flex-row lg:w-full min-h-screen justify-center space-y-8 lg:space-y-0 items-center p-4"
>
  <div class="lg:max-w-[30%]">
    <div
      class="text-center text-6xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
    >
      Long article you wanna use? Easy*
    </div>
    <div class="text-center text-white text-sm">
      *In cases where the site allows for web scraping
    </div>
  </div>
  <div
    class="flex flex-col lg:max-w-[45%] text-white items-center align-middle justify-center"
  >
    <div class="text-center text-4xl font-bold">Ready to summarize a page?</div>
    <p class="text-lg">
      Please provide the URL of the website you would like to summarize:
    </p>
    <input
      class="text-black w-full rounded-xl p-2 box-border border-none font-xl"
      type="text"
      placeholder="Enter URL here..."
    />

    <button
      class="p-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 rounded-lg text-white"
    >
      Summarize
    </button>
  </div>
</div>
