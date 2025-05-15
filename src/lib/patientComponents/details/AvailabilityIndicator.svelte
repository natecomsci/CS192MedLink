<script lang="ts">
	import ValueC from '$lib/icons/ValueC.svelte';
	import ServiceLoader1 from '$lib/icons/ServiceLoader1.svelte';
	import ServiceLoader2 from '$lib/icons/ServiceLoader2.svelte';
	import ServiceLoader3 from '$lib/icons/ServiceLoader3.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';

    import type { Status1 } from '$lib';

	let {
		status
	}: {
		status: Status1;
	} = $props();

    const statusMapping = {
        "available"      : { bg: 'success-on', icon: ValueC, label: "Available" },
        "short delay"    : { bg: 'service-button-1', icon: ServiceLoader1, label: "Short Delay" },
        "moderate delay" : { bg: 'service-button-2', icon: ServiceLoader2, label: "Moderate Delay" },
        "extended delay" : { bg: 'service-button-3', icon: ServiceLoader3, label: "Extended Delay" },
        "unavailable"    : { bg: 'service-button-4', icon: ValueX, label: "Unavailable" },
    };

	const buttonAttributes = statusMapping[status];
</script>

<div class={`
    flex items-center justify-center gap-2 text-sm font-bold tracking-tight leading-loose font-['Inter'] rounded-full h-12 w-fit px-5 py-3 
    bg-${buttonAttributes.bg} 
    ${status === "short delay" ? "text-neutral-950" : "text-neutral-50"}
    shadow-${buttonAttributes.bg}
    shadow-md`
}>
    <buttonAttributes.icon class="h-5 w-5" />

	{buttonAttributes.label}
</div>