<script lang="ts">
  import { fade } from "svelte/transition";
  import EmojioneMonotoneLeftArrow from "~icons/emojione-monotone/left-arrow";
  import EmojioneMonotoneRightArrow from "~icons/emojione-monotone/right-arrow";

  export let slides: any[];

  let currentSlide = 0;
  const totalSlides = slides.length;

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  }
</script>

<div class="flex items-center w-full">
  <button
    on:click={prevSlide}
    class="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
  >
    <EmojioneMonotoneLeftArrow class="text-4xl" />
  </button>

  <!-- 100.1% is kind of a hacky solution, but it works... --->
  <div class="flex-grow overflow-hidden">
    <div
      class="flex transition-transform duration-300 ease-in-out"
      style="transform: translateX(-{currentSlide * 100.1}%)"
    >
      {#each slides as slide, index (index)}
        <div class="w-full flex-shrink-0 flex justify-center items-center">
          <div in:fade>
            <svelte:component this={slide} />
          </div>
        </div>
      {/each}
    </div>
  </div>

  <button
    on:click={nextSlide}
    class="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
  >
    <EmojioneMonotoneRightArrow class="text-4xl" />
  </button>
</div>
