<script lang="ts">
    import { moneyMapping } from '$lib/mappings';

    import ServiceBed from '$lib/icons/ServiceBed.svelte';
    import ServicePeso from '$lib/icons/ServicePeso.svelte';

    import InfoRow from './InfoRow.svelte';

	let {
        availableBeds,
        baseRate
	}: {
        availableBeds : number;
        baseRate      : number;
	} = $props();
</script>

<div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
        Details
    </p>

    <InfoRow
        icon={ServiceBed}
        label="Available Beds"
        value={availableBeds.toString()}
    />

    <InfoRow
        icon={ServicePeso}
        label="Base Rate"
        value={moneyMapping(baseRate)}
    />
</div>