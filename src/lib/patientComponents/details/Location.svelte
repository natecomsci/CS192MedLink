<script lang="ts">
	import { completionTimeMapping, moneyMapping } from '$lib/mappings';

    import Pin from '$lib/icons/Pin.svelte';

    import InfoRow from './InfoRow.svelte';

	let {
        region,
        pOrC,
        cOrM,
        brgy,
        street,
        facilityPage = false,
        longitude,
        latitude,
	}: {
        region        : string;
        pOrC          : string;
        cOrM          : string;
        brgy          : string;
        street        : string;
        facilityPage? : boolean;
        longitude?    : number;
        latitude?     : number;
	} = $props();
</script>

{#if facilityPage}
    <div class="flex flex-col items-start gap-2 self-stretch">
        <p class="text-primary-500 text-base font-bold tracking-tight leading-loose">
            Location
        </p>

        <!-- Insert Google Maps -->

        <InfoRow
            icon={Pin}
            value={`${street}<br>${brgy}, ${cOrM}<br>${pOrC}, ${region}`}
        />
    </div>
{:else}
    <div class="flex flex-col items-start gap-2 self-stretch">
        <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
            Location
        </p>

        <InfoRow
            icon={Pin}
            value={`${street}<br>${brgy}, ${cOrM}<br>${pOrC}, ${region}`}
        />
    </div>
{/if}