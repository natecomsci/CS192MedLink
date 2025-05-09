<script lang="ts">
    import type { Snippet } from 'svelte';

    import { slide } from "svelte/transition";

	import ChevronD from '$lib/icons/ChevronD.svelte';

	let {
		text, content
	}: {
		text: string; content: Snippet;
	} = $props();

	let isOpen: boolean = $state(false);

</script>

<div class="flex items-center justify-between py-3 pr-4">
    <h2 class="text-primary-500 text-base font-bold tracking-tight leading-loose font-['Inter']">
        {text}
    </h2>

    <button type="button" onclick={() => (isOpen = !isOpen)} class="">
        <ChevronD
            class={
                `h-7 w-7 text-neutral-900 transition-transform duration-300 ease-in-out 
                ${isOpen ? 'rotate-180' : ''}`
            }
        />
    </button>
</div>

<hr class="self-stretch h-px border-neutral-200" />

{#if isOpen}
    <div class="bg-neutral-50 px-4 py-3">
        <p class:hidden={!isOpen} transition:slide={{ duration: 300 }}>
            {@render content()}
        </p>
    </div>
    <hr class="self-stretch h-px border-neutral-200" />
{/if}