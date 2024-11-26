<!-- src/routes/+error.svelte -->
<script>
  import { page } from "$app/stores";
</script>

<main class="flex justify-center items-center min-h-screen p-8">
  <div class="max-w-2xl text-center">
    <h1 class="text-4xl font-bold text-gray-300 mb-6">
      {$page.status}: {$page.error?.message || "Page Not Found"}
    </h1>
    <h2 class="text-lg text-gray-300">
      Something went wrong when trying to access this page...
    </h2>
    <h2 class="text-lg text-gray-300">
      Try loading the page again or accessing a different page
    </h2>
  </div>
</main>
