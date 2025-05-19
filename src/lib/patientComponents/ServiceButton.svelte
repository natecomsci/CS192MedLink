<script lang="ts">
	import type { Component } from 'svelte';

	let {
		text,
		icon,
		href
	}: {
		text: string;
		icon: Component;
		href: string;
	} = $props();

	const Visual = $derived(icon);
</script>

<a
	{href}
	class="group flex h-25 w-25 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#9e8ba9] bg-neutral-50 p-3 shadow-md transition hover:shadow-lg"
>
	<Visual
		class="h-10 flex-shrink-0 fill-[#7B4B97] transition-colors duration-300 ease-in-out group-hover:fill-primary-800 group-active:fill-primary-800"
	/>
	<div
		class="text-center font-['Inter'] text-xs leading-normal font-semibold tracking-tight text-[#7B4B97] transition-colors duration-300 ease-in-out group-hover:text-primary-800 group-active:text-primary-800"
	>
		{@html text}
	</div>
</a>