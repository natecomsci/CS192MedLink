<script lang="ts">
    let {
        nonUrgentPatients,
        nonUrgentQueueLength,
        urgentPatients,
        urgentQueueLength,
        criticalPatients,
        criticalQueueLength,
    }: {
        nonUrgentPatients    : number;
        nonUrgentQueueLength : number;
        urgentPatients       : number;
        urgentQueueLength    : number;
        criticalPatients     : number;
        criticalQueueLength  : number;
    } = $props();

    const rows = [
        { label: "Non-Urgent", inCare: nonUrgentPatients , queue: nonUrgentQueueLength },
        { label: "Urgent"    , inCare: urgentPatients    , queue: urgentQueueLength    },
        { label: "Critical"  , inCare: criticalPatients  , queue: criticalQueueLength  },
    ];
</script>

<div class="border-primary-400 flex self-stretch flex-col overflow-hidden rounded-lg border bg-white">
	<!-- Header -->
	<div
		class="bg-primary-100 border-primary-300 flex border-b text-center font-['Inter'] text-xs leading-none font-bold text-neutral-950"
	>
		<div class="border-primary-300 flex-1 border-r px-3 py-2">Patient Type</div>

		<div class="border-primary-300 flex-1 border-x px-3 py-2">In Care</div>

		<div class="border-primary-300 flex-1 border-l px-3 py-2">Queue</div>
	</div>

	<!-- Rows -->
	{#each rows as { label, inCare, queue }, i}
		<div class="flex {i % 2 === 0 ? 'bg-primary-50' : 'bg-neutral-50'}">
			<div
				class="border-primary-300 flex flex-1 items-center justify-center border-r px-3 py-2 font-['Inter'] text-xs font-bold text-neutral-950"
			>
				{label}
			</div>

			<div
				class="border-primary-300 flex flex-1 items-center justify-center border-x px-3 py-2 font-['Inter'] text-xs font-medium text-neutral-900"
			>
				{inCare}
			</div>

			<div
				class="border-primary-300 flex flex-1 items-center justify-center border-l px-3 py-2 font-['Inter'] text-xs font-medium text-neutral-900"
			>
				{queue}
			</div>
		</div>
	{/each}
</div>
