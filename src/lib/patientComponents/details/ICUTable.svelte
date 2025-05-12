<script lang="ts">
    import ValueC from "$lib/icons/ValueC.svelte";
    import ValueX from "$lib/icons/ValueX.svelte";

    let {
        cardiacSupport,
        neurologicalSupport,
        renalSupport,
        respiratorySupport,
    }: {
        cardiacSupport      : boolean;
        neurologicalSupport : boolean;
        renalSupport        : boolean;
        respiratorySupport  : boolean;
    } = $props()

    const rows = [
        { label: "Heart"   , available: cardiacSupport      },
        { label: "Brain"   , available: neurologicalSupport },
        { label: "Kidneys" , available: renalSupport        },
        { label: "Lungs"   , available: respiratorySupport  },
    ];
</script>

<div class="border-primary-400 flex w-52 flex-col overflow-hidden rounded-lg border bg-white">
	<!-- Header -->
	<div
		class="bg-primary-100 border-primary-300 flex border-b text-center font-['Inter'] text-xs leading-none font-bold text-neutral-950"
	>
		<div class="border-primary-300 flex-1 border-r px-3 py-2">Care Type</div>
        
		<div class="border-primary-300 flex-1 border-l px-3 py-2">Availability</div>
	</div>

	<!-- Rows -->
	{#each rows as { label, available }, i}
		<div class="flex {i % 2 === 0 ? 'bg-primary-50' : 'bg-neutral-50'}">
			<!-- Left Column -->
			<div
				class="border-primary-300 flex flex-1 items-center justify-center border-r px-3 py-2 font-['Inter'] text-xs font-bold text-neutral-950"
			>
				{label}
			</div>

			<!-- Right Column -->
			<div class="border-primary-300 flex flex-1 items-center justify-center border-l px-3 py-2">
				{#if available}
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
