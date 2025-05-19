<script lang="ts">
	import { dateToTimeMapping } from '$lib/mappings';

	import { normalizePhoneNumberForSMS } from './detailsUtility';

    import Phone from '$lib/icons/Phone.svelte';
	import Clock from '$lib/icons/Clock.svelte';

	import InfoRow from './InfoRow.svelte';

	let {
		phone,
		openingTime,
		closingTime,
	}: {
		phone?: string;
		openingTime?: Date;
		closingTime?: Date;
	} = $props();

	const formattedOpeningTime: string = dateToTimeMapping(openingTime);
	const formattedClosingTime: string = dateToTimeMapping(closingTime);
</script>

{#if phone || (openingTime && closingTime)}
    <div class="flex flex-col items-start gap-2 self-stretch">
        <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter']">
            Phone Number and Hours
        </p>

        {#if phone}
            <!-- Phone Number -->
            <InfoRow
                icon={Phone}
                label="Phone Number"
                value={phone}
                isLink={true}
                href={`sms:${normalizePhoneNumberForSMS(phone)}`}
            />
        {/if}

        {#if openingTime && closingTime}
            <!-- Hours -->
            <InfoRow
                icon={Clock}
                label="Hours"
                value={`${formattedOpeningTime} - ${formattedClosingTime}`}
            />
        {/if}
    </div>
{/if}