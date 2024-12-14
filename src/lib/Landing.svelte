<script lang="ts">
  import { goto } from "$app/navigation";
  import Slide1 from "./landingSlides/Slide1.svelte";
  import Slide2 from "./landingSlides/Slide2.svelte";
  import Slide3 from "./landingSlides/Slide3.svelte";
  import Carousel from "./Carousel.svelte";

  const slides = [Slide1, Slide2, Slide3];
</script>

<div class="flex flex-col w-screen h-screen p-2">
  <div class="flex flex-row justify-between text-white mb-4">
    <div class="flex flex-row space-x-1 items-center">
      <img
        class="h-16 w-16"
        src="/favicon/android-chrome-192x192.png"
        alt="DinoDino Logo"
      />
      <div class="text-4xl font-bold p-1 pt-0">DinoDino</div>
    </div>
    <div class="flex flex-row space-x-4 text-white mb-4">
      <button on:click={() => goto("/")}> Home </button>
      <button
        class="bg-blue-600 rounded-lg pt-2 pb-2 pl-4 pr-4 font-semibold"
        on:click={() => goto("/auth/login")}
      >
        Login
      </button>
    </div>
  </div>
  <div class="flex-grow flex justify-center items-center">
    <div class="hidden lg:block max-w-[75%]">
      <Carousel {slides} />
    </div>
  </div>

  <div
    class="lg:hidden w-full flex flex-col snap-y snap-mandatory overflow-y-auto"
  >
    <div class="snap-start min-h-full overflow-y-scroll">
      <Slide1 />
    </div>
    <div class="snap-start min-h-full">
      <Slide2 />
    </div>
    <div class="snap-start min-h-full">
      <Slide3 />
    </div>
  </div>
</div>
