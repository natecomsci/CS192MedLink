<script lang="ts">
	import { onMount } from 'svelte';

	import { dateToTimeMapping } from '$lib/mappings';

	import { normalizePhoneNumberForSMS } from '$lib/patientComponents/details/detailsUtility';

	import type { PageProps } from './$types';
	import ArrowL from '$lib/icons/ArrowL.svelte';
	import Location from '$lib/patientComponents/details/Location.svelte';
	import InfoRow from '$lib/patientComponents/details/InfoRow.svelte';
	import Phone from '$lib/icons/Phone.svelte';
	import Email from '$lib/icons/Email.svelte';
	import Link from '$lib/icons/Link.svelte';
	import Clock from '$lib/icons/Clock.svelte';
	import Accordion from '$lib/patientComponents/Accordion.svelte';
	import ServiceStethoscope from '$lib/icons/ServiceStethoscope.svelte';
	import ChevronR from '$lib/icons/ChevronR.svelte';

	let { data }: PageProps = $props();

	let name              = data.name;
	let photo             = data.photo;
	let email             = data.email;
	let phoneNumber       = data.phoneNumber;
	let openingTime       = data.openingTime;
	let closingTime       = data.closingTime;
	let facilityType      = data.facilityType;
	let ownership         = data.ownership;
	let bookingSystem     = data.bookingSystem;
	let acceptedProviders = data.acceptedProviders;
	let hasDivisions      = data.hasDivisions;

	let { region, pOrC, cOrM, brgy, street } = data.address;

	const formattedOpeningTime: string = dateToTimeMapping(openingTime);
	const formattedClosingTime: string = dateToTimeMapping(closingTime);

	let scrollY: number = $state(0);

	const handleScroll = () => {
		scrollY = window.scrollY;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	});

	let height: number = $state(392);

	$effect(() => {
		height = scrollY < 100 ? 392 - scrollY * 2 : 196;
	});
</script>

{#snippet providers()}
	{#each acceptedProviders as provider}
		<div class={`${acceptedProviders.length > 1 ? "mb-2" : ""}`}>
			<InfoRow icon={ServiceStethoscope} value={provider} />
		</div>
	{/each}
{/snippet}

<div class="sticky top-0">
	<img
		src={photo}
		alt="Facility"
		class="w-full object-cover transition-all duration-300 ease-in-out"
		style="height: {height}px"
	/>

	<button
		type="button"
		onclick={() => window.history.length > 1 && window.history.back()}
		class="absolute top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-900"
	>
		<ArrowL
			class="h-8 w-8 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700"
		/>
	</button>
</div>

<div class="flex w-full flex-col items-center justify-center gap-4 px-6 pt-6 pb-14">
	<div class="flex w-full flex-col gap-3">
		<h1 class="text-primary-700 font-['DM_Sans'] text-[28px] leading-9 font-bold">{name}</h1>

		<p class="font-['Inter'] text-xs leading-none font-bold tracking-tight text-neutral-950">
			{ownership}
			{facilityType}
		</p>
	</div>

	<hr class="h-px self-stretch border-neutral-200" />

	<Location {region} {pOrC} {cOrM} {brgy} {street} facilityPage={true} />

	<div class="flex flex-col items-start gap-2 self-stretch">
		<p class="text-primary-500 font-['Inter'] text-base leading-normal font-bold tracking-tight">
			Contact Information
		</p>
		<InfoRow
			icon={Phone}
			label="Phone Number"
			value={phoneNumber}
			isLink={true}
			href={`sms:${normalizePhoneNumberForSMS(phoneNumber)}`}
		/>

		{#if email}
			<InfoRow
				icon={Email}
				label="Email Address"
				value={email}
				isLink={true}
				href={`mailto:${email}`}
			/>
		{/if}
	</div>

	{#if !hasDivisions}
		<div class="flex flex-col items-start gap-2 self-stretch">
			<p class="text-primary-500 font-['Inter'] text-base leading-normal font-bold tracking-tight">
				Operating Hours
			</p>

			<InfoRow
				icon={Clock}
				label="Hours"
				value={`${formattedOpeningTime} - ${formattedClosingTime}`}
			/>
		</div>
	{/if}

	{#if bookingSystem}
		<div class="flex flex-col items-start gap-2 self-stretch">
			<p class="text-primary-500 font-['Inter'] text-base leading-normal font-bold tracking-tight">
				Booking System Link
			</p>

			<InfoRow icon={Link} value={bookingSystem} isLink={true} href={bookingSystem} />
		</div>
	{/if}

	{#if acceptedProviders.length}
		<div class="w-full">
			<hr class="h-px self-stretch border-neutral-200" />

			<Accordion text="Accepted Health Plans" content={providers} />
		</div>
	{:else}
		<hr class="h-px self-stretch border-neutral-200" />
	{/if}

	<p
		class="text-primary-500 w-full font-['Inter'] text-base leading-normal font-bold tracking-tight"
	>
		What The Facility Offers
	</p>

	{#if hasDivisions}
		<div
			class="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 shadow-lg shadow-neutral-100"
		>
			<p class="text-primary-900 font-['Inter'] text-base leading-normal font-bold tracking-tight">
				Divisions
			</p>

			<form method="POST" action="?/viewDivisions" class="flex items-center">
				<button type="submit" class="text-neutral-900">
					<ChevronR
						class="h-7 w-7 transition-colors duration-300 hover:text-neutral-700 active:text-neutral-700"
					/>
				</button>
			</form>
		</div>
	{/if}

	<div
		class="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 shadow-lg shadow-neutral-100"
	>
		<p class="text-primary-900 font-['Inter'] text-base leading-normal font-bold tracking-tight">
			Services
		</p>

		<form method="POST" action="?/viewServices" class="flex items-center">
			<button type="submit" class="text-neutral-900">
				<ChevronR
					class="h-7 w-7 transition-colors duration-300 hover:text-neutral-700 active:text-neutral-700"
				/>
			</button>
		</form>
	</div>
</div>