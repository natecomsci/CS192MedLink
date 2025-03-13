<script lang="ts">
	import Logo from '$lib/images/Logo.png';
	import Icon from '@iconify/svelte';
  
	let Search = "mdi-light:magnify";
	let Filter = "mingcute:settings-6-line";
  
	let search = "";
	let showFilter = false;
	let warningMessage = ""; // Store warning message
  
	function handleSearch(event: Event) {
	  event.preventDefault(); // Prevent form submission behavior
	  
	  if (search.trim() === "") {
		warningMessage = "Please enter a search query.";
		return;
	  }
	  
	  warningMessage = ""; // Clear warning if valid
	  window.location.href = `/byFaciSearch?query=${encodeURIComponent(search)}`;
	}
  </script>
  
  <form class="grid grid-cols-1 justify-items-center p-8" on:submit={handleSearch}>
	<div class="grid grid-cols-1 justify-items-center">
	  <img src={Logo} alt="MedLink logo" width="100" height="100"/>
	  <h1>Connecting you to healthcare, one search at a time.</h1>
	</div>
  
	<!-- Search Input -->
	<div class="flex items-center mt-4">
	  <Icon icon={Search} width="20" height="20" class="mr-2"/>
	  <input type="text" placeholder="Search" bind:value={search} class="border p-2 rounded"/>
	  <button type="submit" class="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
		Search
	  </button>
	  <button 
		type="button"
		class="ml-2 text-white bg-purple-700 hover:bg-purple-800 p-2.5 rounded-full"
		on:click={() => showFilter = !showFilter}
	  >
		<Icon icon={Filter} width="20" height="20"/>
	  </button>
	</div>
  
	{#if warningMessage}
	  <p class="text-red-600 mt-2">{warningMessage}</p>
	{/if}
  
	{#if showFilter}
	  <p>filters here</p>
	{/if}
  </form>
  