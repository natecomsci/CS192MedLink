<script lang="ts">
    import type { Component } from 'svelte';

	let {
		icon,
		label,
		value,
		isLink = false,
		href,
		valueClass = "",
		valueColor = "text-neutral-900"
	}: {
		icon        : Component;
        label?      : string;
        value       : string;
        isLink?     : boolean;
        href?       : string;
        valueClass? : string;
        valueColor? : string;
	} = $props();

	const svgClass =
		"flex-shrink-0 h-5 w-5 text-primary-600 transition-colors duration-300 ease-in-out hover:text-primary-800 active:text-primary-800";

    const Visual = $derived(icon);
</script>

<div class="flex items-start gap-2 self-stretch text-xs leading-relaxed font-['Inter']">
    <Visual class={svgClass} />

    <div class="flex-1 flex items-start gap-1">
        {#if label}
            <span class="whitespace-nowrap font-bold text-neutral-900">{label}:</span>
        {/if}

        {#if isLink}
            <a
                href={href}
                class={`font-medium text-justify transition-colors duration-300 ease-in-out hover:text-primary-900 active:text-primary-900 ${valueColor}`}
            >
                {value}
            </a>
        {:else}
            <p class={`font-medium text-justify ${valueColor} ${valueClass}`}>{@html value}</p>
        {/if}
    </div>
</div>