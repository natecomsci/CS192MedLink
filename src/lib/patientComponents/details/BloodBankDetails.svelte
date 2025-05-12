<script lang="ts">
	import { completionTimeMapping, moneyMapping } from '$lib/mappings';

    import Clock from '$lib/icons/Clock.svelte';
    import ServicePeso from '$lib/icons/ServicePeso.svelte';

    import InfoRow from './InfoRow.svelte';

	let {
        turnaroundTimeD,
        turnaroundTimeH,
        basePricePerUnit,
	}: {
        turnaroundTimeD  : number;
        turnaroundTimeH  : number;
        basePricePerUnit : number;
	} = $props();

    const turnaroundTime: string = completionTimeMapping(turnaroundTimeD, turnaroundTimeH);
</script>

<div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
        Details
    </p>

    <InfoRow
        icon={Clock}
        label="Turnaround Time"
        value={turnaroundTime}
    />

    <InfoRow
        icon={ServicePeso}
        label="Base Price Per Unit"
        value={moneyMapping(basePricePerUnit)}
    />
</div>