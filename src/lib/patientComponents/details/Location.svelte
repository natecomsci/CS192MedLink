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
    <div class="flex flex-col items-start gap-3 self-stretch">
        <p class="text-primary-500 text-base font-bold tracking-tight leading-normal font-['Inter']">
            Location
        </p>

        <!-- Insert Google Maps -->

        <div class="bg-primary-100 border-2 border-primary-500 w-full h-48 rounded-2xl">
            
        </div>

        <InfoRow
            icon={Pin}
            value={`${street}<br>${brgy}, ${cOrM}<br>${pOrC}, ${region}`}
        />
    </div>
{:else}
    <div class="flex flex-col items-start gap-2 self-stretch">
        <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter']">
            Location
        </p>

        <InfoRow
            icon={Pin}
            value={`${street}<br>${brgy}, ${cOrM}<br>${pOrC}, ${region}`}
        />
    </div>
{/if}