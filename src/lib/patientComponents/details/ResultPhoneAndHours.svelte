<script lang="ts">
	import { dateToTimeMapping } from '../../Mappings';

	import { normalizePhoneNumberForSMS } from './detailsUtility';

	import Phone from '$lib/icons/Phone.svelte';
	import Clock from '$lib/icons/Clock.svelte';

	import InfoRow from './InfoRow.svelte';

	type Source = 'service' | 'facility' | 'division';
	let {
		phone,
		openingTime,
		closingTime,
		phoneSource,
		hoursSource,
	}: {
		phone: string;
		openingTime: Date;
		closingTime: Date;
		phoneSource: Source;
		hoursSource: Source;
	} = $props();

	function getText(phoneSource: string, hoursSource: string): string | [string, string] {
		const mapping: {
			facility: string;
			division: string;
		} = {
			facility: "Offering Facility",
			division: "Offering Division",
		};

		if (phoneSource === hoursSource) {
			const suffix = mapping[phoneSource as keyof typeof mapping];

			return suffix ? `Phone Number and Hours of ${suffix}` : "Phone Number and Hours";
		} else {
			const phoneSuffix = mapping[phoneSource as keyof typeof mapping];
			const hoursSuffix = mapping[hoursSource as keyof typeof mapping];

			const phoneText = phoneSuffix ? `Phone Number of ${phoneSuffix}` : "Phone Number";
			const hoursText = hoursSuffix ? `Hours of ${hoursSuffix}` : "Hours";

			return [phoneText, hoursText];
		}
	}

	let text: string | [string, string] = getText(phoneSource, hoursSource);

	const formattedOpeningTime: string = dateToTimeMapping(openingTime);
	const formattedClosingTime: string = dateToTimeMapping(closingTime);
</script>

{#if phoneSource === hoursSource}
    <div class="flex flex-col items-start gap-2 self-stretch font-['Inter']">
        <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
            {text}
        </p>

        <!-- Phone Number -->
        <InfoRow
            icon={Phone}
            label="Phone Number"
            value={phone}
            isLink={true}
            href={`sms:${normalizePhoneNumberForSMS(phone)}`}
        />

        <!-- Hours -->
        <InfoRow
            icon={Clock}
            label="Hours"
            value={`${formattedOpeningTime} - ${formattedClosingTime}`}
        />
    </div>

{:else}
    <div class="flex flex-col items-start gap-4 self-stretch font-['Inter']">
        <!-- Phone Number -->
        <div class="flex flex-col items-start gap-2 self-stretch">
            <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
                {text[0]}
            </p>

            <InfoRow
                icon={Phone}
                value={phone}
                isLink={true}
                href={`sms:${normalizePhoneNumberForSMS(phone)}`}
            />
        </div>

        <hr class="self-stretch h-px border-neutral-200" />

        <!-- Hours -->
        <div class="flex flex-col items-start gap-2 self-stretch">
            <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
                {text[1]}
            </p>

            <InfoRow
                icon={Clock}
                value={`${formattedOpeningTime} - ${formattedClosingTime}`}
            />
        </div>
    </div>
{/if}