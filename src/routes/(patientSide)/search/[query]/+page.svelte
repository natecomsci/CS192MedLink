<script lang="ts">
  import type { ServiceResultsDTO } from '$lib';

  import FilterButton from '$lib/patientComponents/FilterButton.svelte';
  import NoSearchResults from '$lib/patientComponents/NoSearchResults.svelte';
  import PatientSearchResult from '$lib/patientComponents/PatientSearchResult.svelte';
  import SearchFilters from '$lib/patientComponents/popUps/SearchFilters.svelte';
  import PrimaryButton from '$lib/patientComponents/PrimaryButton.svelte';
  import SearchBar from '$lib/patientComponents/SearchBar.svelte';

  let { data, form } = $props();

  const patientSearchPageSize = data.patientSearchPageSize ?? 10;

  async function loadMore(query: string) {
    if (!hasMore) {
      return
    } 
    const body = JSON.stringify({currOffset, query});

    try {
      const response = await fetch("./loadMoreHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();

      results = [...results, ...rv.results];
  
      currOffset = currOffset + patientSearchPageSize;
  
      hasMore = rv.hasMore;
      
      totalFetched = rv.totalFetched;
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

  let currOffset = $state(patientSearchPageSize);

  let results: ServiceResultsDTO[] = $state(data.results ?? []);
  let hasMore = $state(data.hasMore);
  let totalResults = $state(data.totalResults ?? 0);
  let totalFetched = $state(data.totalFetched ?? 0);
  let query = $state(data.query ?? "");

  let showFilter = $state(false);

  let selectedFacilityTypes = $state([]);
	let selectedOwnership = $state("");
	let selectedProviders = $state([]);
	let minimumRange = $state(null);
	let maximumRange = $state(null);
</script>

<header class="relative flex items-center h-20 px-6 border-b border-neutral-200 bg-neutral-50">
		<div class="flex items-center w-full gap-2">
			<SearchBar bind:query propState="result" placeholder="Search for Services" />

			<FilterButton {query} onClick={() => (showFilter = true)} />
		</div>
</header>

<div class="justify-center px-6 pt-6 pb-14">
  {#if results.length > 0}
    {#if totalFetched < totalResults}
      <p class="mb-4 text-xs font-medium tracking-tight leading-none font-['Inter'] text-left">
        <span class="text-neutral-500">Displaying </span>
        <span class="text-primary-500">{totalFetched}</span>
        <span class="text-neutral-500"> out of </span>
        <span class="text-primary-500">{totalResults}</span>
        <span class="text-neutral-500"> results</span>
      </p>
    {/if}

    {#each results as service}
      <div class="mb-3">
        <PatientSearchResult facilityName={service.name} facilityID={service.facilityID} serviceID={service.serviceID} serviceType={service.type}/>
      </div>
    {/each}
    {#if hasMore}
      <div class="flex justify-center mt-9">
        <PrimaryButton text="Load More" onClick={() => loadMore(query)} />
      </div>
    {/if}
  {:else}
    <div class="flex h-64 w-full items-center justify-center fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
      <NoSearchResults />
    </div>
  {/if}
</div>

{#if showFilter}
	<SearchFilters
		{query}
		bind:selectedFacilityTypes
		bind:selectedOwnership
		bind:selectedProviders
		bind:minimumRange
		bind:maximumRange
		onClick={() => (showFilter = false)}
	/>
{/if}