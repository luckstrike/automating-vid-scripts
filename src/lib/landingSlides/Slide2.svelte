<script lang="ts">
</script>

<div
  class="flex flex-row w-screen h-full justify-center items-center space-x-4"
>
  <div
    class="max-w-[30%] text-7xl font-bold bg-gradient-to-b from-[#5CA4ED] to-[#97D9E1] text-transparent bg-clip-text"
  >
    Writer's block? No Problem
  </div>
  <div
    class="flex flex-col max-w-[45%] items-center align-middle justify-center text-white p-4"
  >
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
      <button class="h-10 px-2 rounded-lg bg-blue-600"> Generate Idea </button>
      <button class="h-10 px-2 rounded-lg bg-blue-600">
        Generate Random Idea
      </button>
    </div>
  </div>
</div>
