<script lang="ts">
  import EmojioneMonotoneLeftArrow from "~icons/emojione-monotone/left-arrow";
  import EmojioneMonotoneRightArrow from "~icons/emojione-monotone/right-arrow";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";

  // Used to determine which "slide" to show the user
  let slide: number = 0;
  let maxSlides: number = 3; // maximum amount of slides
</script>

<div class="flex flex-col w-screen h-screen p-2">
  <div class="flex flex-row space-x-4 justify-end items-center p-2 text-white">
    <button on:click={() => goto("/")}>
      Home
    </button>
    <button
      class="bg-blue-600 rounded-lg pt-2 pb-2 pl-4 pr-4 font-semibold"
      on:click={() => goto("/login")}
    >
      Login
    </button>
  </div>
  <div
    class="flex flex-row flex-grow items-center justify-between pl-4 pr-4 overflow-y-hidden"
  >
    <button on:click={() => slide = (slide - 1) % maxSlides}>
      <EmojioneMonotoneLeftArrow class="text-4xl text-blue-600" />
    </button>

    {#if slide == 0}
      <div
        class="flex flex-row w-screen h-full justify-center items-center space-x-8"
      >
        <div
          class="max-w-[30%] text-7xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
        >
          Write your video scripts with a helping hand
        </div>
        <div
          class="w-[50%] h-[100%] flex flex-col bg-[#d9d9d9] rounded-lg translate-y-[15%] hover:translate-y-[12%] transition duration-300 ease-in-out p-8"
        >
          <div class="font-bold text-3xl">The Generational Ford Mustang</div>
          <br />
          <br />
          <div class="text-3xl select-all">
            The Ford Mustang has been around the block for a long time. In fact
            it’s gone through a lot of generations throughout it’s existence.
          </div>
        </div>
      </div>
    {/if}

    {#if Math.abs(slide) == 1}
      <div class="flex flex-row w-screen h-full justify-center items-center space-x-4">
        <div
          class="max-w-[30%] text-7xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
        >
          Writer's block? No Problem
        </div>
        <div class="flex flex-col max-w-[45%] items-center align-middle justify-center text-white p-4">
          <!--Creating a textbox with placeholder text for brainstorming ideas-->
          <div class="text-4xl font-bold py-4">Kickstart your writing process!</div>
          <div class="text-lg">
            Do you have a topic that you want to make a video about? Provide it here:
          </div>
          <input
            class="w-full h-10 rounded-lg px-2 text-black"
            type="text"
            placeholder="or try generating a random idea..."
          />

          <div class="flex flex-row p-2 space-x-2">
            <button
              class="h-10 px-2 rounded-lg bg-blue-600"
            >
              Generate Idea
            </button>
            <button
              class="h-10 px-2 rounded-lg bg-blue-600"
            >
              Generate Random Idea
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if Math.abs(slide) == 2}
      <div class="flex flex-row w-screen h-full justify-center items-center">
        <div class="max-w-[30%]">
          <div
            class="text-7xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
          >
            Long article you wanna use? Easy*
          </div>
          <div class="text-white">
            *In cases where the site allows for web scraping
          </div>
        </div>
        <div
          class="flex flex-col max-w-[45%] text-white space-y-3 items-center align-middle justify-center"
        >
          <div class="text-4xl font-bold">
            Ready to summarize a page?
          </div>
          <p class="text-lg">
            Please provide the URL of the website you would like to summarize:
          </p>
          <input
            class="text-black w-full rounded-xl p-2 box-border border-none font-xl"
            type="text"
            placeholder="Enter URL here..."
          />
          <!-- Why the -mt-3? Since I'm using space-y-3 this causes that to also be applied to the 
              overlay, so adding this in fixes the issue some-->

          <button
            class="p-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 rounded-lg text-white"
          >
            Summarize
          </button>
        </div>

      </div>
    {/if}

    <button on:click={() => slide = (slide + 1) % maxSlides}>
      <EmojioneMonotoneRightArrow class="text-4xl text-blue-600" />
    </button>
  </div>
</div>
