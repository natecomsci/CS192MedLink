<script lang="ts">
	import type { PageProps } from './$types';

	import SearchBar from '$lib/patientComponents/SearchBar.svelte';
	import FilterButton from '$lib/patientComponents/FilterButton.svelte';
	import ServiceButton from '$lib/patientComponents/ServiceButton.svelte';
	import Ambulance from '$lib/icons/Ambulance.svelte';
	import BloodBank from '$lib/icons/BloodBank.svelte';
	import ER from '$lib/icons/ER.svelte';
	import ICU from '$lib/icons/ICU.svelte';
	import SearchFilters from '$lib/patientComponents/popUps/SearchFilters.svelte';

	import Logo from '$lib/images/Logo.png';

	let { data, form }: PageProps = $props();

	let query = $state('');

	let showFilter = $state(false);

	let selectedFacilityTypes = $state([]);
	let selectedOwnership = $state('');
	let selectedProviders = $state([]);
	let minimumRange = $state(null);
	let maximumRange = $state(null);
</script>

<div
	class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-primary-400 to-primary-950"
>
	<!-- Logo -->
	<div class="absolute left-1/2 top-15 transform -translate-x-1/2">
		<img src={Logo} alt="MedLink logo" width="150" height="150"/>
	</div>

	<!-- Main -->
	<div
		class="flex flex-col flex-grow items-center w-full mt-45 px-6 py-10 rounded-t-[5rem] bg-gradient-to-t from-primary-50 via-background to-background"
	>
		<!-- Title -->
		<div class="flex flex-col mt-3 w-fit group hover:cursor-default">
			<h1
				class="text-center font-['DM_Sans'] text-[3.8rem] font-black leading-normal tracking-tight text-primary-900 group-hover:text-primary-500 group-active:text-primary-500 drop-shadow-md drop-shadow-neutral-200 transition-colors ease-in-out duration-300"
			>
				Med<span class="text-primary-500 group-hover:text-primary-900 group-active:text-primary-900 transition-colors ease-in-out duration-300">Link</span>
			</h1>

			<p
				class="text-center font-['Inter'] text-base font-medium leading-normal text-neutral-600"
			>
				Connecting you to healthcare,<br/>one search at a time.
			</p>
		</div>

		<!-- Search Bar and Filter Button -->
		<div class="flex items-center w-full max-w-2xl gap-2 mt-6 mb-6">
			<SearchBar bind:query propState="default" placeholder="Search for Services" />

			<FilterButton {query} onClick={() => (showFilter = true)} />
		</div>

		<p
			class="text-center font-['Inter'] text-base font-medium leading-tight text-neutral-600 mb-6"
		>
			Not sure what to search? Get started with these:
		</p>

		<!-- Service Buttons -->

		<div class="grid grid-cols-2 justify-items-center w-fit gap-4">
			<ServiceButton 
				text="Ambulance" 
				icon={Ambulance} 
				href="/search/Ambulance" 
			/>

			<ServiceButton 
				text="Blood Bank" 
				icon={BloodBank} 
				href="/search/Blood%20Bank" 
			/>

			<ServiceButton 
				text="Emergency<br/>Room" 
				icon={ER} 
				href="/search/Emergency%20Room" 
			/>

			<ServiceButton
				text="Intensive<br/>Care Unit"
				icon={ICU}
				href="/search/Intensive%20Care%20Unit"
			/>
		</div>
	</div>
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