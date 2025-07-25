<script lang="ts">
  import type { PageProps } from './$types';

  import type { FacilityDivisionResultsDTO } from '$lib';

  import Header from '$lib/patientComponents/Header.svelte';
  import SearchBar from '$lib/patientComponents/SearchBar.svelte';
  import FacilitySearchResult from '$lib/patientComponents/FacilitySearchResult.svelte';
  import PrimaryButton from '$lib/patientComponents/PrimaryButton.svelte';
  import NoSearchResults from '$lib/patientComponents/NoSearchResults.svelte';

  let { data }: PageProps = $props();

  const patientSearchPageSize = data.patientSearchPageSize ?? 10;

  async function loadMore() {
    if (!hasMore) {
      return
    } 
    const body = JSON.stringify({currOffset, facilityID});

    try {
      const response = await fetch("./divisions/loadMoreHandler", {
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

  let facilityID = $state(data.facilityID);
  let currOffset = $state(patientSearchPageSize);

  let results: FacilityDivisionResultsDTO[] = $state(data.results ?? []);
  let hasMore = $state(data.hasMore);
  let totalResults = $state(data.totalResults ?? 0);
  let totalFetched = $state(data.totalFetched ?? 0);
  let query = $state("");
</script>

<Header text="Divisions" icon="Arrow" />

<div class="justify-center px-6 pt-6 pb-14">
  <div class="flex items-center w-full gap-2 mb-6">
    <SearchBar bind:query propState="default" placeholder="Search for Divisions" />
  </div>
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

    {#each results as division}
      <div class="mb-3">
        <FacilitySearchResult id={division.divisionID} label={division.name} kind="division"/>
      </div>
    {/each}
    {#if hasMore}
      <div class="flex justify-center mt-9">
        <PrimaryButton text="Load More" onClick={() => loadMore()} />
      </div>
    {/if}
  {:else}
    <div class="flex h-64 w-full items-center justify-center fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
      <NoSearchResults />
    </div>
  {/if}
</div>