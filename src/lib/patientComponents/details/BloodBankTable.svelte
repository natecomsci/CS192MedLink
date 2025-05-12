<script lang="ts">
	import type { BloodTypeMappingDTO } from '$lib/server/dataLayer/DTOs';

	import ValueC from '$lib/icons/ValueC.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';

	let {
		availability
	}: {
		availability: BloodTypeMappingDTO;
	} = $props();

	const rows = [
		{ key: 'A_P', label: 'A+' },
		{ key: 'A_N', label: 'A-' },
		{ key: 'B_P', label: 'B+' },
		{ key: 'B_N', label: 'B-' },
		{ key: 'O_P', label: 'O+' },
		{ key: 'O_N', label: 'O-' },
		{ key: 'AB_P', label: 'AB+' },
		{ key: 'AB_N', label: 'AB-' },
	];
</script>

<div class="border-primary-400 flex w-52 flex-col overflow-hidden rounded-lg border">
	<!-- Header -->
	<div
		class="bg-primary-100 border-primary-300 flex border-b text-center font-['Inter'] text-xs leading-none font-bold text-neutral-950"
	>
		<div class="border-primary-300 flex-1 border-r px-3 py-2">Blood Type</div>
    
		<div class="border-primary-300 flex-1 border-l px-3 py-2">Availability</div>
	</div>

	<!-- Rows -->
	{#each rows as { key, label }, i}
		<div class="flex {i % 2 === 0 ? 'bg-primary-50' : 'bg-neutral-50'}">
			<!-- Left Column -->
			<div
				class="border-primary-300 flex flex-1 items-center justify-center border-r px-3 py-2 font-['Inter'] text-xs font-bold text-neutral-950"
			>
				{label}
			</div>

			<!-- Right Column -->
			<div class="border-primary-300 flex flex-1 items-center justify-center border-l px-3 py-2">
				{#if availability[key as keyof BloodTypeMappingDTO]}
					<div
						class="text-success-on flex items-center gap-2 font-['Inter'] text-xs leading-relaxed font-bold"
					>
						<ValueC
							class="text-success-on hover:text-success-on-t active:text-success-on-t h-4 w-4 shrink-0 transition-colors duration-300"
						/>
						<p class="text-success-on text-left">Yes</p>
					</div>
				{:else}
					<div
						class="text-error-on flex items-center gap-2 font-['Inter'] text-xs leading-relaxed font-bold"
					>
						<ValueX
							class="text-error-on hover:text-error-on-t active:text-error-on-t h-4 w-4 shrink-0 transition-colors duration-300"
						/>
						<p class="text-error-on text-left">No</p>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
