<script lang="ts">
	import Icon from '@iconify/svelte';

	import FilterSettings from './FilterSettings.svelte'

  let Search = "mdi-light:magnify"
  let Filter = "mingcute:settings-6-line"

	let { guest = true } = $props();
	let filterOn = $state(false);

	let search = $state("");
</script>

<!-- @elle, @paul: padesign -->
<form
	class="grid grid-cols-1 justify-items-center p-8"
>
		
	<div class="flex">
		<div>
			<Icon icon={Search} width="20" height="20" />
		</div>

		<!-- insert vertical line -->
		
		<div>
			<input placeholder="Search" bind:value={search} />
		</div>

		<div>

			<button onclick={() => filterOn = !filterOn}>
				<Icon icon={Filter} width="20" height="20" />
			</button>
		</div>

	</div>
	<!-- <p>Filter On: {filterOn}</p> -->
	{#if filterOn} 
		<!-- <FilterSettings search={search} guest={guest} /> -->
		<h1>Type</h1>
		<h1>Ownership</h1>
		<h1>Distance Range</h1>
		<h1>Insurance Coverage</h1>
		<h1>Show Only Covered Facilities</h1>
		
		{#if !guest}
			<h1>Show Only Bookmarked Facilities</h1>
		{/if}

		<button>
			View Filtered Results
		</button>
	{/if}

</form>
