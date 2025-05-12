<script lang="ts">
    import ServiceBed from '$lib/icons/ServiceBed.svelte';

    import InfoRow from './InfoRow.svelte';

	let {
        availableBeds
	}: {
        availableBeds: number
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
</div>