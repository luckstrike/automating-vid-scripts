<script lang="ts">
  import { goto } from "$app/navigation";
  import Slide1 from "./landingSlides/Slide1.svelte";
  import Slide2 from "./landingSlides/Slide2.svelte";
  import Slide3 from "./landingSlides/Slide3.svelte";
  import Carousel from "./Carousel.svelte";

  const slides = [Slide1, Slide2, Slide3];
</script>

<div class="flex flex-col w-screen h-screen p-2">
  <div class="flex flex-row space-x-4 justify-end items-center p-2 text-white">
    <button on:click={() => goto("/")}> Home </button>
    <button
      class="bg-blue-600 rounded-lg pt-2 pb-2 pl-4 pr-4 font-semibold"
      on:click={() => goto("/login")}
    >
      Login
    </button>
  </div>
  <div
    class="hidden lg:flex lg:flex-row lg:items-center lg:justify-center lg:flex-grow"
  >
    <Carousel {slides} />
  </div>

  <div
    class="flex flex-col snap-y snap-mandatory h-screen overflow-y-scroll space-y-4 lg:hidden"
  >
    <div class="snap-start h-screen flex flex-col items-center justify-center">
      <Slide1 />
    </div>
    <div class="snap-start h-full flex flex-col items-center justify-center">
      <Slide2 />
    </div>
    <div class="snap-start h-full flex flex-col items-center justify-center">
      <Slide3 />
    </div>
  </div>
</div>
