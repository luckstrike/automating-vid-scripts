<script lang="ts">
  import { goto } from "$app/navigation";
  import DeviconGoogle from "~icons/devicon/google";
</script>

<div class="flex flex-col w-screen h-screen">
  <div class="flex flex-row space-x-4 justify-end text-white p-2">
    <button on:click={() => goto("/")}> Home </button>
    <button
      class="bg-blue-600 rounded-lg pt-2 pb-2 pl-4 pr-4 font-semibold"
      on:click={() => goto("/login")}
    >
      Login
    </button>
  </div>

  <div
    class="flex flex-col w-full h-full items-center justify-center p-4 space-y-4"
  >
    <div class="text-center text-4xl font-bold text-white">
      Howdy there, Welcome to VidScripts
    </div>
    <div class="flex justify-center w-full">
      <button
        class="flex flex-row space-x-2 px-6 py-4 bg-white rounded-md items-center"
      >
        <DeviconGoogle style="font-size: 1.5em"></DeviconGoogle>
        <div class="font-semibold">Continue with Google</div>
      </button>
    </div>
  </div>
</div>
