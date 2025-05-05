<script lang="ts">
	import Search from '$lib/icons/Search.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';
	import ArrowL from '$lib/icons/ArrowL.svelte';

	let {
		state = 'default', query, placeholder
	}: {
		state?: 'default' | 'error' | 'result'; query: string; placeholder: string;
	} = $props();

	const svgClass =
		'h-7 w-7 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700';
</script>

<div
	class={`
        flex flex-1 h-12 items-center gap-2 self-stretch rounded-full bg-neutral-50 px-5 py-3 shadow-lg shadow-neutral-100 border border-neutral-200 focus-within:ring-2 focus-within:ring-neutral-900
    `.trim()}
>
    <!-- if from search results, back button instead of search ang lalabas -->
	{#if state === 'result'}
		<button
			type="button"
			onclick={() => window.history.length > 1 && window.history.back()}
			class="text-neutral-900"
		>
			<ArrowL class={svgClass} />
		</button>
	{:else}
		<button type="submit" class="text-neutral-900">
			<Search class={svgClass} />
		</button>
	{/if}

	<div class="w-px h-6 bg-neutral-400"></div>

	<input
		type="text"
		name='query'
		bind:value={query}
		placeholder={state === 'error' ? 'Please enter a search query.' : placeholder}
		class="flex-1 border-none bg-transparent font-['Inter'] text-sm leading-tight font-normal tracking-tight placeholder-neutral-400 outline-none focus:ring-0
      ${state === 'error' ? 'text-error-on' : 'text-neutral-400 focus:text-neutral-900'}
    "
	/>

	{#if query}
		<button type="button" onclick={() => (query = '')} class="text-neutral-900">
			<ValueX class={svgClass} />
		</button>
	{/if}
</div>