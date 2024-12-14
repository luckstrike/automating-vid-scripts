<script lang="ts">
  import { goto } from "$app/navigation";
  import DeviconGoogle from "~icons/devicon/google";
  import DeviconGithub from "~icons/devicon/github";
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
    <img
      class="h-24 w-24"
      src="/favicon/android-chrome-512x512.png"
      alt="DinoDino Logo"
    />
    <div class="text-center text-4xl font-bold text-white">
      Howdy there, Welcome to DinoDino
    </div>
    <form class="flex flex-col justify-center space-y-2 w-64" method="POST">
      <button
        formaction="?/googleSignIn"
        class="flex flex-row space-x-2 px-6 py-4 bg-white rounded-md items-center"
      >
        <DeviconGoogle style="font-size: 1.5em"></DeviconGoogle>
        <div class="font-semibold">Continue with Google</div>
      </button>
      <button
        formaction="?/githubSignIn"
        class="flex flex-row space-x-2 px-6 py-4 bg-white rounded-md items-center"
      >
        <DeviconGithub style="font-size: 1.5em"></DeviconGithub>
        <div class="font-semibold">Continue with Github</div>
      </button>
    </form>
  </div>
</div>
