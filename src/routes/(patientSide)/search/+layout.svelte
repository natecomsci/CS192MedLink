<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen">
  <aside class="w-17/48 hidden md:block bg-linear-to-br from-neutral-100 to-primary-50 relative">

  </aside>

  <main class="w-full lg:w-7/24 mx-auto border-x border-x-neutral-200">
    {@render children()}
  </main>

  <aside class="w-17/48 hidden md:block bg-linear-to-bl from-neutral-100 to-primary-50 relative">
	<!-- ? INSERT ABOUT THE TEAM ? -->
  </aside>
</div>