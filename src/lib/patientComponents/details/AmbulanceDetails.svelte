<script lang="ts">
    import { moneyMapping } from '$lib/mappings';

    import ServiceRadius from '$lib/icons/ServiceRadius.svelte';
    import ServicePeso from '$lib/icons/ServicePeso.svelte';

    import InfoRow from './InfoRow.svelte';

    let {
        minCoverageRadius,
        baseRate,
        maxCoverageRadius,
        mileageRate,
	}: {
        minCoverageRadius : number;
        baseRate          : number;
        maxCoverageRadius : number;
        mileageRate       : number;
	} = $props();
</script>

<div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
        Details
    </p>

    <InfoRow
        icon={ServiceRadius}
        label="Minimum Coverage Radius"
        value={minCoverageRadius.toString()}
    />

    <InfoRow
        icon={ServicePeso}
        label="Base Rate"
        value={moneyMapping(baseRate)}
    />

    <InfoRow
        icon={ServiceRadius}
        label="Minimum Coverage Radius"
        value={maxCoverageRadius.toString()}
    />

    <InfoRow
        icon={ServicePeso}
        label="Mileage Rate"
        value={moneyMapping(mileageRate)}
    />
</div>