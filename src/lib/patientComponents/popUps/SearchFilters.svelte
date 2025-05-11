<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import { enhance } from '$app/forms';

	import { onMount } from 'svelte';

	import RadioToggle from '$lib/patientComponents/RadioToggle.svelte';
	import CheckBoxDropdown from '$lib/patientComponents/CheckBoxDropdown.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';

	import { facilityType } from '$lib/projectArrays';
	import { providers } from '$lib/projectArrays';

	let {
		query,
		selectedFacilityTypes = $bindable(),
		selectedOwnership = $bindable(),
		selectedProviders = $bindable(),
		minimumRange = $bindable(),
		maximumRange = $bindable(),
		onClick
	}: {
		query: string;
		selectedFacilityTypes: string[];
		selectedOwnership: string;
		selectedProviders: string[];
		minimumRange: number | null;
		maximumRange: number | null;
		onClick: () => void;
	} = $props();

	function resetFilters() {
		selectedFacilityTypes = [];
		selectedOwnership = '';
		selectedProviders = [];
		minimumRange = null;
		maximumRange = null;
	}

	let isSmallScreen = $state(false);

	const checkScreenSize = () => {
		isSmallScreen = window.innerWidth <= 640;
	};

	onMount(() => {
		checkScreenSize();

		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	});
</script>

<!-- Filters -->
{#snippet filters()}
	<!-- X Button -->
	<div class="flex w-full justify-end">
		<button type="button" onclick={onClick} class="text-neutral-900">
			<ValueX
				class="h-7 w-7 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700"
			/>
		</button>
	</div>

	<div class="flex flex-col gap-3 items-center justify-center w-full">
		<!-- Facility Details -->
		<div class="flex flex-col gap-3 w-full">
			<h2 class="text-primary-500 text-base font-bold tracking-tight leading-loose font-['Inter']">
				Facility Details
			</h2>

			<!-- Type -->
			<div class="flex flex-col gap-2">
				<h3 class="text-neutral-950 text-sm font-bold tracking-tight leading-tight font-['Inter']">
					Type
				</h3>
				<CheckBoxDropdown
					label="Select Facility Types"
					items={facilityType}
					bind:selectedItems={selectedFacilityTypes}
				/>
			</div>

			<!-- Ownership -->
			<div class="flex items-center justify-between">
				<h3 class="text-neutral-950 text-sm font-bold tracking-tight leading-tight font-['Inter']">
					Ownership
				</h3>
				<RadioToggle options={['Public', 'Private']} bind:selectedOption={selectedOwnership} />
			</div>
		</div>

		<!-- Separator -->
		<hr class="self-stretch h-px border-neutral-200" />

		<!-- Distance -->
		<div class="flex flex-col gap-3 w-full">
			<h2 class="text-primary-500 text-base font-bold tracking-tight leading-loose font-['Inter']">
				Distance
			</h2>

			<div class="flex items-center justify-center w-full gap-4">
				<p class="text-neutral-950 text-sm font-medium tracking-tight leading-tight font-['Inter']">
					From:
				</p>

				<div
					class="flex flex-1 items-center bg-neutral-50 px-4 py-1 rounded-xl border border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-900"
				>
					<input
						type="text"
						name="minimumRange"
						bind:value={minimumRange}
						placeholder="e.g. 0"
						class="bg-transparent border-none outline-none text-neutral-400 text-sm font-medium tracking-tight leading-tight font-['Inter'] text-center w-full placeholder:text-neutral-400 focus:ring-0"
					/>
				</div>

				<p class="text-neutral-950 text-sm font-medium tracking-tight leading-tight font-['Inter']">
					km
				</p>

				<p class="text-neutral-950 text-sm font-medium tracking-tight leading-tight font-['Inter']">
					To:
				</p>

				<div
					class="flex flex-1 items-center bg-neutral-50 px-4 py-1 rounded-xl border border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-900"
				>
					<input
						type="text"
						name="maximumRange"
						bind:value={maximumRange}
						placeholder="e.g. 50"
						class="bg-transparent border-none outline-none text-neutral-400 text-sm font-medium tracking-tight leading-tight font-['Inter'] text-center w-full placeholder:text-neutral-400 focus:ring-0"
					/>
				</div>

				<p class="text-neutral-950 text-sm font-medium tracking-tight leading-tight font-['Inter']">
					km
				</p>
			</div>
		</div>

		<!-- Separator -->
		<hr class="self-stretch h-px border-neutral-200" />

		<!-- Health Plan Coverage -->
		<div class="flex w-full flex-col gap-3">
			<h2 class="text-primary-500 text-base font-bold tracking-tight leading-loose font-['Inter']">
				Health Plan Coverage
			</h2>

			<CheckBoxDropdown
				label="Select Health Plans"
				items={providers}
				bind:selectedItems={selectedProviders}
				opensUp={true}
			/>
		</div>
	</div>
{/snippet}

<!-- Call to Actions -->
{#snippet ctas()}
	<div class={`flex gap-5 w-full ${isSmallScreen ? 'mt-8' : 'mt-6'}`}>
		<div class="w-1/2">
			<button
				onclick={resetFilters}
				class="flex items-center justify-center 
					bg-neutral-200 hover:bg-neutral-400 active:bg-neutral-300 
					text-sm font-bold tracking-tight leading-loose text-neutral-950 
			       	h-12 w-full px-5 py-3 
			       	rounded-full 
			       	transition-colors duration-300 ease-in-out"
			>
				Reset Filters
			</button>
		</div>
		<div class="w-1/2">
			<form method="POST" action="?/search" use:enhance class="flex flex-1">
				<input type="hidden" name="query" value={query} />
	
				<button
					type="submit"
					class="flex items-center justify-center 
						   bg-primary-500 hover:bg-primary-700 active:bg-primary-700 
							text-sm font-bold tracking-tight leading-loose text-neutral-50 
							h-12 w-full px-5 py-3 
							rounded-full 
							transition-colors duration-300 ease-in-out"
				>
					Apply Filters
				</button>
			</form>
		</div>
	</div>
{/snippet}


<!-- Overlay -->
<div
	in:fade={{ duration: 125 }}
	class="bg-primary-950/75 fixed inset-0 z-50 backdrop-blur-[2px]"
></div>

{#if isSmallScreen}
	<!-- Mobile Pop Up -->
	<div
		in:slide={{ duration: 300, axis: 'y', easing: cubicOut }}
		class="bg-background shadow-xl shadow-neutral-800 max-h-9/10 px-6 pt-6 pb-20 rounded-t-[54px] fixed right-0 bottom-0 left-0 z-50 transition-all"
	>
		{@render filters()}
		{@render ctas()}
	</div>
{:else}
	<!-- Desktop Pop Up -->
	<div
		in:fade={{ duration: 300, easing: cubicOut }}
		class="bg-background shadow-xl shadow-neutral-800 w-lg px-6 pt-6 pb-12 rounded-[54px] fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform transition-all"
	>
		{@render filters()}
		{@render ctas()}
	</div>
{/if}

<!-- Notes: Gave up making ending transitions happen kasi for some reason nawawala yung entry transitions. Also gave up attempting to make the mobile version height-sensitive hehe. -->
