<script lang="ts">
  import EmojioneMonotoneLeftArrow from "~icons/emojione-monotone/left-arrow";
  import EmojioneMonotoneRightArrow from "~icons/emojione-monotone/right-arrow";
</script>

<div class="flex flex-col w-screen h-screen p-2">
  <div class="flex flex-row space-x-4 justify-end items-center p-2 text-white">
    <div>Home</div>
    <button class="bg-blue-600 rounded-lg pt-2 pb-2 pl-4 pr-4 font-semibold"
      >Login</button
    >
  </div>
  <div class="flex flex-row flex-grow items-center justify-between pl-4 pr-4">
    <button>
      <EmojioneMonotoneLeftArrow class="text-4xl text-blue-600" />
    </button>
    <div
      class="max-w-[30%] text-7xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
    >
      Write your video scripts with a helping hand
    </div>
    <div
      class="w-[43%] h-[100%] flex flex-col bg-[#d9d9d9] rounded-lg translate-y-[15%] p-8"
    >
      <div class="font-bold text-3xl">The Generational Ford Mustang</div>
      <br />
      <br />
      <div class="text-3xl select-all">
        The Ford Mustang has been around the block for a long time. In fact it’s
        gone through a lot of generations throughout it’s existence.
      </div>
    </div>
    <button>
      <EmojioneMonotoneRightArrow class="text-4xl text-blue-600" />
    </button>
  </div>
</div>
