<script lang="ts">
	import Logo from '$lib/images/Logo.png';
	import Icon from '@iconify/svelte';

  let Search = "mdi-light:magnify"
  let Filter = "mingcute:settings-6-line"

	let search = $state("");

	let showFilter = $state(false);
</script>

<!-- @elle, @paul: padesign -->
<form
	class="grid grid-cols-1 justify-items-center p-8"
>
	<div class="grid grid-cols-1 justify-items-center">
    <img 
      src={Logo} 
      alt="MedLink logo" 
      width="100" 
      height="100"/>

    <h1 class="">
      Connecting you to healthcare, one search at a time.
    </h1>
  </div>

	<div class="inline-flex rounded-md shadow-xs" role="group">
	  <button type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
	    Facility
	  </button>

	  <button type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
	    Service
	  </button>
	</div>
	<div class="flex">
		<div>
			<Icon icon={Search} width="20" height="20" />
		</div>

		<!-- insert vertical line -->
		
		<div>
			<input placeholder="Search" bind:value={search} />
		</div>

		<div>

			<button 
				class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
				onclick={() => showFilter = !showFilter} 
			>
				<Icon icon={Filter} width="20" height="20" />
			</button>
		</div>		
	</div>

	{#if showFilter}
		<p>
			filters here
		</p>
	{/if}
	
</form>
