<script lang="ts">
	import { completionTimeMapping, moneyMapping } from '$lib/mappings';

    import ServiceWalk from '$lib/icons/ServiceWalk.svelte';
    import Clock from '$lib/icons/Clock.svelte';
    import ServicePeso from '$lib/icons/ServicePeso.svelte';

    import InfoRow from './InfoRow.svelte';

	let {
        acceptsWalkIns,
        completionTimeD,
        completionTimeH,
        basePrice
	}: {
        acceptsWalkIns  : boolean;
        completionTimeD : number;
        completionTimeH : number;
        basePrice       : number;
	} = $props();

    const completionTime: string = completionTimeMapping(completionTimeD, completionTimeH);
</script>

<div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
        Details
    </p>

    <InfoRow
        icon={ServiceWalk}
        label="Walk-ins"
        value={acceptsWalkIns ? "Accepted" : "Not Accepted"}
        valueColor={acceptsWalkIns ? "text-success-on" : "text-error-on"}
    />

    <InfoRow
        icon={Clock}
        label="Completion Time"
        value={completionTime}
    />

    <InfoRow
        icon={ServicePeso}
        label="Base Price"
        value={moneyMapping(basePrice)}
    />
</div>