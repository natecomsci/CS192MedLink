<script lang="ts">
	import ServiceCrowd1 from '$lib/icons/ServiceCrowd1.svelte';
	import ServiceCrowd2 from '$lib/icons/ServiceCrowd2.svelte';
	import ServiceCrowd3 from '$lib/icons/ServiceCrowd3.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';

	type Status = 'steady' | 'moderate' | 'crowded' | 'near-capacity' | 'full-capacity' | 'closed';

	let {
		status
	}: {
		status: Status;
	} = $props();

    const statusMapping = {
        "steady"        : { bg: '[#20A95D]',   icon: ServiceCrowd1, label: "Steady" },
        "moderate"      : { bg: '[#F5DBA6]',   icon: ServiceCrowd2, label: "Moderate" },
        "crowded"       : { bg: '[#E4A243]',   icon: ServiceCrowd2, label: "Crowded" },
        "near-capacity" : { bg: '[#9D6B50]',   icon: ServiceCrowd3, label: "Near-capacity" },
        "full-capacity" : { bg: '[#E63946]',   icon: ServiceCrowd3, label: "Full-capacity" },
        "closed"        : { bg: 'neutral-200', icon: ValueX, label: "Unavailable" },
    };

	const buttonAttributes = statusMapping[status];
</script>

<div class={`
    flex items-center justify-center gap-2 text-sm font-bold tracking-tight leading-loose font-['Inter'] rounded-full w-fit px-5 py-3 
    bg-${buttonAttributes.bg} 
    ${status === "moderate" || status === "closed" ? "text-neutral-950" : "text-neutral-50"}
    shadow-${buttonAttributes.bg}
    shadow-md`
}>
    <buttonAttributes.icon class="h-5 w-5" />

	{buttonAttributes.label}
</div>