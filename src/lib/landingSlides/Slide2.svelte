<script lang="ts">
</script>

<div
  class="flex flex-col flex-grow min-h-full lg:flex-row lg:w-full justify-center space-y-4 lg:space-x-8"
>
  <div
    class="lg:max-w-[30%] text-center text-5xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
  >
    Writer's block? No Problem
  </div>
  <div
    class="flex flex-col lg:max-w-[45%] items-center justify-center space-y-1 text-white"
  >
    <!--Creating a textbox with placeholder text for brainstorming ideas-->
    <div class="text-center font-semibold text-xl">
      Generate a starting script with the press of a button
    </div>
    <input
      class="w-full h-10 rounded-lg px-2 text-black"
      type="text"
      placeholder="or try generating a random idea..."
    />

    <div class="flex flex-row p-2 space-x-2">
      <button class="h-10 px-2 rounded-lg bg-blue-600"> Generate Idea </button>
      <button class="h-10 px-2 rounded-lg bg-blue-600">
        Generate Random Idea
      </button>
    </div>
  </div>
</div>
